'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';

interface StudentWithUser {
  user_id: string;
  users: { full_name: string; email: string; mobile_number: string; is_suspended: boolean };
}

export function StudentTable({ students, courses }: { students: StudentWithUser[]; courses: { id: string; title: string }[] }) {
  const router = useRouter();
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function enroll(studentId: string) {
    const courseId = selectedCourse[studentId];
    if (!courseId) return;
    setBusy(studentId);
    const supabase = createClient();
    await supabase.from('enrollments').upsert({ student_id: studentId, course_id: courseId }, { onConflict: 'student_id,course_id', ignoreDuplicates: true });
    setBusy(null);
    setEnrollingId(null);
    router.refresh();
  }

  async function removeStudent(studentId: string) {
    if (!confirm('Delete this student account? This cannot be undone.')) return;
    setBusy(studentId);
    const supabase = createClient();
    await supabase.from('users').delete().eq('id', studentId);
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-brand-light bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-brand-light text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="p-4">Student</th>
            <th className="p-4">Contact</th>
            <th className="p-4">Enrol into</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-light">
          {students.map((s) => (
            <tr key={s.user_id}>
              <td className="p-4 font-medium text-ink">{s.users.full_name}</td>
              <td className="p-4 text-xs text-ink/60">{s.users.email}<br />{s.users.mobile_number}</td>
              <td className="p-4">
                {enrollingId === s.user_id ? (
                  <div className="flex gap-2">
                    <select
                      className="rounded-lg border border-brand-light px-2 py-1 text-xs"
                      onChange={(e) => setSelectedCourse((v) => ({ ...v, [s.user_id]: e.target.value }))}
                    >
                      <option value="">Select a course…</option>
                      {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <Button size="sm" onClick={() => enroll(s.user_id)} loading={busy === s.user_id}>Enrol</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setEnrollingId(s.user_id)}>
                    <IconifyIcon icon="lucide:user-plus" className="h-3.5 w-3.5" /> Enrol
                  </Button>
                )}
              </td>
              <td className="p-4 text-right">
                <button onClick={() => removeStudent(s.user_id)} aria-label="Delete student">
                  <IconifyIcon icon="lucide:trash-2" className="h-4 w-4 text-red-400 hover:text-red-600" />
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={4} className="p-8 text-center text-sm text-ink/50">No students yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
