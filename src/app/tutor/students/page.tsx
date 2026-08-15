import { createClient } from '@/lib/supabase/server';
import { ProgressRing } from '@/components/ProgressRing';

export const metadata = { title: 'Students' };

export default async function TutorStudentsPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: courses } = await supabase.from('courses').select('id, title').eq('tutor_id', user!.id);
  const courseIds = (courses ?? []).map((c) => c.id);

  const { data: enrollments } = courseIds.length
    ? await supabase
        .from('enrollments')
        .select('*, students(users(full_name, mobile_number)), courses(title)')
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: false })
    : { data: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Students</h1>
      <p className="mt-1 text-sm text-ink/60">Everyone enrolled across your courses (read-only).</p>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-brand-light bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-light text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {(enrollments ?? []).map((e: any) => (
              <tr key={e.id}>
                <td className="p-4">
                  <p className="font-medium text-ink">{e.students?.users?.full_name}</p>
                  <p className="text-xs text-ink/50">{e.students?.users?.mobile_number}</p>
                </td>
                <td className="p-4 text-ink/70">{e.courses?.title}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ProgressRing percent={e.progress_percent} size={30} strokeWidth={4} label="" />
                    <span className="text-xs text-ink/60">{e.progress_percent}%</span>
                  </div>
                </td>
                <td className="p-4 text-xs text-ink/50">{new Date(e.enrolled_at).toLocaleDateString('en-UG')}</td>
              </tr>
            ))}
            {(!enrollments || enrollments.length === 0) && (
              <tr><td colSpan={4} className="p-8 text-center text-sm text-ink/50">No students yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
