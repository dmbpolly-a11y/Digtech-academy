import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ProgressRing } from '@/components/ProgressRing';

export const metadata = { title: 'My Courses' };

export default async function MyCoursesPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(title, thumbnail_url, tutors(users(full_name)))')
    .eq('student_id', user!.id)
    .order('enrolled_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">My Courses</h1>
      <p className="mt-1 text-sm text-ink/60">{enrollments?.length ?? 0} course{(enrollments?.length ?? 0) === 1 ? '' : 's'} enrolled</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(enrollments ?? []).map((e: any) => (
          <div key={e.id} className="overflow-hidden rounded-xl2 border border-brand-light bg-white shadow-card">
            <div className="relative aspect-video bg-brand-light">
              {e.courses.thumbnail_url ? (
                <Image src={e.courses.thumbnail_url} alt={e.courses.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-2xl text-brand/30">{e.courses.title[0]}</div>
              )}
              <div className="absolute bottom-2 right-2">
                <ProgressRing percent={e.progress_percent} size={44} strokeWidth={5} colorClassName={e.status === 'completed' ? 'text-success' : 'text-action'} />
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 font-semibold text-ink">{e.courses.title}</p>
              <p className="mt-1 text-xs text-ink/50">by {e.courses.tutors?.users?.full_name ?? 'Digtech Tutor'}</p>
              <Link
                href={`/student/learn/${e.course_id}`}
                className="mt-4 block rounded-full bg-action py-2 text-center text-sm font-semibold text-white hover:bg-action-dark"
              >
                {e.status === 'completed' ? 'Review course' : 'Continue Learning'}
              </Link>
            </div>
          </div>
        ))}

        {(!enrollments || enrollments.length === 0) && (
          <div className="col-span-full rounded-xl2 border border-dashed border-brand-light p-10 text-center text-sm text-ink/50">
            You're not enrolled in any courses yet. <Link href="/courses" className="font-semibold text-brand hover:underline">Browse courses →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
