import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { enrollmentId, lessonId } = await request.json();
  if (!enrollmentId || !lessonId) return NextResponse.json({ error: 'Missing enrollmentId or lessonId.' }, { status: 400 });

  // Confirm the enrollment belongs to this student (RLS also enforces this).
  const { data: enrollment } = await supabase.from('enrollments').select('id, student_id, course_id').eq('id', enrollmentId).single();
  if (!enrollment || enrollment.student_id !== user.id) {
    return NextResponse.json({ error: 'Enrolment not found.' }, { status: 404 });
  }

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      { enrollment_id: enrollmentId, lesson_id: lessonId, watched: true, watched_at: new Date().toISOString() },
      { onConflict: 'enrollment_id,lesson_id' }
    );

  if (error) return NextResponse.json({ error: 'Could not save progress.' }, { status: 500 });

  const { data: updated } = await supabase.from('enrollments').select('progress_percent, status').eq('id', enrollmentId).single();

  return NextResponse.json({ progressPercent: updated?.progress_percent ?? 0, status: updated?.status });
}
