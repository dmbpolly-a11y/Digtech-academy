import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CoursePlayer } from './CoursePlayer';

export default async function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const p = await params;
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('student_id', user.id)
    .eq('course_id', p.courseId)
    .single();

  if (!enrollment) notFound();

  const { data: course } = await supabase.from('courses').select('*').eq('id', p.courseId).single();
  if (!course) notFound();

  const { data: modules } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', p.courseId)
    .order('position');

  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id, watched')
    .eq('enrollment_id', enrollment.id);

  const watchedIds = new Set((progressRows ?? []).filter((p) => p.watched).map((p) => p.lesson_id));

  const { data: certificate } = await supabase.from('certificates').select('*').eq('enrollment_id', enrollment.id).maybeSingle();

  return (
    <CoursePlayer
      course={course}
      modules={(modules ?? []).map((m: any) => ({
        ...m,
        lessons: (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position)
      }))}
      enrollment={enrollment}
      watchedLessonIds={Array.from(watchedIds)}
      certificate={certificate}
      currentUserId={user.id}
    />
  );
}
