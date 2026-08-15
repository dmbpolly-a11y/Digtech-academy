import { DashboardSidebar } from './Sidebar';

const ITEMS = [
  { href: '/principal/dashboard', label: 'Overview', icon: 'lucide:layout-dashboard' },
  { href: '/principal/tutors', label: 'Tutors', icon: 'lucide:graduation-cap' },
  { href: '/principal/students', label: 'Students', icon: 'lucide:users' },
  { href: '/principal/certificates', label: 'Certificates', icon: 'lucide:award' },
  { href: '/principal/live-applications', label: 'Live Applications', icon: 'lucide:radio' }
];

export function PrincipalSidebar() {
  return <DashboardSidebar items={ITEMS} roleLabel="Principal" />;
}
