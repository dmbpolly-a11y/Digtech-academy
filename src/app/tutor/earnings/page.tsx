import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Earnings' };

export default async function TutorEarningsPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: tutor } = await supabase.from('tutors').select('*').eq('user_id', user!.id).single();
  const { data: courses } = await supabase.from('courses').select('id, title').eq('tutor_id', user!.id);
  const courseIds = (courses ?? []).map((c) => c.id);

  const { data: payments } = courseIds.length
    ? await supabase
        .from('payments')
        .select('*, courses(title)')
        .in('course_id', courseIds)
        .eq('status', 'success')
        .order('confirmed_at', { ascending: false })
        .limit(30)
    : { data: [] };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Earnings</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <p className="text-xs text-ink/60">Total earned</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand">{formatCurrency(tutor?.total_earned ?? 0)}</p>
        </div>
        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <p className="text-xs text-ink/60">Withdrawable balance</p>
          <p className="mt-1 font-display text-2xl font-bold text-action">{formatCurrency(tutor?.wallet_balance ?? 0)}</p>
        </div>
        <div className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
          <p className="text-xs text-ink/60">Your revenue share</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{tutor?.revenue_share_percent ?? 70}%</p>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Payment history</h2>
      <div className="mt-4 overflow-x-auto rounded-xl2 border border-brand-light bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-light text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="p-4">Course</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Your share</th>
              <th className="p-4">Digtech's share</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {(payments ?? []).map((p: any) => (
              <tr key={p.id}>
                <td className="p-4 text-ink">{p.courses?.title}</td>
                <td className="p-4 text-ink/70">{formatCurrency(p.amount)}</td>
                <td className="p-4 font-semibold text-success">{formatCurrency(p.tutor_share ?? 0)}</td>
                <td className="p-4 text-ink/50">{formatCurrency(p.platform_share ?? 0)}</td>
                <td className="p-4 text-xs text-ink/50">{p.confirmed_at ? formatDate(p.confirmed_at) : '—'}</td>
              </tr>
            ))}
            {(!payments || payments.length === 0) && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-ink/50">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
