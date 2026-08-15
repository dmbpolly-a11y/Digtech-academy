import { createClient } from '@/lib/supabase/server';
import { CourseModerationRow } from './CourseModerationRow';

export const metadata = { title: 'Courses' };

export default async function AdminCoursesPage() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*, tutors(users(full_name))')
    .order('created_at', { ascending: false });

  const pending = (courses ?? []).filter((c) => c.status === 'pending_review');
  const others = (courses ?? []).filter((c) => c.status !== 'pending_review');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Courses</h1>
      <p className="mt-1 text-sm text-ink/60">Review submissions and moderate what's live.</p>

      <h2 className="mt-6 font-display text-lg font-bold text-ink">Pending review ({pending.length})</h2>
      <div className="mt-3 space-y-2">
        {pending.map((c: any) => <CourseModerationRow key={c.id} course={c} />)}
        {pending.length === 0 && <p className="rounded-xl2 border border-dashed border-brand-light p-6 text-center text-sm text-ink/50">Nothing pending.</p>}
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">All courses</h2>
      <div className="mt-3 space-y-2">
        {others.map((c: any) => <CourseModerationRow key={c.id} course={c} />)}
      </div>
    </div>
  );
}
