import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Which role "namespace" each protected prefix belongs to.
const ROLE_PREFIXES: Record<string, string> = {
  '/admin': 'admin',
  '/principal': 'principal',
  '/tutor': 'tutor',
  '/student': 'student'
};

export async function proxy(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((p) => path.startsWith(p));
  if (!matchedPrefix) return response;

  if (!user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', path);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, is_suspended')
    .eq('id', user.id)
    .single();

  const requiredRole = ROLE_PREFIXES[matchedPrefix];

  if (!profile || profile.is_suspended) {
    return NextResponse.redirect(new URL('/auth/suspended', request.url));
  }

  if (profile.role !== requiredRole) {
    return NextResponse.redirect(new URL(`/${profile.role}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/principal/:path*', '/tutor/:path*', '/student/:path*']
};
