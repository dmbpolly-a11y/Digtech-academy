import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Use inside Server Components, Route Handlers, and Server Actions.
 * Reads/writes the auth cookie so `auth.uid()` resolves correctly for RLS.
 * Compatible with Next.js 14, 15, and 16 (async cookies()).
 */
export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            const cookieStore = await cookies();
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component with no write access — safe to ignore,
            // middleware.ts handles session refresh instead.
          }
        }
      }
    }
  );
}

/**
 * Service-role client for privileged server-only operations
 * (webhooks crediting tutor wallets, admin actions, SMS logging).
 * NEVER import this into a Client Component or expose the key to the browser.
 */
export function createServiceClient() {
  const { createClient: createRawClient } = require('@supabase/supabase-js');
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
