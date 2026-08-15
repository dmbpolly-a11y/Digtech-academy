'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';

interface TutorWithUser {
  user_id: string;
  is_activated: boolean;
  verification_status: string;
  wallet_balance: number;
  users: { full_name: string; email: string; mobile_number: string; is_suspended: boolean };
}

export function TutorRow({ tutor, performance }: { tutor: TutorWithUser; performance: { courses: number; students: number } }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function activate() {
    setLoading('activate');
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    await supabase
      .from('tutors')
      .update({ is_activated: true, verification_status: 'verified', activated_by: user?.id, activated_at: new Date().toISOString() })
      .eq('user_id', tutor.user_id);
    setLoading(null);
    router.refresh();
  }

  async function toggleSuspend() {
    setLoading('suspend');
    const supabase = createClient();
    await supabase.from('users').update({ is_suspended: !tutor.users.is_suspended }).eq('id', tutor.user_id);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-brand-light bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 font-semibold text-ink">
          {tutor.users.full_name}
          {tutor.is_activated && <IconifyIcon icon="lucide:check-circle-2" className="h-4 w-4 text-success" />}
          {tutor.users.is_suspended && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">Suspended</span>}
        </p>
        <p className="text-xs text-ink/50">{tutor.users.email} • {tutor.users.mobile_number}</p>
        <div className="mt-2 flex gap-4 text-xs text-ink/60">
          <span className="flex items-center gap-1"><IconifyIcon icon="lucide:book-open" className="h-3.5 w-3.5" /> {performance.courses} courses</span>
          <span className="flex items-center gap-1"><IconifyIcon icon="lucide:users" className="h-3.5 w-3.5" /> {performance.students} students</span>
          <span className="capitalize">Verification: {tutor.verification_status}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!tutor.is_activated && (
          <Button size="sm" onClick={activate} loading={loading === 'activate'}>
            <IconifyIcon icon="lucide:shield-check" className="h-4 w-4" /> Activate
          </Button>
        )}
        <Button size="sm" variant={tutor.users.is_suspended ? 'primary' : 'danger'} onClick={toggleSuspend} loading={loading === 'suspend'}>
          <IconifyIcon icon="lucide:shield-off" className="h-4 w-4" /> {tutor.users.is_suspended ? 'Unsuspend' : 'Suspend'}
        </Button>
      </div>
    </div>
  );
}
