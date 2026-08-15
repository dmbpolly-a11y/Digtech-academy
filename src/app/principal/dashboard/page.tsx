import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/server';

export default async function PrincipalDashboardPage() {
  const supabase = createClient();

  const [{ count: pendingTutors }, { count: totalStudents }, { count: pendingCerts }, { count: pendingLiveApps }] = await Promise.all([
    supabase.from('tutors').select('user_id', { count: 'exact', head: true }).eq('is_activated', false),
    supabase.from('students').select('user_id', { count: 'exact', head: true }),
    supabase.from('certificates').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('live_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending')
  ]);

  const cards = [
    { label: 'Tutors awaiting activation', value: pendingTutors ?? 0, icon: 'lucide:graduation-cap', href: '/principal/tutors', accent: 'text-gold' },
    { label: 'Total students', value: totalStudents ?? 0, icon: 'lucide:users', href: '/principal/students', accent: 'text-brand' },
    { label: 'Certificates pending review', value: pendingCerts ?? 0, icon: 'lucide:award', href: '/principal/certificates', accent: 'text-action' },
    { label: 'New live class applications', value: pendingLiveApps ?? 0, icon: 'lucide:radio', href: '/principal/live-applications', accent: 'text-success' }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Principal overview</h1>
      <p className="mt-1 text-sm text-ink/60">School management — activations, students, certificates and live class applications.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card hover:border-action">
            <IconifyIcon icon={c.icon} className={`h-5 w-5 ${c.accent}`} />
            <p className="mt-3 font-display text-2xl font-bold text-ink">{c.value}</p>
            <p className="text-xs text-ink/60">{c.label}</p>
            <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand">Review <IconifyIcon icon="lucide:arrow-right" className="h-3 w-3" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
