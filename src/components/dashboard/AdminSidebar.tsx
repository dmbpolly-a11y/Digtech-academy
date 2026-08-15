import { DashboardSidebar } from './Sidebar';

const ITEMS = [
  { href: '/admin/dashboard', label: 'Overview', icon: 'lucide:layout-dashboard' },
  { href: '/admin/principals', label: 'Principals', icon: 'lucide:shield' },
  { href: '/admin/tutors', label: 'Tutors', icon: 'lucide:graduation-cap' },
  { href: '/admin/students', label: 'Students', icon: 'lucide:users' },
  { href: '/admin/courses', label: 'Courses', icon: 'lucide:book-open' },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: 'lucide:banknote' },
  { href: '/admin/certificates', label: 'Certificates', icon: 'lucide:award' },
  { href: '/admin/reports', label: 'Reports', icon: 'lucide:bar-chart-3' },
  { href: '/admin/settings', label: 'Settings', icon: 'lucide:settings' }
];

export function AdminSidebar() {
  return <DashboardSidebar items={ITEMS} roleLabel="Administrator" />;
}
