'use client';

import { useState, FormEvent } from 'react';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { liveApplicationSchema } from '@/lib/validation';
import { Button } from '@/components/Button';

const DAY_OPTIONS = ['Weekdays', 'Weekends', 'Weekdays & Weekends'];
const TIME_OPTIONS = ['Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Evening (4pm–8pm)'];

export function LiveApplyButton({ liveCourseId, courseTitle }: { liveCourseId: string; courseTitle: string }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ fullName: '', mobileNumber: '', preferredDays: '', preferredStudyTime: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = liveApplicationSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('sending');

    const supabase = createClient();
    const { error } = await supabase.from('live_applications').insert({
      live_course_id: liveCourseId,
      full_name: parsed.data.fullName,
      mobile_number: parsed.data.mobileNumber,
      preferred_days: parsed.data.preferredDays,
      preferred_study_time: parsed.data.preferredStudyTime
    });

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('sent');
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Apply now</Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 md:items-center md:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 md:rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">Apply for &quot;{courseTitle}&quot;</h3>
              <button onClick={() => setOpen(false)} aria-label="Close"><IconifyIcon icon="lucide:x" className="h-5 w-5 text-ink/50" /></button>
            </div>

            {status === 'sent' ? (
              <p className="mt-6 rounded-xl bg-success/10 p-4 text-sm text-ink/80">
                Application received! Our team will contact you by SMS to confirm your seat.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 space-y-4">
                <Field label="Full name" error={errors.fullName}>
                  <input
                    className="field"
                    value={values.fullName}
                    onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
                  />
                </Field>
                <Field label="Mobile number" error={errors.mobileNumber}>
                  <input
                    className="field"
                    placeholder="0771234567"
                    value={values.mobileNumber}
                    onChange={(e) => setValues((v) => ({ ...v, mobileNumber: e.target.value }))}
                  />
                </Field>
                <Field label="Preferred days" error={errors.preferredDays}>
                  <select className="field" value={values.preferredDays} onChange={(e) => setValues((v) => ({ ...v, preferredDays: e.target.value }))}>
                    <option value="">Select...</option>
                    {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Preferred study time" error={errors.preferredStudyTime}>
                  <select className="field" value={values.preferredStudyTime} onChange={(e) => setValues((v) => ({ ...v, preferredStudyTime: e.target.value }))}>
                    <option value="">Select...</option>
                    {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>

                {status === 'error' && <p className="text-xs text-red-600">Something went wrong. Please try again.</p>}

                <Button type="submit" loading={status === 'sending'} className="w-full">Submit application</Button>
              </form>
            )}

            <style jsx>{`
              .field {
                width: 100%;
                border-radius: 0.75rem;
                border: 1px solid #d9e2f5;
                padding: 0.6rem 0.85rem;
                font-size: 0.875rem;
                outline: none;
              }
              .field:focus { border-color: #28c0f4; box-shadow: 0 0 0 3px rgba(40, 192, 244, 0.15); }
            `}</style>
          </div>
        </div>
      )}
    </>
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
