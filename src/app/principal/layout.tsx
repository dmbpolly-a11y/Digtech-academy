import { PrincipalSidebar } from '@/components/dashboard/PrincipalSidebar';

export const dynamic = 'force-dynamic';

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-light/40">
      <PrincipalSidebar />
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  );
}
