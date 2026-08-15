import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';

export default async function TutorDashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: tutor } = await supabase.from('tutors').select('*').eq('user_id', user!.id).single();
  const { data: courses } = await supabase.from('courses').select('id, title, status, enrollment_count').eq('tutor_id', user!.id);

  const courseIds = (courses ?? []).map((c) => c.id);
  const { count: studentCount } = courseIds.length
    ? await supabase.from('enrollments').select('id', { count: 'exact', head: true }).in('course_id', courseIds)
    : { count: 0 };

  const stats = [
    { label: 'Courses', value: courses?.length ?? 0, icon: 'lucide:book-open' },
    { label: 'Students', value: studentCount ?? 0, icon: 'lucide:users' },
    { label: 'Total earned', value: formatCurrency(tutor?.total_earned ?? 0), icon: 'lucide:trending-up' },
    { label: 'Withdrawable balance', value: formatCurrency(tutor?.wallet_balance ?? 0), icon: 'lucide:wallet' }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Tutor overview</h1>
      <p className="mt-1 text-sm text-ink/60">You keep {tutor?.revenue_share_percent ?? 70}% of every enrolment fee.</p>

      {tutor && !tutor.is_activated && (
        <div className="mt-5 flex items-start gap-3 rounded-xl2 border border-gold/40 bg-gold-light p-4 text-sm text-ink/80">
          <IconifyIcon icon="lucide:shield-alert" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="font-semibold">Your account is awaiting activation</p>
            <p className="mt-1">A Principal reviews new tutors before courses can be published. Complete your profile with your qualifications and ID to speed this up.</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
            <IconifyIcon icon={s.icon} className="h-5 w-5 text-action" />
            <p className="mt-3 font-display text-xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Your courses</h2>
        <Link href="/tutor/courses/new" className="rounded-full bg-action px-4 py-2 text-sm font-semibold text-white hover:bg-action-dark">
          + New course
        </Link>
      </div>

      <div className="mt-4 divide-y divide-brand-light rounded-xl2 border border-brand-light bg-white">
        {(courses ?? []).map((c) => (
          <Link key={c.id} href={`/tutor/courses/${c.id}/edit`} className="flex items-center justify-between p-4 hover:bg-brand-light/40">
            <div>
              <p className="font-semibold text-ink">{c.title}</p>
              <p className="text-xs text-ink/50">{c.enrollment_count} students</p>
            </div>
            <StatusBadge status={c.status} />
          </Link>
        ))}
        {(!courses || courses.length === 0) && (
          <p className="p-6 text-center text-sm text-ink/50">You haven&apos;t created a course yet.</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-ink/10 text-ink/60',
    pending_review: 'bg-gold-light text-gold',
    published: 'bg-success/10 text-success',
    suspended: 'bg-red-50 text-red-600'
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}>{status.replace('_', ' ')}</span>;
}
