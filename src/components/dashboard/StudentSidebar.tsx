import { DashboardSidebar } from './Sidebar';

const ITEMS = [
  { href: '/student/dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { href: '/student/courses', label: 'My Courses', icon: 'lucide:book-open' },
  { href: '/student/certificates', label: 'Certificates', icon: 'lucide:award' },
  { href: '/student/profile', label: 'Profile', icon: 'lucide:user-circle' }
];

export function StudentSidebar() {
  return <DashboardSidebar items={ITEMS} roleLabel="Student" />;
}
