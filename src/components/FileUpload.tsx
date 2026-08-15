'use client';

import { useState } from 'react';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';

interface Props {
  bucket: string;
  pathPrefix: string;
  accept?: string;
  currentUrl?: string | null;
  onUploaded: (publicUrl: string) => void;
  label?: string;
}

export function FileUpload({ bucket, pathPrefix, accept, currentUrl, onUploaded, label = 'Upload file' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl ?? null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${pathPrefix}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

    if (uploadError) {
      setError(`Could not upload — make sure the "${bucket}" storage bucket exists and is public.`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUploadedUrl(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-brand-light px-4 py-3 text-sm text-ink/60 hover:border-action hover:text-action">
        {uploadedUrl ? (
          <IconifyIcon icon="lucide:check-circle-2" className="h-4 w-4 text-success" />
        ) : (
          <IconifyIcon icon="lucide:upload-cloud" className="h-4 w-4" />
        )}
        {uploading ? 'Uploading…' : uploadedUrl ? 'File uploaded — click to replace' : label}
        <input type="file" accept={accept} className="hidden" onChange={handleChange} />
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
