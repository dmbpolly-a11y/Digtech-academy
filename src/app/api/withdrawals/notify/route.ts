import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('users').select('role').eq('id', user?.id ?? '').single();
  if (!user || !profile || !['admin', 'principal'].includes(profile.role)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const { withdrawalId } = await request.json();
  const { data: withdrawal } = await supabase.from('withdrawals').select('*, tutors(users(mobile_number))').eq('id', withdrawalId).single();
  if (!withdrawal) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const phone = (withdrawal as any).tutors?.users?.mobile_number;
  if (phone) {
    await sendSms({ userId: withdrawal.tutor_id, phoneNumber: phone, event: 'withdrawal_approved', vars: { amount: String(withdrawal.amount) } });
  }

  return NextResponse.json({ ok: true });
}
