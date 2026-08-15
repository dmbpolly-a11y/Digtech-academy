import { createClient } from '@/lib/supabase/server';
import { TutorRow } from './TutorRow';

export const metadata = { title: 'Tutors' };

export default async function PrincipalTutorsPage() {
  const supabase = createClient();

  const { data: tutors } = await supabase
    .from('tutors')
    .select('*, users(full_name, email, mobile_number, is_suspended)')
    .order('created_at', { ascending: false });

  // Course + student counts per tutor for a lightweight "performance" view
  const { data: courseCounts } = await supabase.from('courses').select('tutor_id, enrollment_count');
  const perf: Record<string, { courses: number; students: number }> = {};
  for (const c of courseCounts ?? []) {
    perf[c.tutor_id] ??= { courses: 0, students: 0 };
    perf[c.tutor_id].courses += 1;
    perf[c.tutor_id].students += c.enrollment_count;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Tutors</h1>
      <p className="mt-1 text-sm text-ink/60">Activate new tutors and manage existing ones.</p>

      <div className="mt-6 space-y-3">
        {(tutors ?? []).map((t: any) => (
          <TutorRow key={t.user_id} tutor={t} performance={perf[t.user_id] ?? { courses: 0, students: 0 }} />
        ))}
        {(!tutors || tutors.length === 0) && (
          <p className="rounded-xl2 border border-dashed border-brand-light p-8 text-center text-sm text-ink/50">No tutors have signed up yet.</p>
        )}
      </div>
    </div>
  );
}
