'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { signupSchema } from '@/lib/validation';
import { Button } from '@/components/Button';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { cn } from '@/lib/utils';

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = params.get('role') === 'tutor' ? 'tutor' : 'student';

  const [values, setValues] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: initialRole as 'student' | 'tutor'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse(values);
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

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${parsed.data.email},mobile_number.eq.${parsed.data.mobileNumber}`)
      .maybeSingle();

    if (existing) {
      setFormError('An account with this email or mobile number already exists.');
      setLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password
    });

    if (signUpError || !signUpData.user) {
      setFormError(signUpError?.message ?? 'Could not create your account. Please try again.');
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from('users').insert({
      id: signUpData.user.id,
      role: parsed.data.role,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      mobile_number: parsed.data.mobileNumber
    });

    if (profileError) {
      setFormError('Account created, but your profile could not be saved. Please contact support.');
      setLoading(false);
      return;
    }

    if (parsed.data.role === 'tutor') {
      await supabase.from('tutors').insert({ user_id: signUpData.user.id });
    } else {
      await supabase.from('students').insert({ user_id: signUpData.user.id });
    }

    router.push(parsed.data.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Link href="/" className="flex items-center justify-center">
        <Image src="/images/Digtech Academy Logo.png" alt="Digtech Academy" width={200} height={50} className="h-12 w-auto object-contain" priority />
      </Link>

      <h1 className="mt-8 text-center font-display text-2xl font-extrabold text-ink">Create your account</h1>
      <p className="mt-1 text-center text-sm text-ink/60">Join as a student to learn, or a tutor to teach and earn.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <RoleCard
          icon="lucide:book-open"
          label="I'm a student"
          active={values.role === 'student'}
          onClick={() => setValues((v) => ({ ...v, role: 'student' }))}
        />
        <RoleCard
          icon="lucide:pen-square"
          label="I'm a tutor"
          active={values.role === 'tutor'}
          onClick={() => setValues((v) => ({ ...v, role: 'tutor' }))}
        />
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Field label="Full name" error={errors.fullName}>
          <input className="field" value={values.fullName} onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" className="field" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
        </Field>
        <Field label="Mobile number" error={errors.mobileNumber}>
          <input placeholder="0771234567" className="field" value={values.mobileNumber} onChange={(e) => setValues((v) => ({ ...v, mobileNumber: e.target.value }))} />
        </Field>
        <Field label="Password" error={errors.password}>
          <input type="password" className="field" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword}>
          <input type="password" className="field" value={values.confirmPassword} onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))} />
        </Field>

        {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account? <Link href="/auth/login" className="font-semibold text-brand hover:underline">Log in</Link>
      </p>

      <style jsx>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid #d9e2f5; padding: 0.65rem 0.9rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
      `}</style>
    </div>
  );
}

function RoleCard({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl2 border p-4 text-sm font-semibold transition-colors',
        active ? 'border-action bg-action/5 text-action' : 'border-brand-light text-ink/60 hover:border-brand'
      )}
    >
      <IconifyIcon icon={icon} className="h-5 w-5" />
      {label}
    </button>
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

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
