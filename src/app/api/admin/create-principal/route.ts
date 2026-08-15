import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { createPrincipalSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Only Admins can create Principal accounts.' }, { status: 403 });

  const body = await request.json();
  const parsed = createPrincipalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const service = createServiceClient();

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true
  });

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message ?? 'Could not create account.' }, { status: 500 });
  }

  await service.from('users').insert({
    id: created.user.id,
    role: 'principal',
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    mobile_number: parsed.data.mobileNumber
  });

  await service.from('principals').insert({ user_id: created.user.id, school_name: parsed.data.schoolName ?? null });

  return NextResponse.json({ ok: true });
}
