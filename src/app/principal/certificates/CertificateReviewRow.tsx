'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { Button } from '@/components/Button';

export function CertificateReviewRow({ certificate }: { certificate: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(action: 'approve' | 'reject') {
    setLoading(action);
    setError(null);
    const res = await fetch('/api/certificates/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateId: certificate.id, action })
    });
    setLoading(null);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong.');
    }
  }

  return (
    <div className="rounded-xl2 border border-brand-light bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconifyIcon icon="lucide:award" className="h-8 w-8 text-gold" />
          <div>
            <p className="font-semibold text-ink">{certificate.students?.users?.full_name}</p>
            <p className="text-xs text-ink/50">{certificate.courses?.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => review('approve')} loading={loading === 'approve'}>Approve & issue</Button>
          <Button size="sm" variant="danger" onClick={() => review('reject')} loading={loading === 'reject'}>Reject</Button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
