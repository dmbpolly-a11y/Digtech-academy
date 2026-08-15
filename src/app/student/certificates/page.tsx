import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Certificates' };

const STATUS_LABEL: Record<string, string> = {
  not_applied: 'Not applied',
  pending_review: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
  issued: 'Issued'
};

export default async function CertificatesPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, courses(title)')
    .eq('student_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Certificates</h1>
      <p className="mt-1 text-sm text-ink/60">Certificates are issued once a course reaches 100% completion and is reviewed.</p>

      <div className="mt-6 space-y-3">
        {(certificates ?? []).map((c: any) => (
          <div key={c.id} className="flex items-center gap-4 rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-light text-gold">
              <IconifyIcon icon="lucide:award" className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink">{c.courses.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/50">
                {c.status === 'pending_review' && <IconifyIcon icon="lucide:clock" className="h-3.5 w-3.5" />}
                {c.status === 'rejected' && <IconifyIcon icon="lucide:x-circle" className="h-3.5 w-3.5 text-red-500" />}
                {STATUS_LABEL[c.status]}
                {c.status === 'issued' && ` • Code: ${c.verification_code}`}
              </p>
            </div>
            {c.status === 'issued' && c.pdf_url && (
              <a
                href={c.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-action px-4 py-2 text-xs font-semibold text-white hover:bg-action-dark"
              >
                <IconifyIcon icon="lucide:download" className="h-3.5 w-3.5" /> Download PDF
              </a>
            )}
          </div>
        ))}

        {(!certificates || certificates.length === 0) && (
          <div className="rounded-xl2 border border-dashed border-brand-light p-10 text-center text-sm text-ink/50">
            No certificate applications yet. Complete a course to apply for one from &quot;My Courses.&quot;
          </div>
        )}
      </div>
    </div>
  );
}
