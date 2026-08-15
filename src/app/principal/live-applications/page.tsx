import { createClient } from '@/lib/supabase/server';
import { LiveApplicationRow } from './LiveApplicationRow';

export const metadata = { title: 'Live Applications' };

export default async function LiveApplicationsPage() {
  const supabase = createClient();
  const { data: applications } = await supabase
    .from('live_applications')
    .select('*, live_courses(title)')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Live class applications</h1>
      <p className="mt-1 text-sm text-ink/60">Applicants from the public Live Courses page.</p>

      <div className="mt-6 space-y-3">
        {(applications ?? []).map((a: any) => <LiveApplicationRow key={a.id} application={a} />)}
        {(!applications || applications.length === 0) && (
          <p className="rounded-xl2 border border-dashed border-brand-light p-8 text-center text-sm text-ink/50">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
