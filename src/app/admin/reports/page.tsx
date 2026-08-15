import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { StarIcon } from '@/components/icons';

export const metadata = { title: 'Reports' };

export default async function AdminReportsPage() {
  const supabase = createClient();

  const [{ data: courses }, { data: payments }, { data: enrollments }] = await Promise.all([
    supabase.from('courses').select('title, enrollment_count, rating_avg, status').eq('status', 'published').order('enrollment_count', { ascending: false }).limit(8),
    supabase.from('payments').select('amount, confirmed_at').eq('status', 'success').order('confirmed_at', { ascending: false }).limit(500),
    supabase.from('enrollments').select('status')
  ]);

  const monthly: Record<string, number> = {};
  for (const p of payments ?? []) {
    if (!p.confirmed_at) continue;
    const key = new Date(p.confirmed_at).toLocaleDateString('en-UG', { month: 'short', year: '2-digit' });
    monthly[key] = (monthly[key] ?? 0) + Number(p.amount);
  }
  const monthlyEntries = Object.entries(monthly).slice(-6);
  const maxMonthly = Math.max(1, ...monthlyEntries.map(([, v]) => v));

  const totalEnrollments = enrollments?.length ?? 0;
  const completed = (enrollments ?? []).filter((e) => e.status === 'completed').length;
  const completionRate = totalEnrollments > 0 ? Math.round((completed / totalEnrollments) * 100) : 0;

  const { count: activeStudents } = await supabase
    .from('enrollments')
    .select('student_id', { count: 'exact', head: true })
    .eq('status', 'active');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Reports & analytics</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <IconifyIcon icon="lucide:award" className="h-5 w-5 text-action" />
          <p className="mt-3 font-display text-2xl font-bold text-ink">{completionRate}%</p>
          <p className="text-xs text-ink/60">Course completion rate</p>
        </div>
        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <IconifyIcon icon="lucide:users" className="h-5 w-5 text-action" />
          <p className="mt-3 font-display text-2xl font-bold text-ink">{activeStudents ?? 0}</p>
          <p className="text-xs text-ink/60">Actively learning right now</p>
        </div>
        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <IconifyIcon icon="lucide:trending-up" className="h-5 w-5 text-action" />
          <p className="mt-3 font-display text-2xl font-bold text-ink">
            {formatCurrency((payments ?? []).reduce((s, p) => s + Number(p.amount), 0))}
          </p>
          <p className="text-xs text-ink/60">Revenue (last 500 payments)</p>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Revenue trend</h2>
      <div className="mt-4 flex items-end gap-4 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        {monthlyEntries.length === 0 && <p className="text-sm text-ink/50">No revenue data yet.</p>}
        {monthlyEntries.map(([month, amount]) => (
          <div key={month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end">
              <div className="w-full rounded-t-lg bg-action" style={{ height: `${(amount / maxMonthly) * 100}%` }} />
            </div>
            <p className="text-xs font-semibold text-ink">{month}</p>
            <p className="font-mono text-[10px] text-ink/50">{formatCurrency(amount)}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Most popular courses</h2>
      <div className="mt-4 divide-y divide-brand-light rounded-xl2 border border-brand-light bg-white">
        {(courses ?? []).map((c: any, i: number) => (
          <div key={c.title} className="flex items-center gap-4 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">{i + 1}</span>
            <IconifyIcon icon="lucide:book-open" className="h-4 w-4 shrink-0 text-action" />
            <p className="flex-1 text-sm font-medium text-ink">{c.title}</p>
            <span className="flex items-center gap-1 text-xs text-ink/50"><StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating_avg.toFixed(1)}</span>
            <span className="text-xs font-semibold text-brand">{c.enrollment_count} students</span>
          </div>
        ))}
        {(!courses || courses.length === 0) && <p className="p-6 text-center text-sm text-ink/50">No published courses yet.</p>}
      </div>
    </div>
  );
}
