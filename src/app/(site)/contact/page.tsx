import { createClient } from '@/lib/supabase/server';
import { ContactForm } from './ContactForm';
import { LocationIcon, PhoneIcon, EmailIcon, MapIcon } from '@/components/icons';

export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').single();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">Get in touch</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/60">
        Questions about a course, a payment, or becoming a tutor? Send us a message and our team will reply within one working day.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <EmailIcon className="mt-0.5 h-5 w-5 text-action" />
            <div>
              <p className="text-sm font-semibold text-ink">Email</p>
              <p className="text-sm text-ink/60">{settings?.contact_email ?? 'info@digtechsolutionshub.com'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneIcon className="mt-0.5 h-5 w-5 text-action" />
            <div>
              <p className="text-sm font-semibold text-ink">Phone</p>
              <p className="text-sm text-ink/60">{settings?.contact_phone ?? '+256 (0) 770 613 201'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <LocationIcon className="mt-0.5 h-5 w-5 text-action" />
            <div>
              <p className="text-sm font-semibold text-ink">Address</p>
              <p className="text-sm text-ink/60">{settings?.contact_address ?? 'Level 2 Grand West Arcade, High Street Mbarara City - Uganda'}</p>
            </div>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-xl2 border border-brand-light bg-brand-light">
            <iframe
              src="https://www.google.com/maps?ll=-0.606781,30.661901&z=15&t=m&hl=en-US&gl=US&mapclient=embed&q=Level+2+Grand+West+Arcade,+High+Street+Mbarara+City+-+Uganda"
              className="h-full w-full"
              loading="lazy"
              title="Digtech Academy location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
