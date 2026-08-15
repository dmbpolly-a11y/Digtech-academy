'use client';

import { useState, FormEvent } from 'react';
import { contactFormSchema } from '@/lib/validation';
import { Button } from '@/components/Button';

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function set(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('sending');
    // In production this posts to an API route that emails the admin/principal.
    await new Promise((r) => setTimeout(r, 600));
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl2 border border-success/30 bg-success/5 p-6 text-sm text-ink/80">
        Thanks, {values.name.split(' ')[0]} — your message has been sent. We'll get back to you within one working day.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Full name" error={errors.name}>
        <input value={values.name} onChange={(e) => set('name', e.target.value)} className="input" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" value={values.email} onChange={(e) => set('email', e.target.value)} className="input" />
      </Field>
      <Field label="Subject" error={errors.subject}>
        <input value={values.subject} onChange={(e) => set('subject', e.target.value)} className="input" />
      </Field>
      <Field label="Message" error={errors.message}>
        <textarea rows={5} value={values.message} onChange={(e) => set('message', e.target.value)} className="input resize-none" />
      </Field>
      <Button type="submit" loading={status === 'sending'} className="w-full">Send message</Button>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #d9e2f5;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #28c0f4;
          box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15);
        }
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
