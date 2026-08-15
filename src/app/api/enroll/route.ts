import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initiatePandoraPayment } from '@/lib/payments';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'You must be logged in to enrol.' }, { status: 401 });

  const { courseId } = await request.json();
  if (!courseId) return NextResponse.json({ error: 'Missing courseId.' }, { status: 400 });

  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).eq('status', 'published').single();
  if (!course) return NextResponse.json({ error: 'Course not found or unavailable.' }, { status: 404 });

  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: 'You are already enrolled in this course.' }, { status: 409 });

  const { data: profile } = await supabase.from('users').select('full_name, mobile_number').eq('id', user.id).single();

  // Free course: enrol immediately, no payment needed.
  if (course.is_free || course.fee === 0) {
    const { error: enrollError } = await supabase.from('enrollments').insert({ student_id: user.id, course_id: courseId });
    if (enrollError) return NextResponse.json({ error: 'Could not create enrolment.' }, { status: 500 });

    if (profile?.mobile_number) {
      await sendSms({ userId: user.id, phoneNumber: profile.mobile_number, event: 'enrollment', vars: { course: course.title } });
    }

    return NextResponse.json({ freeEnrollment: true });
  }

  // Paid course: create a pending payment record, then hand off to Pandora.
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({ student_id: user.id, course_id: courseId, amount: course.fee, status: 'pending' })
    .select()
    .single();

  if (paymentError || !payment) return NextResponse.json({ error: 'Could not start payment.' }, { status: 500 });

  const { checkoutUrl, providerReference } = await initiatePandoraPayment({
    amountUgx: course.fee,
    reference: payment.id,
    description: `Enrolment: ${course.title}`,
    customerPhone: profile?.mobile_number ?? '',
    customerName: profile?.full_name ?? 'Student',
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/student/courses?payment=${payment.id}`
  });

  await supabase.from('payments').update({ provider_reference: providerReference }).eq('id', payment.id);

  return NextResponse.json({ checkoutUrl });
}
