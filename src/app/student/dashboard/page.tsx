import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { HandshakeIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { ProgressRing } from '@/components/ProgressRing';
import { formatCurrency } from '@/lib/validation';

export default async function StudentDashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('users').select('full_name').eq('id', user!.id).single();

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(title, thumbnail_url, fee)')
    .eq('student_id', user!.id)
    .order('enrolled_at', { ascending: false });

  const { data: certificates } = await supabase.from('certificates').select('*').eq('student_id', user!.id).eq('status', 'issued');

  const total = enrollments?.length ?? 0;
  const completed = enrollments?.filter((e) => e.status === 'completed').length ?? 0;
  const avgProgress = total > 0 ? Math.round((enrollments!.reduce((s, e) => s + e.progress_percent, 0) / total) * 100) / 100 : 0;

  const stats = [
    { label: 'Total Courses', value: total, icon: 'lucide:book-open' },
    { label: 'Completed Courses', value: completed, icon: 'lucide:check-circle-2' },
    { label: 'Certificates', value: certificates?.length ?? 0, icon: 'lucide:award' }
  ];

  const inProgress = (enrollments ?? []).filter((e) => e.status === 'active').slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'} <HandshakeIcon className="h-6 w-6 text-action inline ml-1" /></h1>
      <p className="mt-1 text-sm text-ink/60">Here&apos;s where your learning stands today.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
              <IconifyIcon icon={s.icon} className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
              <p className="text-xs text-ink/60">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Continue learning</h2>
            <Link href="/student/courses" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
          </div>

          <div className="mt-4 space-y-3">
            {inProgress.length === 0 && (
              <div className="rounded-xl2 border border-dashed border-brand-light p-8 text-center text-sm text-ink/50">
                You haven&apos;t started a course yet. <Link href="/courses" className="font-semibold text-brand hover:underline">Browse courses →</Link>
              </div>
            )}
            {inProgress.map((e: any) => (
              <Link key={e.id} href={`/student/learn/${e.course_id}`} className="flex items-center gap-4 rounded-xl2 border border-brand-light bg-white p-4 hover:border-action">
                <ProgressRing percent={e.progress_percent} size={48} strokeWidth={5} />
                <div className="flex-1">
                  <p className="font-semibold text-ink">{e.courses.title}</p>
                  <p className="text-xs text-ink/50">{e.progress_percent}% complete</p>
                </div>
                <span className="rounded-full bg-action px-4 py-1.5 text-xs font-semibold text-white">Continue</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <IconifyIcon icon="lucide:trending-up" className="h-4 w-4 text-action" /> Progress summary
          </div>
          <div className="mt-4 flex justify-center">
            <ProgressRing percent={avgProgress} size={110} strokeWidth={9} />
          </div>
          <p className="mt-3 text-center text-xs text-ink/60">Average completion across all enrolled courses</p>
        </div>
      </div>
    </div>
  );
}
