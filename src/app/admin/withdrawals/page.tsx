import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';
import { formatDate } from '@/lib/utils';
import { WithdrawalActions } from './WithdrawalActions';

export const metadata = { title: 'Withdrawals' };

export default async function AdminWithdrawalsPage() {
  const supabase = createClient();

  const { data: withdrawals } = await supabase
    .from('withdrawals')
    .select('*, tutors(users(full_name, mobile_number))')
    .order('requested_at', { ascending: false });

  const pending = (withdrawals ?? []).filter((w: any) => w.status === 'pending' || w.status === 'approved');
  const history = (withdrawals ?? []).filter((w: any) => w.status === 'paid' || w.status === 'rejected');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Withdrawal requests</h1>
      <p className="mt-1 text-sm text-ink/60">Process tutor payout requests. Target: within 2 working days of the request.</p>

      <h2 className="mt-6 font-display text-lg font-bold text-ink">Needs action ({pending.length})</h2>
      <div className="mt-3 space-y-3">
        {pending.map((w: any) => (
          <div key={w.id} className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{w.tutors?.users?.full_name}</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-brand">{formatCurrency(w.amount)}</p>
                <p className="mt-1 text-xs text-ink/60 capitalize">
                  {w.method.replace('_', ' ')} —{' '}
                  {w.method === 'mobile_money' ? `${w.mm_full_name}, ${w.mm_phone_number}` : `${w.bank_name}, ${w.bank_account_name} (${w.bank_account_number})`}
                </p>
                <p className="mt-1 text-xs text-ink/40">
                  Requested {formatDate(w.requested_at)} • Expected by {formatDate(w.expected_by)}
                </p>
              </div>
              <WithdrawalActions withdrawal={w} />
            </div>
          </div>
        ))}
        {pending.length === 0 && <p className="rounded-xl2 border border-dashed border-brand-light p-6 text-center text-sm text-ink/50">Nothing pending.</p>}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold text-ink">History</h2>
      <div className="mt-3 space-y-2">
        {history.map((w: any) => (
          <div key={w.id} className="flex items-center justify-between rounded-xl2 border border-brand-light bg-white p-4 text-sm">
            <span className="text-ink">{w.tutors?.users?.full_name} — {formatCurrency(w.amount)}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${w.status === 'paid' ? 'bg-success/10 text-success' : 'bg-red-50 text-red-600'}`}>
              {w.status}
            </span>
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-ink/40">No history yet.</p>}
      </div>
    </div>
  );
}
