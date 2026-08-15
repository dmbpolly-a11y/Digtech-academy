'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import type { Withdrawal } from '@/types/database';

export function WithdrawalActions({ withdrawal }: { withdrawal: Withdrawal }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(status: 'approved' | 'rejected' | 'paid') {
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    await supabase
      .from('withdrawals')
      .update({ status, processed_at: new Date().toISOString(), processed_by: user?.id })
      .eq('id', withdrawal.id);

    // Refund the tutor's wallet if the request is rejected.
    if (status === 'rejected') {
      const { data: tutor } = await supabase.from('tutors').select('wallet_balance').eq('user_id', withdrawal.tutor_id).single();
      await supabase.from('tutors').update({ wallet_balance: (tutor?.wallet_balance ?? 0) + withdrawal.amount }).eq('user_id', withdrawal.tutor_id);
    }

    if (status === 'approved') {
      const { data: tutorUser } = await supabase.from('users').select('mobile_number').eq('id', withdrawal.tutor_id).single();
      if (tutorUser?.mobile_number) {
        await fetch('/api/withdrawals/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ withdrawalId: withdrawal.id })
        }).catch(() => {});
      }
    }

    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 gap-2">
      {withdrawal.status === 'pending' && (
        <>
          <Button size="sm" onClick={() => updateStatus('approved')} loading={busy}>Approve</Button>
          <Button size="sm" variant="danger" onClick={() => updateStatus('rejected')} loading={busy}>Reject</Button>
        </>
      )}
      {withdrawal.status === 'approved' && (
        <Button size="sm" onClick={() => updateStatus('paid')} loading={busy}>Mark as paid</Button>
      )}
    </div>
  );
}
