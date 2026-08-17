'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation';
import { Button } from '@/components/Button';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setFormError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      setFormError('Incorrect email or password. Please try again.');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from('users').select('role, is_suspended').eq('id', data.user!.id).single();

    if (profile?.is_suspended) {
      router.push('/auth/suspended');
      return;
    }

    const next = params.get('next');
    router.push(next || `/${profile?.role ?? 'student'}/dashboard`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Link href="/" className="flex items-center justify-center">
        <Image src="/images/Digtech Academy Logo.png" alt="Digtech Academy" width={200} height={50} className="h-12 w-auto object-contain" priority />
      </Link>

      <h1 className="mt-8 text-center font-display text-2xl font-extrabold text-ink">Welcome back</h1>
      <p className="mt-1 text-center text-sm text-ink/60">Log in to continue learning or teaching.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className="field"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <input
            type="password"
            className="field"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
        </Field>

        {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}

        <Button type="submit" loading={loading} className="w-full" size="lg">Log in</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Don't have an account? <Link href="/auth/signup" className="font-semibold text-brand hover:underline">Sign up</Link>
      </p>

      <style jsx>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid #d9e2f5; padding: 0.65rem 0.9rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
