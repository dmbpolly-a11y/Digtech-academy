import { createClient } from '@/lib/supabase/server';
import { CertificateReviewRow } from './CertificateReviewRow';

export const metadata = { title: 'Certificates' };

export default async function PrincipalCertificatesPage() {
  const supabase = createClient();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, students(users(full_name)), courses(title)')
    .order('applied_at', { ascending: false });

  const pending = (certificates ?? []).filter((c: any) => c.status === 'pending_review');
  const others = (certificates ?? []).filter((c: any) => c.status !== 'pending_review');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Certificate approvals</h1>
      <p className="mt-1 text-sm text-ink/60">Review applications from students who completed 100% of a course.</p>

      <h2 className="mt-6 font-display text-lg font-bold text-ink">Pending review ({pending.length})</h2>
      <div className="mt-3 space-y-3">
        {pending.map((c: any) => <CertificateReviewRow key={c.id} certificate={c} />)}
        {pending.length === 0 && <p className="rounded-xl2 border border-dashed border-brand-light p-6 text-center text-sm text-ink/50">Nothing pending.</p>}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold text-ink">History</h2>
      <div className="mt-3 space-y-2">
        {others.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl2 border border-brand-light bg-white p-4 text-sm">
            <span className="text-ink">{c.students?.users?.full_name} — {c.courses?.title}</span>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold capitalize text-brand">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
