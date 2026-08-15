'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import type { Course } from '@/types/database';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-ink/10 text-ink/60',
  pending_review: 'bg-gold-light text-gold',
  published: 'bg-success/10 text-success',
  suspended: 'bg-red-50 text-red-600'
};

export function PublishBar({ course }: { course: Course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(course.status);

  async function submitForReview() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('courses').update({ status: 'pending_review' }).eq('id', course.id);
    setStatus('pending_review');
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-brand-light bg-white p-4 shadow-card">
      <div>
        <p className="font-display text-lg font-bold text-ink">{course.title || 'Untitled course'}</p>
        <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {status === 'published' && (
          <Link href={`/courses/${course.slug}`} target="_blank" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            View live <IconifyIcon icon="lucide:external-link" className="h-3.5 w-3.5" />
          </Link>
        )}
        {(status === 'draft' || status === 'suspended') && (
          <Button size="sm" onClick={submitForReview} loading={loading}>Submit for review</Button>
        )}
        {status === 'pending_review' && <span className="text-sm text-ink/50">Awaiting Admin/Principal approval</span>}
      </div>
    </div>
  );
}
