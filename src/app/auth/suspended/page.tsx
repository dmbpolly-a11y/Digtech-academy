import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import Image from 'next/image';

export default function SuspendedPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <IconifyIcon icon="lucide:shield-alert" className="h-12 w-12 text-red-500" />
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Your account is suspended</h1>
      <p className="mt-2 text-sm text-ink/60">
        Your access to Digtech Academy has been temporarily suspended. Contact support if you believe this is a mistake.
      </p>
      <Link href="/contact" className="mt-6 rounded-full bg-action px-5 py-2.5 text-sm font-semibold text-white hover:bg-action-dark">
        Contact support
      </Link>
    </div>
  );
}
