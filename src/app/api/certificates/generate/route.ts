import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { generateCertificatePdf } from '@/lib/certificates';
import { sendSms } from '@/lib/sms';
import { formatDate } from '@/lib/utils';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'principal'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only Principals and Admins can approve certificates.' }, { status: 403 });
  }

  const { certificateId, action } = await request.json(); // action: 'approve' | 'reject'
  if (!certificateId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: cert } = await service
    .from('certificates')
    .select('*, students:student_id(users(full_name, mobile_number)), courses(title, tutor_id)')
    .eq('id', certificateId)
    .single();

  if (!cert) return NextResponse.json({ error: 'Certificate application not found.' }, { status: 404 });

  if (action === 'reject') {
    await service.from('certificates').update({ status: 'rejected', reviewed_by: user.id }).eq('id', certificateId);
    return NextResponse.json({ ok: true, status: 'rejected' });
  }

  const { data: tutorUser } = await service.from('users').select('full_name').eq('id', (cert as any).courses.tutor_id).single();

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${cert.verification_code}`;
  const pdfBytes = await generateCertificatePdf({
    studentName: (cert as any).students?.users?.full_name ?? 'Student',
    courseTitle: (cert as any).courses.title,
    tutorName: tutorUser?.full_name ?? 'Digtech Academy',
    issuedDate: formatDate(new Date().toISOString()),
    verificationCode: cert.verification_code,
    verifyUrl
  });

  const filePath = `certificates/${cert.id}.pdf`;
  const { error: uploadError } = await service.storage.from('certificates').upload(filePath, pdfBytes, {
    contentType: 'application/pdf',
    upsert: true
  });

  if (uploadError) {
    return NextResponse.json({ error: 'Could not generate the certificate PDF. Check that a "certificates" storage bucket exists.' }, { status: 500 });
  }

  const { data: publicUrl } = service.storage.from('certificates').getPublicUrl(filePath);

  await service
    .from('certificates')
    .update({ status: 'issued', pdf_url: publicUrl.publicUrl, reviewed_by: user.id, issued_at: new Date().toISOString() })
    .eq('id', certificateId);

  const studentPhone = (cert as any).students?.users?.mobile_number;
  if (studentPhone) {
    await sendSms({
      phoneNumber: studentPhone,
      event: 'certificate_issued',
      vars: { name: (cert as any).students?.users?.full_name ?? 'Student', course: (cert as any).courses.title }
    });
  }

  return NextResponse.json({ ok: true, status: 'issued', pdfUrl: publicUrl.publicUrl });
}
