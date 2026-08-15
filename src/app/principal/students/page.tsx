import { createClient } from '@/lib/supabase/server';
import { StudentTable } from './StudentTable';

export const metadata = { title: 'Students' };

export default async function PrincipalStudentsPage() {
  const supabase = createClient();

  const { data: students } = await supabase
    .from('students')
    .select('*, users(full_name, email, mobile_number, is_suspended)')
    .order('created_at', { ascending: false });

  const { data: courses } = await supabase.from('courses').select('id, title').eq('status', 'published').order('title');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Students</h1>
      <p className="mt-1 text-sm text-ink/60">Manage student accounts and enrol them into courses directly.</p>

      <div className="mt-6">
        <StudentTable students={(students as any) ?? []} courses={courses ?? []} />
      </div>
    </div>
  );
}
