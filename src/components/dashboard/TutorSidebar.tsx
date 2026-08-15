import { DashboardSidebar } from './Sidebar';

const ITEMS = [
  { href: '/tutor/dashboard', label: 'Overview', icon: 'lucide:layout-dashboard' },
  { href: '/tutor/courses', label: 'My Courses', icon: 'lucide:book-open' },
  { href: '/tutor/students', label: 'Students', icon: 'lucide:users' },
  { href: '/tutor/earnings', label: 'Earnings', icon: 'lucide:wallet' },
  { href: '/tutor/withdrawals', label: 'Withdrawals', icon: 'lucide:banknote' },
  { href: '/tutor/profile', label: 'Profile', icon: 'lucide:user-circle' }
];

export function TutorSidebar() {
  return <DashboardSidebar items={ITEMS} roleLabel="Tutor" />;
}
