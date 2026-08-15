'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { courseSchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import { FileUpload } from '@/components/FileUpload';
import type { Course } from '@/types/database';

interface Props {
  categories: { id: string; name: string }[];
  mode: 'create' | 'edit';
  course?: Course;
}

export function CourseForm({ categories, mode, course }: Props) {
  const router = useRouter();
  const [values, setValues] = useState({
    title: course?.title ?? '',
    categoryId: course?.category_id ?? categories[0]?.id ?? '',
    description: course?.description ?? '',
    courseOverview: course?.course_overview ?? '',
    requirements: (course?.requirements ?? ['']).join('\n'),
    targetAudience: course?.target_audience ?? '',
    durationHours: course?.duration_hours ?? 0,
    fee: course?.fee ?? 0,
    isFree: course?.is_free ?? false,
    language: course?.language ?? 'English',
    level: course?.level ?? 'beginner',
    seoTitle: course?.seo_title ?? '',
    metaDescription: course?.meta_description ?? '',
    thumbnailUrl: course?.thumbnail_url ?? ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const parsed = courseSchema.safeParse({
      ...values,
      requirements: values.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      durationHours: Number(values.durationHours),
      fee: values.isFree ? 0 : Number(values.fee)
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setFormError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) return;

    const payload = {
      title: parsed.data.title,
      slug: slugify(parsed.data.title) + '-' + Math.random().toString(36).slice(2, 7),
      category_id: parsed.data.categoryId,
      description: parsed.data.description,
      course_overview: parsed.data.courseOverview,
      requirements: parsed.data.requirements,
      target_audience: parsed.data.targetAudience,
      duration_hours: parsed.data.durationHours,
      fee: parsed.data.fee,
      is_free: parsed.data.isFree,
      language: parsed.data.language,
      level: parsed.data.level,
      seo_title: parsed.data.seoTitle || parsed.data.title,
      meta_description: parsed.data.metaDescription || parsed.data.description.slice(0, 160),
      thumbnail_url: values.thumbnailUrl || null,
      tutor_id: userRes.user.id
    };

    if (mode === 'create') {
      const { data, error } = await supabase.from('courses').insert(payload).select().single();
      if (error) {
        setFormError('Could not create the course. Please try again.');
        setLoading(false);
        return;
      }
      router.push(`/tutor/courses/${data.id}/edit`);
    } else {
      const { slug, ...updatePayload } = payload; // keep the original slug stable on edit
      const { error } = await supabase.from('courses').update(updatePayload).eq('id', course!.id);
      if (error) {
        setFormError('Could not save changes.');
        setLoading(false);
        return;
      }
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Course thumbnail">
        <FileUpload
          bucket="course-thumbnails"
          pathPrefix="thumbnails"
          accept="image/*"
          currentUrl={values.thumbnailUrl}
          onUploaded={(url) => setValues((v) => ({ ...v, thumbnailUrl: url }))}
          label="Upload a thumbnail image"
        />
      </Field>

      <Field label="Course title" error={errors.title}>
        <input className="field" value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} />
      </Field>

      <Field label="Category" error={errors.categoryId}>
        <select className="field" value={values.categoryId} onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>

      <Field label="Short description" error={errors.description}>
        <textarea rows={3} className="field resize-none" value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />
      </Field>

      <Field label="Course overview" error={errors.courseOverview}>
        <textarea rows={4} className="field resize-none" value={values.courseOverview} onChange={(e) => setValues((v) => ({ ...v, courseOverview: e.target.value }))} />
      </Field>

      <Field label="Requirements (one per line)" error={errors.requirements}>
        <textarea rows={3} className="field resize-none" value={values.requirements} onChange={(e) => setValues((v) => ({ ...v, requirements: e.target.value }))} />
      </Field>

      <Field label="Target audience" error={errors.targetAudience}>
        <input className="field" value={values.targetAudience} onChange={(e) => setValues((v) => ({ ...v, targetAudience: e.target.value }))} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Duration (hours)" error={errors.durationHours}>
          <input type="number" min={0} step={0.5} className="field" value={values.durationHours} onChange={(e) => setValues((v) => ({ ...v, durationHours: Number(e.target.value) }))} />
        </Field>
        <Field label="Skill level" error={errors.level}>
          <select className="field" value={values.level} onChange={(e) => setValues((v) => ({ ...v, level: e.target.value as any }))}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isFree"
          type="checkbox"
          checked={values.isFree}
          onChange={(e) => setValues((v) => ({ ...v, isFree: e.target.checked }))}
          className="h-4 w-4 rounded border-brand-light text-action"
        />
        <label htmlFor="isFree" className="text-sm text-ink">This course is free</label>
      </div>

      {!values.isFree && (
        <Field label="Fee (UGX)" error={errors.fee}>
          <input type="number" min={0} className="field" value={values.fee} onChange={(e) => setValues((v) => ({ ...v, fee: Number(e.target.value) }))} />
        </Field>
      )}

      <Field label="Language">
        <input className="field" value={values.language} onChange={(e) => setValues((v) => ({ ...v, language: e.target.value }))} />
      </Field>

      <details className="rounded-xl border border-brand-light p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">SEO settings (optional)</summary>
        <div className="mt-3 space-y-3">
          <Field label="SEO title" error={errors.seoTitle}>
            <input className="field" value={values.seoTitle} onChange={(e) => setValues((v) => ({ ...v, seoTitle: e.target.value }))} />
          </Field>
          <Field label="Meta description" error={errors.metaDescription}>
            <textarea rows={2} className="field resize-none" value={values.metaDescription} onChange={(e) => setValues((v) => ({ ...v, metaDescription: e.target.value }))} />
          </Field>
        </div>
      </details>

      {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}

      <Button type="submit" loading={loading} className="w-full">
        {mode === 'create' ? 'Create course & continue' : 'Save changes'}
      </Button>

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
