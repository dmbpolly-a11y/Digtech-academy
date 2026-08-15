import { NextResponse } from 'next/server';

/**
 * Development-only stand-in for Pandora's hosted checkout page.
 * Once real PANDORA_* env vars are set, initiatePandoraPayment() in
 * src/lib/payments.ts stops returning this URL and redirects to the
 * real Pandora checkout instead — this route becomes unreachable in production.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const ref = searchParams.get('ref');
  const amount = searchParams.get('amount');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Sandbox Payment</title>
<style>
  body { font-family: system-ui, sans-serif; background:#0E2A5C; color:white; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
  .card { background:white; color:#1F2937; border-radius:16px; padding:32px; width:340px; text-align:center; }
  h1 { font-size:18px; color:#1A4095; }
  .amount { font-size:28px; font-weight:800; color:#1A4095; margin:16px 0; }
  button { width:100%; padding:12px; border-radius:999px; border:none; font-weight:700; cursor:pointer; margin-top:8px; }
  .pay { background:#28C0F4; color:white; }
  .cancel { background:#f1f5f9; color:#1F2937; }
</style>
</head>
<body>
  <div class="card">
    <h1>Pandora Payments (Sandbox)</h1>
    <div class="amount">UGX ${Number(amount).toLocaleString()}</div>
    <p>This is a simulated checkout for local development.</p>
    <button class="pay" onclick="confirm()">Confirm payment</button>
    <button class="cancel" onclick="history.back()">Cancel</button>
  </div>
  <script>
    async function confirm() {
      await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: '${ref}', status: 'success', provider_reference: 'SANDBOX-${ref}' })
      });
      window.location.href = '${origin}/student/courses';
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
