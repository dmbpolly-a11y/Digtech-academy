'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { settingsSchema } from '@/lib/validation';
import { Button } from '@/components/Button';
import type { SiteSettings } from '@/types/database';

export function SettingsForm({ settings }: { settings?: Partial<SiteSettings> | null }) {
  const [values, setValues] = useState({
    academyName: settings?.academy_name ?? 'Digtech Academy',
    heroHeadline: settings?.hero_headline ?? 'Skills that pay, taught by tutors you trust.',
    heroSubheadline: settings?.hero_subheadline ?? "Uganda's multi-tenant academy for live and self-paced courses.",
    contactEmail: settings?.contact_email ?? '',
    contactPhone: settings?.contact_phone ?? '',
    contactAddress: settings?.contact_address ?? '',
    facebookUrl: settings?.facebook_url ?? '',
    twitterUrl: settings?.twitter_url ?? '',
    instagramUrl: settings?.instagram_url ?? '',
    linkedinUrl: settings?.linkedin_url ?? '',
    mapEmbedUrl: settings?.map_embed_url ?? '',
    platformCommissionPercent: settings?.platform_commission_percent ?? 30,
    smsSenderId: settings?.sms_sender_id ?? 'Digtech'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = settingsSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('saving');
    const supabase = createClient();
    const { error } = await supabase
      .from('site_settings')
      .update({
        academy_name: values.academyName,
        hero_headline: values.heroHeadline,
        hero_subheadline: values.heroSubheadline,
        contact_email: values.contactEmail || null,
        contact_phone: values.contactPhone || null,
        contact_address: values.contactAddress || null,
        facebook_url: values.facebookUrl || null,
        twitter_url: values.twitterUrl || null,
        instagram_url: values.instagramUrl || null,
        linkedin_url: values.linkedinUrl || null,
        map_embed_url: values.mapEmbedUrl || null,
        platform_commission_percent: Number(values.platformCommissionPercent),
        sms_sender_id: values.smsSenderId
      })
      .eq('id', true);

    setStatus(error ? 'error' : 'saved');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Academy name" error={errors.academyName}><input className="field" value={values.academyName} onChange={(e) => setValues((v) => ({ ...v, academyName: e.target.value }))} /></Field>
      <Field label="Hero headline" error={errors.heroHeadline}><input className="field" value={values.heroHeadline} onChange={(e) => setValues((v) => ({ ...v, heroHeadline: e.target.value }))} /></Field>
      <Field label="Hero subheadline" error={errors.heroSubheadline}><textarea rows={2} className="field resize-none" value={values.heroSubheadline} onChange={(e) => setValues((v) => ({ ...v, heroSubheadline: e.target.value }))} /></Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact email" error={errors.contactEmail}><input className="field" value={values.contactEmail} onChange={(e) => setValues((v) => ({ ...v, contactEmail: e.target.value }))} /></Field>
        <Field label="Contact phone" error={errors.contactPhone}><input className="field" value={values.contactPhone} onChange={(e) => setValues((v) => ({ ...v, contactPhone: e.target.value }))} /></Field>
      </div>
      <Field label="Address" error={errors.contactAddress}><input className="field" value={values.contactAddress} onChange={(e) => setValues((v) => ({ ...v, contactAddress: e.target.value }))} /></Field>
      <Field label="Google Map embed URL" error={errors.mapEmbedUrl}><input className="field" value={values.mapEmbedUrl} onChange={(e) => setValues((v) => ({ ...v, mapEmbedUrl: e.target.value }))} /></Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Facebook URL" error={errors.facebookUrl}><input className="field" value={values.facebookUrl} onChange={(e) => setValues((v) => ({ ...v, facebookUrl: e.target.value }))} /></Field>
        <Field label="Twitter/X URL" error={errors.twitterUrl}><input className="field" value={values.twitterUrl} onChange={(e) => setValues((v) => ({ ...v, twitterUrl: e.target.value }))} /></Field>
        <Field label="Instagram URL" error={errors.instagramUrl}><input className="field" value={values.instagramUrl} onChange={(e) => setValues((v) => ({ ...v, instagramUrl: e.target.value }))} /></Field>
        <Field label="LinkedIn URL" error={errors.linkedinUrl}><input className="field" value={values.linkedinUrl} onChange={(e) => setValues((v) => ({ ...v, linkedinUrl: e.target.value }))} /></Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Platform commission (%)" error={errors.platformCommissionPercent}>
          <input type="number" min={0} max={100} className="field" value={values.platformCommissionPercent} onChange={(e) => setValues((v) => ({ ...v, platformCommissionPercent: Number(e.target.value) }))} />
        </Field>
        <Field label="SMS sender ID" error={errors.smsSenderId}><input className="field" value={values.smsSenderId} onChange={(e) => setValues((v) => ({ ...v, smsSenderId: e.target.value }))} /></Field>
      </div>

      {status === 'error' && <p className="text-xs text-red-600">Could not save settings.</p>}
      {status === 'saved' && <p className="text-xs text-success">Settings saved.</p>}

      <Button type="submit" loading={status === 'saving'} className="w-full">Save settings</Button>

      <style jsx>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid #d9e2f5; padding: 0.6rem 0.85rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
      `}</style>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
