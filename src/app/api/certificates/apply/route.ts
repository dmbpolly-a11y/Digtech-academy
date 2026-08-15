import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { enrollmentId } = await request.json();
  if (!enrollmentId) return NextResponse.json({ error: 'Missing enrollmentId.' }, { status: 400 });

  const { data: enrollment } = await supabase.from('enrollments').select('*').eq('id', enrollmentId).single();
  if (!enrollment || enrollment.student_id !== user.id) {
    return NextResponse.json({ error: 'Enrolment not found.' }, { status: 404 });
  }
  if (enrollment.progress_percent < 100) {
    return NextResponse.json({ error: 'This course is not yet 100% complete.' }, { status: 400 });
  }

  const { data: existing } = await supabase.from('certificates').select('*').eq('enrollment_id', enrollmentId).maybeSingle();

  if (existing) {
    if (existing.status !== 'not_applied' && existing.status !== 'rejected') {
      return NextResponse.json({ error: 'You have already applied for this certificate.' }, { status: 409 });
    }
    await supabase.from('certificates').update({ status: 'pending_review', applied_at: new Date().toISOString() }).eq('id', existing.id);
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from('certificates').insert({
    enrollment_id: enrollmentId,
    student_id: user.id,
    course_id: enrollment.course_id,
    status: 'pending_review',
    applied_at: new Date().toISOString()
  });

  if (error) return NextResponse.json({ error: 'Could not submit application.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
