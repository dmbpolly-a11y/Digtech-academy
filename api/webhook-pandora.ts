import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Pandora calls this endpoint after a checkout attempt completes.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-pandora-signature');

    // Verify webhook signature
    const secret = process.env.PANDORA_WEBHOOK_SECRET;
    if (secret && signature) {
      const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      try {
        if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
           return Response.json({ error: 'Invalid signature' }, { status: 401 });
        }
      } catch {
        return Response.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    
    // Initialize Supabase admin client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: payment } = await supabase
      .from('payments')
      .select('*, courses(*), students:student_id(user_id, users(full_name, mobile_number))')
      .eq('id', payload.transaction_reference)
      .single();
      
    if (!payment) return Response.json({ error: 'Payment not found' }, { status: 404 });

    if (payload.status !== 'completed') {
      await supabase.from('payments').update({ status: 'failed' }).eq('id', payment.id);
      return Response.json({ ok: true });
    }

    const course = (payment as any).courses;
    const { data: tutor } = await supabase.from('tutors').select('*').eq('user_id', course?.tutor_id).single();
    
    // Split revenue
    const tutorSharePercent = tutor?.revenue_share_percent ?? 70;
    const tutorShare = Math.round(payment.amount * (tutorSharePercent / 100));
    const platformShare = payment.amount - tutorShare;

    await supabase
      .from('payments')
      .update({ 
        status: 'success', 
        confirmed_at: new Date().toISOString(), 
        tutor_share: tutorShare, 
        platform_share: platformShare 
      })
      .eq('id', payment.id);

    // Credit tutor wallet
    if (course?.tutor_id) {
      await supabase
        .from('tutors')
        .update({ 
          wallet_balance: (tutor?.wallet_balance ?? 0) + tutorShare, 
          total_earned: (tutor?.total_earned ?? 0) + tutorShare 
        })
        .eq('user_id', course.tutor_id);
    }

    // Create the enrollment (idempotent — ignore if it already exists)
    await supabase.from('enrollments').upsert(
      { student_id: payment.student_id, course_id: payment.course_id },
      { onConflict: 'student_id,course_id', ignoreDuplicates: true }
    );

    return Response.json({ ok: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
