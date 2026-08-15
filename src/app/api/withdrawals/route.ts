import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withdrawalSchema } from '@/lib/validation';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const body = await request.json();
  const parsed = withdrawalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const { data: tutor } = await supabase.from('tutors').select('wallet_balance').eq('user_id', user.id).single();
  if (!tutor) return NextResponse.json({ error: 'Tutor profile not found.' }, { status: 404 });
  if (parsed.data.amount > tutor.wallet_balance) {
    return NextResponse.json({ error: 'Amount exceeds your withdrawable balance.' }, { status: 400 });
  }

  const record =
    parsed.data.method === 'mobile_money'
      ? {
          tutor_id: user.id,
          amount: parsed.data.amount,
          method: 'mobile_money',
          mm_full_name: parsed.data.mmFullName,
          mm_phone_number: parsed.data.mmPhoneNumber
        }
      : {
          tutor_id: user.id,
          amount: parsed.data.amount,
          method: 'bank',
          bank_name: parsed.data.bankName,
          bank_account_name: parsed.data.bankAccountName,
          bank_account_number: parsed.data.bankAccountNumber
        };

  const { error } = await supabase.from('withdrawals').insert(record as any);
  if (error) return NextResponse.json({ error: 'Could not submit withdrawal request.' }, { status: 500 });

  // Deduct immediately so a tutor can't request the same balance twice while pending.
  await supabase.from('tutors').update({ wallet_balance: tutor.wallet_balance - parsed.data.amount }).eq('user_id', user.id);

  const { data: profile } = await supabase.from('users').select('full_name').eq('id', user.id).single();
  const { data: admins } = await supabase.from('users').select('id, mobile_number').eq('role', 'admin');
  for (const admin of admins ?? []) {
    if (!admin.mobile_number) continue;
    await sendSms({
      userId: admin.id,
      phoneNumber: admin.mobile_number,
      event: 'admin_withdrawal_request',
      vars: { amount: String(parsed.data.amount), name: profile?.full_name ?? 'A tutor' }
    });
  }

  return NextResponse.json({ ok: true });
}
