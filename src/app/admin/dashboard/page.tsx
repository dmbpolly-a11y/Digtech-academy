import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: totalStudents },
    { count: totalTutors },
    { count: totalCourses },
    { count: pendingCourses },
    { count: pendingWithdrawals },
    { count: pendingCerts },
    { data: successPayments }
  ] = await Promise.all([
    supabase.from('students').select('user_id', { count: 'exact', head: true }),
    supabase.from('tutors').select('user_id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('withdrawals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('certificates').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('payments').select('amount, platform_share').eq('status', 'success')
  ]);

  const totalRevenue = (successPayments ?? []).reduce((s, p) => s + Number(p.amount), 0);
  const platformRevenue = (successPayments ?? []).reduce((s, p) => s + Number(p.platform_share ?? 0), 0);

  const stats = [
    { label: 'Total students', value: totalStudents ?? 0, icon: 'lucide:users' },
    { label: 'Total tutors', value: totalTutors ?? 0, icon: 'lucide:graduation-cap' },
    { label: 'Total courses', value: totalCourses ?? 0, icon: 'lucide:book-open' },
    { label: 'Gross revenue', value: formatCurrency(totalRevenue), icon: 'lucide:wallet' },
    { label: 'Platform revenue', value: formatCurrency(platformRevenue), icon: 'lucide:wallet' }
  ];

  const actions = [
    { label: 'Courses pending review', value: pendingCourses ?? 0, href: '/admin/courses' },
    { label: 'Withdrawals pending', value: pendingWithdrawals ?? 0, href: '/admin/withdrawals' },
    { label: 'Certificates pending', value: pendingCerts ?? 0, href: '/admin/certificates' }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">System overview</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
            <IconifyIcon icon={s.icon} className="h-5 w-5 text-action" />
            <p className="mt-3 font-display text-xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Needs your attention</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {actions.map((a) => (
          <Link key={a.label} href={a.href} className="flex items-center justify-between rounded-xl2 border border-brand-light bg-white p-4 hover:border-action">
            <div>
              <p className="font-display text-xl font-bold text-ink">{a.value}</p>
              <p className="text-xs text-ink/60">{a.label}</p>
            </div>
            <IconifyIcon icon="lucide:arrow-right" className="h-4 w-4 text-brand" />
          </Link>
        ))}
      </div>
    </div>
  );
}
