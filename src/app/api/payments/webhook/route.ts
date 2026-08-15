import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { verifyPandoraWebhookSignature, splitRevenue } from '@/lib/payments';
import { sendSms } from '@/lib/sms';

/**
 * Pandora calls this endpoint after a checkout attempt completes.
 * Expected payload shape (adjust once Pandora's real webhook contract is known):
 * { reference: string /* payment.id *\/, status: 'success' | 'failed', provider_reference: string }
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-pandora-signature');

  if (!verifyPandoraWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const supabase = createServiceClient();

  const { data: payment } = await supabase.from('payments').select('*, courses(*), students:student_id(user_id, users(full_name, mobile_number))').eq('id', payload.reference).single();
  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

  if (payload.status !== 'success') {
    await supabase.from('payments').update({ status: 'failed' }).eq('id', payment.id);
    return NextResponse.json({ ok: true });
  }

  const course = (payment as any).courses;
  const { data: tutor } = await supabase.from('tutors').select('*').eq('user_id', course.tutor_id).single();
  const { tutorShare, platformShare } = splitRevenue(payment.amount, tutor?.revenue_share_percent ?? 70);

  await supabase
    .from('payments')
    .update({ status: 'success', confirmed_at: new Date().toISOString(), tutor_share: tutorShare, platform_share: platformShare })
    .eq('id', payment.id);

  // Credit tutor wallet
  await supabase
    .from('tutors')
    .update({ wallet_balance: (tutor?.wallet_balance ?? 0) + tutorShare, total_earned: (tutor?.total_earned ?? 0) + tutorShare })
    .eq('user_id', course.tutor_id);

  // Create the enrollment (idempotent — ignore if it already exists)
  await supabase.from('enrollments').upsert(
    { student_id: payment.student_id, course_id: payment.course_id },
    { onConflict: 'student_id,course_id', ignoreDuplicates: true }
  );

  // --- SMS notifications: student, tutor, principal(s), admin(s) ---
  const studentUser = (payment as any).students?.users;
  if (studentUser?.mobile_number) {
    await sendSms({ userId: payment.student_id, phoneNumber: studentUser.mobile_number, event: 'payment_success', vars: { amount: String(payment.amount), course: course.title } });
  }

  const { data: tutorUser } = await supabase.from('users').select('mobile_number, full_name').eq('id', course.tutor_id).single();
  if (tutorUser?.mobile_number) {
    await sendSms({ userId: course.tutor_id, phoneNumber: tutorUser.mobile_number, event: 'tutor_new_enrollment', vars: { student: studentUser?.full_name ?? 'A student', course: course.title } });
  }

  const { data: principalsAndAdmins } = await supabase.from('users').select('id, role, mobile_number').in('role', ['principal', 'admin']);
  for (const staff of principalsAndAdmins ?? []) {
    if (!staff.mobile_number) continue;
    if (staff.role === 'principal') {
      await sendSms({ userId: staff.id, phoneNumber: staff.mobile_number, event: 'principal_new_enrollment', vars: { student: studentUser?.full_name ?? 'A student', course: course.title } });
    } else {
      await sendSms({ userId: staff.id, phoneNumber: staff.mobile_number, event: 'admin_new_payment', vars: { amount: String(payment.amount), course: course.title } });
    }
  }

  return NextResponse.json({ ok: true });
}
