import { AdminSidebar } from '@/components/dashboard/AdminSidebar';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-light/40">
      <AdminSidebar />
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  );
}
