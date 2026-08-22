export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountUgx, reference, description, customerPhone, callbackUrl } = body;

    const key = process.env.PANDORA_API_KEY;

    // Sandbox Fallback Mode
    if (!key) {
      return Response.json({
        success: true,
        message: "Sandbox mode: USSD prompt simulated.",
        providerReference: `SANDBOX-${reference}`
      });
    }

    // Call Real Pandora API (Push USSD)
    const res = await fetch(`https://api.pandorapayments.com/v1/transactions/mobile-money`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'X-API-Key': key 
      },
      body: JSON.stringify({
        amount: amountUgx,
        transaction_ref: reference,
        contact: customerPhone,
        narrative: description,
        callback_url: callbackUrl
      })
    });

    const data = await res.json();
    
    if (!res.ok || !data.success) {
      throw new Error(data.messages?.[0] || 'Pandora checkout init failed');
    }
    
    return Response.json({ 
      success: true,
      message: data.messages[0],
      providerReference: data.data[0]?.transaction_reference || reference 
    });

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return Response.json({ error: error.message || 'Failed to initiate payment' }, { status: 500 });
  }
}
