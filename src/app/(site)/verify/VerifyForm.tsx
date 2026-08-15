'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

export function VerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/verify/${encodeURIComponent(code.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-sm gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g. 8f3a1c9e2b47"
        className="flex-1 rounded-full border border-brand-light px-4 py-2.5 text-sm outline-none focus:border-action"
      />
      <Button type="submit">Verify</Button>
    </form>
  );
}
