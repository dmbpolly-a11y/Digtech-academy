import { createClient } from '@/lib/supabase/server';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { LiveApplyButton } from './LiveApplyButton';

export const metadata = { title: 'Live Courses' };
export const revalidate = 30;

export default async function LiveCoursesPage() {
  const supabase = createClient();
  const { data: liveCourses } = await supabase
    .from('live_courses')
    .select('*, tutors(users(full_name))')
    .eq('is_open', true)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="flex items-center gap-2">
        <IconifyIcon icon="lucide:radio" className="h-6 w-6 text-action" />
        <h1 className="font-display text-3xl font-extrabold text-ink">Live online classes</h1>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        Scheduled, trainer-led sessions run in real time. Apply below and our team will confirm your seat by SMS.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {(liveCourses ?? []).map((lc: any) => (
          <div key={lc.id} className="rounded-xl2 border border-brand-light p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">{lc.title}</h2>
            {lc.description && <p className="mt-2 text-sm text-ink/60">{lc.description}</p>}

            <div className="mt-4 space-y-1.5 text-sm text-ink/70">
              <p className="flex items-center gap-2"><IconifyIcon icon="lucide:clock" className="h-4 w-4 text-action" /> {lc.duration || 'Duration to be confirmed'}</p>
              <p className="flex items-center gap-2"><IconifyIcon icon="lucide:calendar" className="h-4 w-4 text-action" /> {lc.schedule || 'Schedule to be confirmed'}</p>
              {lc.tutors?.users?.full_name && <p>Trainer: {lc.tutors.users.full_name}</p>}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-brand">
                {lc.fee > 0 ? `UGX ${lc.fee.toLocaleString()}` : 'Free'}
              </span>
              <LiveApplyButton liveCourseId={lc.id} courseTitle={lc.title} />
            </div>
          </div>
        ))}

        {(!liveCourses || liveCourses.length === 0) && (
          <div className="col-span-full rounded-xl2 border border-dashed border-brand-light p-10 text-center text-sm text-ink/50">
            No live classes are open for applications right now — check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
