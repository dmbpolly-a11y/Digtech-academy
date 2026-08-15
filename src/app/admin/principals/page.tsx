import { createClient } from '@/lib/supabase/server';
import { CreatePrincipalForm } from './CreatePrincipalForm';

export const metadata = { title: 'Principals' };

export default async function AdminPrincipalsPage() {
  const supabase = createClient();
  const { data: principals } = await supabase
    .from('principals')
    .select('*, users(full_name, email, mobile_number, is_suspended)')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Principals</h1>
      <p className="mt-1 text-sm text-ink/60">Only Admins can create Principal accounts.</p>

      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <h2 className="font-display text-base font-bold text-ink">Add a principal</h2>
        <div className="mt-4">
          <CreatePrincipalForm />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {(principals ?? []).map((p: any) => (
          <div key={p.user_id} className="flex items-center justify-between rounded-xl2 border border-brand-light bg-white p-4">
            <div>
              <p className="font-semibold text-ink">{p.users?.full_name}</p>
              <p className="text-xs text-ink/50">{p.users?.email} • {p.school_name || 'Digtech Academy'}</p>
            </div>
            {p.users?.is_suspended && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Suspended</span>}
          </div>
        ))}
        {(!principals || principals.length === 0) && (
          <p className="rounded-xl2 border border-dashed border-brand-light p-6 text-center text-sm text-ink/50">No principals yet.</p>
        )}
      </div>
    </div>
  );
}
