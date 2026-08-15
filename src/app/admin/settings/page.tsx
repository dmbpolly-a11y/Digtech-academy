import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from './SettingsForm';

export const metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">System settings</h1>
      <p className="mt-1 text-sm text-ink/60">Controls the public website content, payment commission, and SMS sender ID.</p>

      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <SettingsForm settings={settings} />
      </div>

      <div className="mt-6 rounded-xl2 border border-brand-light bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Environment-level configuration</h2>
        <p className="mt-1 text-sm text-ink/60">
          Payment gateway keys (Pandora) and the SMS API key are set as server environment variables, not here, so they
          are never exposed to the browser. Edit <code className="rounded bg-brand-light px-1.5 py-0.5 font-mono text-xs">.env.local</code> and see the README for details.
        </p>
      </div>
    </div>
  );
}
