'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import { FileUpload } from '@/components/FileUpload';
import type { Tutor } from '@/types/database';

export function TutorVerificationForm({ tutor }: { tutor: Tutor }) {
  const [values, setValues] = useState({
    headline: tutor.headline ?? '',
    bio: tutor.bio ?? '',
    qualifications: tutor.qualifications ?? ''
  });
  const [idUrl, setIdUrl] = useState<string | null>((tutor as any).national_id_url ?? null);
  const [photoUrl, setPhotoUrl] = useState<string | null>((tutor as any).profile_photo_url ?? null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const supabase = createClient();
    const { error } = await supabase
      .from('tutors')
      .update({
        headline: values.headline,
        bio: values.bio,
        qualifications: values.qualifications,
        national_id_url: idUrl,
        profile_photo_url: photoUrl,
        verification_status: idUrl && photoUrl ? 'pending' : 'unverified'
      })
      .eq('user_id', tutor.user_id);

    setStatus(error ? 'error' : 'saved');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Headline">
        <input className="field" placeholder="e.g. Full-Stack Web Developer & Trainer" value={values.headline} onChange={(e) => setValues((v) => ({ ...v, headline: e.target.value }))} />
      </Field>
      <Field label="Bio">
        <textarea rows={3} className="field resize-none" value={values.bio} onChange={(e) => setValues((v) => ({ ...v, bio: e.target.value }))} />
      </Field>
      <Field label="Qualifications">
        <textarea rows={2} className="field resize-none" placeholder="Degrees, certifications, years of experience…" value={values.qualifications} onChange={(e) => setValues((v) => ({ ...v, qualifications: e.target.value }))} />
      </Field>
      <Field label="National ID">
        <FileUpload bucket="tutor-documents" pathPrefix="national-ids" currentUrl={idUrl} onUploaded={setIdUrl} label="Upload National ID" />
      </Field>
      <Field label="Profile photo">
        <FileUpload bucket="tutor-documents" pathPrefix="profile-photos" accept="image/*" currentUrl={photoUrl} onUploaded={setPhotoUrl} label="Upload profile photo" />
      </Field>

      {status === 'error' && <p className="text-xs text-red-600">Could not save. Please try again.</p>}
      {status === 'saved' && <p className="text-xs text-success">Saved — a Principal will review your verification.</p>}

      <Button type="submit" loading={status === 'saving'} className="w-full">Save & submit for verification</Button>

      <style jsx>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid #d9e2f5; padding: 0.6rem 0.85rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
