import crypto from 'crypto';

/**
 * Thin wrapper around Pandora Payments. Swap the fetch URLs/fields for
 * whatever Pandora's real API contract turns out to be — the surface area
 * (initiate + verify webhook signature) is the part that matters and won't
 * change even if field names do.
 */

interface InitiatePaymentArgs {
  amountUgx: number;
  currency?: string;
  reference: string; // our payment.id, used to reconcile the webhook
  description: string;
  customerPhone: string;
  customerName: string;
  redirectUrl: string;
}

export async function initiatePandoraPayment(args: InitiatePaymentArgs) {
  const base = process.env.PANDORA_API_BASE_URL;
  const key = process.env.PANDORA_API_KEY;
  const merchant = process.env.PANDORA_MERCHANT_ID;

  if (!base || !key || !merchant) {
    // Sandbox fallback so the enrollment flow is fully testable before
    // real Pandora credentials exist. Returns a mock checkout URL that
    // resolves straight to our own webhook simulator page.
    return {
      checkoutUrl: `/api/payments/sandbox-checkout?ref=${encodeURIComponent(args.reference)}&amount=${args.amountUgx}`,
      providerReference: `SANDBOX-${args.reference}`
    };
  }

  const res = await fetch(`${base}/v1/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      merchant_id: merchant,
      amount: args.amountUgx,
      currency: args.currency ?? 'UGX',
      reference: args.reference,
      description: args.description,
      customer: { name: args.customerName, phone: args.customerPhone },
      redirect_url: args.redirectUrl
    })
  });

  if (!res.ok) throw new Error(`Pandora checkout init failed: ${res.status}`);
  const data = await res.json();
  return { checkoutUrl: data.checkout_url as string, providerReference: data.reference as string };
}

/** Verifies the HMAC signature Pandora attaches to webhook payloads. */
export function verifyPandoraWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.PANDORA_WEBHOOK_SECRET;
  if (!secret) return true; // sandbox mode — accept unsigned local test calls
  if (!signatureHeader) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

/** Splits a course fee into tutor/platform shares per the tutor's revenue_share_percent. */
export function splitRevenue(amount: number, tutorSharePercent: number) {
  const tutorShare = Math.round(amount * (tutorSharePercent / 100));
  const platformShare = amount - tutorShare;
  return { tutorShare, platformShare };
}
