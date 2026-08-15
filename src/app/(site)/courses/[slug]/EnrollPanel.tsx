'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/validation';
import { Button } from '@/components/Button';
import type { Course } from '@/types/database';

export function EnrollPanel({ course }: { course: Course }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState<boolean | null>(null);

  async function handleEnroll() {
    setLoading(true);
    setError(null);

    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) {
      router.push(`/auth/login?next=/courses/${course.slug}`);
      return;
    }

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      if (data.freeEnrollment) {
        router.push('/student/courses');
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Network error — check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="h-fit rounded-xl2 bg-white p-4 text-ink shadow-xl md:sticky md:top-20">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-brand-light">
        {course.thumbnail_url ? (
          <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-brand/30">{course.title[0]}</div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-brand">
          {course.is_free ? 'Free' : formatCurrency(course.fee)}
        </span>
      </div>

      {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <Button className="mt-4 w-full" size="lg" onClick={handleEnroll} loading={loading}>
        {course.is_free ? 'Enrol for free' : 'Enrol Now'}
      </Button>
      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-brand-light py-2.5 text-sm font-semibold text-brand hover:bg-brand-light">
        <IconifyIcon icon="lucide:heart" className="h-4 w-4" /> Save to wishlist
      </button>

      <ul className="mt-5 space-y-2 text-xs text-ink/60">
        <li className="flex items-center gap-2"><IconifyIcon icon="lucide:check-circle" className="h-3.5 w-3.5 text-success" /> Full lifetime access</li>
        <li className="flex items-center gap-2"><IconifyIcon icon="lucide:check-circle" className="h-3.5 w-3.5 text-success" /> Certificate on completion</li>
        <li className="flex items-center gap-2"><IconifyIcon icon="lucide:check-circle" className="h-3.5 w-3.5 text-success" /> Ask questions on every lesson</li>
        <li className="flex items-center gap-2"><IconifyIcon icon="lucide:check-circle" className="h-3.5 w-3.5 text-success" /> Secure payment via Pandora</li>
      </ul>
    </div>
  );
}
