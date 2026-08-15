import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const p = await params;
  return { title: `Verify certificate ${p.code}` };
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const p = await params;
  const supabase = createClient();

  const { data: certificate } = await supabase
    .from('certificates')
    .select('*, students(users(full_name)), courses(title, tutors(users(full_name)))')
    .eq('verification_code', p.code)
    .maybeSingle();

  const isValid = certificate && certificate.status === 'issued';

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center md:px-8">
      {isValid ? (
        <>
          <IconifyIcon icon="lucide:check-circle-2" className="h-14 w-14 text-success" />
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Certificate verified</h1>
          <p className="mt-1 text-sm text-ink/60">This is a genuine Digtech Academy certificate.</p>

          <div className="mt-8 w-full rounded-xl2 border border-brand-light bg-white p-6 text-left shadow-card">
            <div className="flex items-center gap-2 text-gold">
              <IconifyIcon icon="lucide:award" className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Certificate of Completion</span>
            </div>
            <p className="mt-3 font-display text-xl font-bold text-ink">{(certificate as any).students?.users?.full_name}</p>
            <p className="mt-1 text-sm text-ink/70">completed</p>
            <p className="mt-1 font-semibold text-brand">{(certificate as any).courses?.title}</p>
            <div className="mt-4 space-y-1 border-t border-brand-light pt-4 text-xs text-ink/50">
              <p>Tutor: {(certificate as any).courses?.tutors?.users?.full_name}</p>
              <p>Issued: {certificate!.issued_at ? formatDate(certificate!.issued_at) : '—'}</p>
              <p className="font-mono">Code: {certificate!.verification_code}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <IconifyIcon icon="lucide:x-circle" className="h-14 w-14 text-red-500" />
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Certificate not found</h1>
          <p className="mt-1 max-w-sm text-sm text-ink/60">
            We couldn&apos;t verify a certificate with code &quot;{p.code}&quot;. Double-check the code, or contact the student to confirm.
          </p>
        </>
      )}

      <Link href="/verify" className="mt-8 text-sm font-semibold text-brand hover:underline">
        Verify another certificate
      </Link>
    </div>
  );
}
