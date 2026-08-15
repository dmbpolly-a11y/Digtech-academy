import { TutorSidebar } from '@/components/dashboard/TutorSidebar';

export const dynamic = 'force-dynamic';

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-light/40">
      <TutorSidebar />
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  );
}
