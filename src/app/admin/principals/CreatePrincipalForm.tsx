'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createPrincipalSchema } from '@/lib/validation';
import { Button } from '@/components/Button';

export function CreatePrincipalForm() {
  const router = useRouter();
  const [values, setValues] = useState({ fullName: '', email: '', mobileNumber: '', schoolName: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = createPrincipalSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setFormError(null);
    setLoading(true);

    const res = await fetch('/api/admin/create-principal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data)
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setValues({ fullName: '', email: '', mobileNumber: '', schoolName: '', password: '' });
      router.refresh();
    } else {
      const data = await res.json();
      setFormError(data.error ?? 'Could not create principal.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2" noValidate>
      <Field label="Full name" error={errors.fullName}>
        <input className="field" value={values.fullName} onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))} />
      </Field>
      <Field label="Email" error={errors.email}>
        <input className="field" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
      </Field>
      <Field label="Mobile number" error={errors.mobileNumber}>
        <input className="field" placeholder="0771234567" value={values.mobileNumber} onChange={(e) => setValues((v) => ({ ...v, mobileNumber: e.target.value }))} />
      </Field>
      <Field label="School / branch name">
        <input className="field" value={values.schoolName} onChange={(e) => setValues((v) => ({ ...v, schoolName: e.target.value }))} />
      </Field>
      <Field label="Temporary password" error={errors.password}>
        <input type="password" className="field" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
      </Field>

      <div className="sm:col-span-2">
        {formError && <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}
        {success && <p className="mb-2 rounded-lg bg-success/10 px-3 py-2 text-xs text-success">Principal account created.</p>}
        <Button type="submit" loading={loading}>Create principal</Button>
      </div>

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
