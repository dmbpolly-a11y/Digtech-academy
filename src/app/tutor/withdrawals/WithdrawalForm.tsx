'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { withdrawalSchema } from '@/lib/validation';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

export function WithdrawalForm({ availableBalance }: { availableBalance: number }) {
  const router = useRouter();
  const [method, setMethod] = useState<'mobile_money' | 'bank'>('mobile_money');
  const [values, setValues] = useState({
    amount: '',
    mmFullName: '',
    mmPhoneNumber: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const payload =
      method === 'mobile_money'
        ? { method, amount: Number(values.amount), mmFullName: values.mmFullName, mmPhoneNumber: values.mmPhoneNumber }
        : { method, amount: Number(values.amount), bankName: values.bankName, bankAccountName: values.bankAccountName, bankAccountNumber: values.bankAccountNumber };

    const parsed = withdrawalSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    if (parsed.data.amount > availableBalance) {
      setFormError('Amount exceeds your withdrawable balance.');
      return;
    }

    setErrors({});
    setFormError(null);
    setLoading(true);

    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data)
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const data = await res.json();
      setFormError(data.error ?? 'Could not submit request.');
    }
  }

  if (success) {
    return <p className="rounded-xl bg-success/10 p-4 text-sm text-ink/80">Withdrawal request submitted — expect processing within 2 working days.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="flex gap-2">
        <MethodTab active={method === 'mobile_money'} onClick={() => setMethod('mobile_money')}>Mobile Money</MethodTab>
        <MethodTab active={method === 'bank'} onClick={() => setMethod('bank')}>Bank</MethodTab>
      </div>

      <Field label="Amount (UGX)" error={errors.amount}>
        <input type="number" min={0} className="field" value={values.amount} onChange={(e) => setValues((v) => ({ ...v, amount: e.target.value }))} />
      </Field>

      {method === 'mobile_money' ? (
        <>
          <Field label="Full name" error={errors.mmFullName}>
            <input className="field" value={values.mmFullName} onChange={(e) => setValues((v) => ({ ...v, mmFullName: e.target.value }))} />
          </Field>
          <Field label="Phone number" error={errors.mmPhoneNumber}>
            <input placeholder="0771234567" className="field" value={values.mmPhoneNumber} onChange={(e) => setValues((v) => ({ ...v, mmPhoneNumber: e.target.value }))} />
          </Field>
        </>
      ) : (
        <>
          <Field label="Bank name" error={errors.bankName}>
            <input className="field" value={values.bankName} onChange={(e) => setValues((v) => ({ ...v, bankName: e.target.value }))} />
          </Field>
          <Field label="Account name" error={errors.bankAccountName}>
            <input className="field" value={values.bankAccountName} onChange={(e) => setValues((v) => ({ ...v, bankAccountName: e.target.value }))} />
          </Field>
          <Field label="Account number" error={errors.bankAccountNumber}>
            <input className="field" value={values.bankAccountNumber} onChange={(e) => setValues((v) => ({ ...v, bankAccountNumber: e.target.value }))} />
          </Field>
        </>
      )}

      {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}

      <Button type="submit" loading={loading} className="w-full">Request withdrawal</Button>

      <style jsx>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid #d9e2f5; padding: 0.6rem 0.85rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
      `}</style>
    </form>
  );
}

function MethodTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex-1 rounded-full border py-2 text-sm font-semibold', active ? 'border-action bg-action text-white' : 'border-brand-light text-ink/60')}
    >
      {children}
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
