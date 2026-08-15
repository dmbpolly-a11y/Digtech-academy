import { StudentSidebar } from '@/components/dashboard/StudentSidebar';

export const dynamic = 'force-dynamic';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-light/40">
      <StudentSidebar />
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  );
}
