import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from './ProfileForm';

export const metadata = { title: 'Profile' };

export default async function StudentProfilePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single();

  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Profile</h1>
      <p className="mt-1 text-sm text-ink/60">Update your personal details.</p>
      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <ProfileForm profile={profile!} email={user!.email ?? ''} />
      </div>
    </div>
  );
}
