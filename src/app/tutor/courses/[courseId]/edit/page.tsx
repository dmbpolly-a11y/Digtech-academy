import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CourseForm } from '../../CourseForm';
import { ModuleManager } from './ModuleManager';
import { PublishBar } from './PublishBar';

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const p = await params;
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: course } = await supabase.from('courses').select('*').eq('id', p.courseId).single();
  if (!course || course.tutor_id !== user.id) notFound();

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  const { data: modules } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', p.courseId)
    .order('position');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <PublishBar course={course} />

      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Course details</h2>
        <div className="mt-4">
          <CourseForm categories={categories ?? []} mode="edit" course={course} />
        </div>
      </div>

      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Course outline</h2>
        <p className="mt-1 text-sm text-ink/60">Add modules, then lessons with a YouTube video and an optional PDF resource.</p>
        <div className="mt-4">
          <ModuleManager
            courseId={course.id}
            initialModules={(modules ?? []).map((m: any) => ({ ...m, lessons: (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position) }))}
          />
        </div>
      </div>
    </div>
  );
}
