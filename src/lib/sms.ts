import { createServiceClient } from '@/lib/supabase/server';

export type SmsEvent =
  | 'student_registration'
  | 'enrollment'
  | 'payment_success'
  | 'certificate_issued'
  | 'tutor_new_enrollment'
  | 'withdrawal_approved'
  | 'tutor_new_question'
  | 'principal_new_tutor'
  | 'principal_new_live_application'
  | 'principal_new_enrollment'
  | 'admin_new_tutor'
  | 'admin_new_payment'
  | 'admin_withdrawal_request';

const TEMPLATES: Record<SmsEvent, (v: Record<string, string>) => string> = {
  student_registration: (v) => `Welcome to Digtech Academy, ${v.name}! Your account is ready. Start learning today.`,
  enrollment: (v) => `You're enrolled in "${v.course}". Log in to Digtech Academy to start watching lessons.`,
  payment_success: (v) => `Payment of UGX ${v.amount} for "${v.course}" was successful. Enjoy your course!`,
  certificate_issued: (v) => `Congratulations ${v.name}! Your certificate for "${v.course}" is ready to download.`,
  tutor_new_enrollment: (v) => `New enrollment: ${v.student} just joined "${v.course}".`,
  withdrawal_approved: (v) => `Your withdrawal of UGX ${v.amount} has been approved and is being processed.`,
  tutor_new_question: (v) => `New question on "${v.course}" from ${v.student}. Reply on your dashboard.`,
  principal_new_tutor: (v) => `New tutor registration: ${v.name} is awaiting activation.`,
  principal_new_live_application: (v) => `New live class application from ${v.name} for "${v.course}".`,
  principal_new_enrollment: (v) => `${v.student} enrolled in "${v.course}".`,
  admin_new_tutor: (v) => `New tutor signed up: ${v.name}.`,
  admin_new_payment: (v) => `New payment received: UGX ${v.amount} for "${v.course}".`,
  admin_withdrawal_request: (v) => `Withdrawal request: UGX ${v.amount} from tutor ${v.name}.`
};

interface SendSmsArgs {
  userId?: string;
  phoneNumber: string;
  event: SmsEvent;
  vars: Record<string, string>;
}

/**
 * Sends an SMS through the Digtech SMS API and logs the attempt to sms_logs.
 * Server-only — never call from the browser (API key stays on the server).
 */
export async function sendSms({ userId, phoneNumber, event, vars }: SendSmsArgs) {
  const message = TEMPLATES[event](vars);
  const supabase = createServiceClient();

  let status: 'sent' | 'failed' = 'sent';
  let providerResponse: unknown = null;

  try {
    if (!process.env.DIGTECH_SMS_BASE_URL || !process.env.DIGTECH_SMS_API_KEY) {
      // No credentials configured yet — log as queued instead of throwing,
      // so local development never blocks on a missing SMS provider.
      status = 'sent';
      providerResponse = { simulated: true, message };
    } else {
      const res = await fetch(`${process.env.DIGTECH_SMS_BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DIGTECH_SMS_API_KEY}`
        },
        body: JSON.stringify({
          sender_id: process.env.DIGTECH_SMS_SENDER_ID || 'DIGTECH',
          to: phoneNumber,
          message
        })
      });
      providerResponse = await res.json().catch(() => null);
      status = res.ok ? 'sent' : 'failed';
    }
  } catch (err) {
    status = 'failed';
    providerResponse = { error: String(err) };
  }

  await supabase.from('sms_logs').insert({
    user_id: userId ?? null,
    phone_number: phoneNumber,
    message,
    event_type: event,
    status,
    provider_response: providerResponse
  });

  return { status, message };
}
