import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from '../../student/profile/ProfileForm';
import { TutorVerificationForm } from './TutorVerificationForm';

export const metadata = { title: 'Profile' };

export default async function TutorProfilePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single();
  const { data: tutor } = await supabase.from('tutors').select('*').eq('user_id', user!.id).single();

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8 md:px-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Profile</h1>
        <p className="mt-1 text-sm text-ink/60">Keep your details current and get verified to build trust with students.</p>
      </div>

      <div className="rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <ProfileForm profile={profile!} email={user!.email ?? ''} />
      </div>

      <div className="rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Instructor verification</h2>
        <p className="mt-1 text-sm text-ink/60">
          Status:{' '}
          <span className="font-semibold capitalize text-brand">{tutor?.verification_status?.replace('_', ' ')}</span>
        </p>
        <div className="mt-4">
          <TutorVerificationForm tutor={tutor!} />
        </div>
      </div>
    </div>
  );
}
