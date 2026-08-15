'use client';

import { useState, FormEvent } from 'react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { profileSchema } from '@/lib/validation';
import { Button } from '@/components/Button';
import type { AppUser } from '@/types/database';

export function ProfileForm({ profile, email }: { profile: AppUser; email: string }) {
  const [values, setValues] = useState({
    fullName: profile.full_name,
    mobileNumber: profile.mobile_number ?? '',
    newPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('saving');

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('users')
      .update({ full_name: parsed.data.fullName, mobile_number: parsed.data.mobileNumber })
      .eq('id', profile.id);

    if (updateError) {
      setStatus('error');
      return;
    }

    if (parsed.data.newPassword) {
      const { error: pwError } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
      if (pwError) {
        setStatus('error');
        return;
      }
    }

    setStatus('saved');
    setValues((v) => ({ ...v, newPassword: '' }));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Full name" error={errors.fullName}>
        <input className="field" value={values.fullName} onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))} />
      </Field>
      <Field label="Email">
        <input className="field bg-brand-light/50" value={email} disabled />
      </Field>
      <Field label="Mobile number" error={errors.mobileNumber}>
        <input className="field" value={values.mobileNumber} onChange={(e) => setValues((v) => ({ ...v, mobileNumber: e.target.value }))} />
      </Field>
      <Field label="New password (leave blank to keep current)" error={errors.newPassword}>
        <input type="password" className="field" value={values.newPassword} onChange={(e) => setValues((v) => ({ ...v, newPassword: e.target.value }))} />
      </Field>

      {status === 'error' && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">Could not save changes. Please try again.</p>}
      {status === 'saved' && <p className="rounded-lg bg-success/10 px-3 py-2 text-xs text-success">Profile updated.</p>}

      <Button type="submit" loading={status === 'saving'} className="w-full">Save changes</Button>

      <style jsx>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid #d9e2f5; padding: 0.6rem 0.85rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
      `}</style>
    </form>
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
