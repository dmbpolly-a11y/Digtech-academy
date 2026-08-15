import { createClient } from '@/lib/supabase/server';
import { CourseForm } from '../CourseForm';

export const metadata = { title: 'New Course' };

export default async function NewCoursePage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Create a new course</h1>
      <p className="mt-1 text-sm text-ink/60">Start with the basics — you'll add modules and lessons next.</p>
      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <CourseForm categories={categories ?? []} mode="create" />
      </div>
    </div>
  );
}
