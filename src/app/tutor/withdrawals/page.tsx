import { createClient } from '@/lib/supabase/server';
import { WithdrawalForm } from './WithdrawalForm';
import { formatCurrency } from '@/lib/validation';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Withdrawals' };

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gold-light text-gold',
  approved: 'bg-brand-light text-brand',
  paid: 'bg-success/10 text-success',
  rejected: 'bg-red-50 text-red-600'
};

export default async function WithdrawalsPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: tutor } = await supabase.from('tutors').select('wallet_balance').eq('user_id', user!.id).single();
  const { data: withdrawals } = await supabase.from('withdrawals').select('*').eq('tutor_id', user!.id).order('requested_at', { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Withdrawals</h1>
      <p className="mt-1 text-sm text-ink/60">Requests are processed within 2 working days.</p>

      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <p className="text-xs text-ink/60">Available balance</p>
        <p className="mt-1 font-display text-3xl font-bold text-brand">{formatCurrency(tutor?.wallet_balance ?? 0)}</p>
        <div className="mt-5">
          <WithdrawalForm availableBalance={tutor?.wallet_balance ?? 0} />
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">History</h2>
      <div className="mt-4 space-y-2">
        {(withdrawals ?? []).map((w: any) => (
          <div key={w.id} className="flex items-center justify-between rounded-xl2 border border-brand-light bg-white p-4">
            <div>
              <p className="font-semibold text-ink">{formatCurrency(w.amount)}</p>
              <p className="text-xs text-ink/50 capitalize">{w.method.replace('_', ' ')} • Requested {formatDate(w.requested_at)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[w.status]}`}>{w.status}</span>
          </div>
        ))}
        {(!withdrawals || withdrawals.length === 0) && (
          <p className="rounded-xl2 border border-dashed border-brand-light p-8 text-center text-sm text-ink/50">No withdrawal requests yet.</p>
        )}
      </div>
    </div>
  );
}
