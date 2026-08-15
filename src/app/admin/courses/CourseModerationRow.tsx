'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/validation';
import { Button } from '@/components/Button';
import type { Course } from '@/types/database';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-ink/10 text-ink/60',
  pending_review: 'bg-gold-light text-gold',
  published: 'bg-success/10 text-success',
  suspended: 'bg-red-50 text-red-600'
};

export function CourseModerationRow({ course }: { course: Course & { tutors?: { users: { full_name: string } } } }) {
  const router = useRouter();
  const [status, setStatus] = useState(course.status);
  const [busy, setBusy] = useState(false);

  async function setCourseStatus(next: typeof status) {
    setBusy(true);
    const supabase = createClient();
    await supabase.from('courses').update({ status: next }).eq('id', course.id);
    setStatus(next);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm('Delete this course permanently? This cannot be undone.')) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from('courses').delete().eq('id', course.id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-brand-light bg-white p-4 shadow-card">
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{course.title}</p>
        <p className="text-xs text-ink/50">
          by {course.tutors?.users?.full_name ?? 'Unknown'} • {course.is_free ? 'Free' : formatCurrency(course.fee)} • {course.enrollment_count} students
        </p>
        <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {status === 'published' && (
          <Link href={`/courses/${course.slug}`} target="_blank" className="text-brand hover:text-action" aria-label="View live">
            <IconifyIcon icon="lucide:external-link" className="h-4 w-4" />
          </Link>
        )}
        {status === 'pending_review' && (
          <Button size="sm" onClick={() => setCourseStatus('published')} loading={busy}>Approve & publish</Button>
        )}
        {status === 'published' && (
          <Button size="sm" variant="ghost" onClick={() => setCourseStatus('suspended')} loading={busy}>Suspend</Button>
        )}
        {status === 'suspended' && (
          <Button size="sm" onClick={() => setCourseStatus('published')} loading={busy}>Reinstate</Button>
        )}
        <button onClick={remove} aria-label="Delete course" disabled={busy}>
          <IconifyIcon icon="lucide:trash-2" className="h-4 w-4 text-red-400 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
}
