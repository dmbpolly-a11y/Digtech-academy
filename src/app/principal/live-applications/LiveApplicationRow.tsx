'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gold-light text-gold',
  contacted: 'bg-brand-light text-brand',
  enrolled: 'bg-success/10 text-success',
  declined: 'bg-red-50 text-red-600'
};

export function LiveApplicationRow({ application }: { application: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);
  const [saving, setSaving] = useState(false);

  async function updateStatus(next: string) {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('live_applications').update({ status: next }).eq('id', application.id);
    setStatus(next);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl2 border border-brand-light bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{application.full_name}</p>
          <p className="text-xs text-ink/50">{application.live_courses?.title}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink/60">
            <span className="flex items-center gap-1"><IconifyIcon icon="lucide:phone" className="h-3.5 w-3.5" /> {application.mobile_number}</span>
            <span className="flex items-center gap-1"><IconifyIcon icon="lucide:calendar" className="h-3.5 w-3.5" /> {application.preferred_days}</span>
            <span className="flex items-center gap-1"><IconifyIcon icon="lucide:clock" className="h-3.5 w-3.5" /> {application.preferred_study_time}</span>
          </div>
        </div>
        <select
          disabled={saving}
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className={`rounded-full border-none px-3 py-1.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
        >
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="enrolled">Enrolled</option>
          <option value="declined">Declined</option>
        </select>
      </div>
    </div>
  );
}
