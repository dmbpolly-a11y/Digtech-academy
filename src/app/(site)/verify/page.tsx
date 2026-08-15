import IconifyIcon from '@/components/icons/IconifyIcon';
import { VerifyForm } from './VerifyForm';

export const metadata = { title: 'Verify a Certificate' };

export default function VerifyLandingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center md:px-8">
      <IconifyIcon icon="lucide:shield-check" className="mx-auto h-12 w-12 text-action" />
      <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Verify a Digtech Academy certificate</h1>
      <p className="mt-2 text-sm text-ink/60">
        Enter the verification code printed on the certificate, or scan the QR code on the document.
      </p>
      <div className="mt-8">
        <VerifyForm />
      </div>
    </div>
  );
}
