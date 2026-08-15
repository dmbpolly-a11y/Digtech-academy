import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';

export const metadata = { title: 'My Courses' };

export default async function TutorCoursesPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('tutor_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">My Courses</h1>
        <Link href="/tutor/courses/new" className="rounded-full bg-action px-4 py-2 text-sm font-semibold text-white hover:bg-action-dark">
          + New course
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c) => (
          <Link key={c.id} href={`/tutor/courses/${c.id}/edit`} className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card hover:border-action">
            <p className="font-semibold text-ink">{c.title}</p>
            <p className="mt-1 text-xs text-ink/50 capitalize">{c.status.replace('_', ' ')}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-mono font-bold text-brand">{c.is_free ? 'Free' : formatCurrency(c.fee)}</span>
              <span className="text-ink/50">{c.enrollment_count} students</span>
            </div>
          </Link>
        ))}

        {(!courses || courses.length === 0) && (
          <div className="col-span-full rounded-xl2 border border-dashed border-brand-light p-10 text-center text-sm text-ink/50">
            No courses yet. <Link href="/tutor/courses/new" className="font-semibold text-brand hover:underline">Create your first course →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
