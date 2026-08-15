import { notFound } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { StarIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/validation';
import { initials } from '@/lib/utils';
import { EnrollPanel } from './EnrollPanel';

export const revalidate = 30;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const supabase = createClient();
  const { data: course } = await supabase.from('courses').select('*').eq('slug', p.slug).single();
  if (!course) return { title: 'Course not found' };
  return {
    title: course.seo_title || course.title,
    description: course.meta_description || course.description,
    openGraph: { images: course.og_image_url ? [course.og_image_url] : [] }
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const supabase = createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('*, tutors(user_id, bio, headline, verification_status, users(full_name, avatar_url)), categories(name)')
    .eq('slug', p.slug)
    .eq('status', 'published')
    .single();

  if (!course) notFound();

  const [{ data: modules }, { data: reviews }] = await Promise.all([
    supabase
      .from('modules')
      .select('*, lessons(id, title, video_duration_seconds)')
      .eq('course_id', course.id)
      .order('position'),
    supabase.from('reviews').select('*, students(users(full_name))').eq('course_id', course.id).order('created_at', { ascending: false }).limit(10)
  ]);

  const totalLessons = (modules ?? []).reduce((sum: number, m: any) => sum + (m.lessons?.length ?? 0), 0);
  const tutor = (course as any).tutors;

  return (
    <div>
      <section className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1fr_380px] md:px-8">
          <div>
            {(course as any).categories?.name && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-action">
                {(course as any).categories.name}
              </span>
            )}
            <h1 className="mt-3 font-display text-2xl font-extrabold md:text-4xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">{course.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1"><IconifyIcon icon="lucide:star" className="h-4 w-4 fill-gold text-gold" /> {course.rating_avg.toFixed(1)} ({course.rating_count} ratings)</span>
              <span className="flex items-center gap-1"><IconifyIcon icon="lucide:users" className="h-4 w-4" /> {course.enrollment_count} students</span>
              <span className="flex items-center gap-1"><IconifyIcon icon="lucide:clock" className="h-4 w-4" /> {course.duration_hours ?? '—'} hours</span>
              <span className="flex items-center gap-1 capitalize"><IconifyIcon icon="lucide:bar-chart-3" className="h-4 w-4" /> {course.level}</span>
              <span className="flex items-center gap-1"><IconifyIcon icon="lucide:globe" className="h-4 w-4" /> {course.language}</span>
            </div>

            {tutor && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-action/20 font-display font-bold text-action">
                  {initials(tutor.users?.full_name ?? 'T')}
                </div>
                <div>
                  <p className="text-sm font-semibold">{tutor.users?.full_name}</p>
                  <p className="text-xs text-white/60">{tutor.headline || 'Digtech Academy Tutor'}</p>
                </div>
                {tutor.verification_status === 'verified' && (
                  <IconifyIcon icon="lucide:check-circle-2" className="h-4 w-4 text-success" aria-label="Verified tutor" />
                )}
              </div>
            )}
          </div>

          <EnrollPanel course={course as any} />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1fr_380px] md:px-8">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Course overview</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/70">{course.course_overview}</p>
          </div>

          {course.requirements && course.requirements.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Requirements</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink/70">
                {course.requirements.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {course.target_audience && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Who this course is for</h2>
              <p className="mt-3 text-sm text-ink/70">{course.target_audience}</p>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-bold text-ink">Course outline</h2>
            <p className="mt-1 text-xs text-ink/50">{modules?.length ?? 0} modules • {totalLessons} lessons</p>
            <div className="mt-4 divide-y divide-brand-light rounded-xl2 border border-brand-light">
              {(modules ?? []).map((m: any, i: number) => (
                <details key={m.id} className="group p-4" open={i === 0}>
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-ink">
                    <span>Module {i + 1}: {m.title}</span>
                    <span className="text-xs font-normal text-ink/50">{m.lessons?.length ?? 0} lessons</span>
                  </summary>
                  {m.overview && <p className="mt-2 text-sm text-ink/60">{m.overview}</p>}
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                    {(m.lessons ?? []).map((l: any) => (
                      <li key={l.id} className="flex justify-between">
                        <span>▸ {l.title}</span>
                        {l.video_duration_seconds && <span className="text-xs text-ink/40">{Math.round(l.video_duration_seconds / 60)} min</span>}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              {(!modules || modules.length === 0) && (
                <p className="p-4 text-sm text-ink/50">This tutor is still building the course outline.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink">Student reviews</h2>
            <div className="mt-4 space-y-4">
              {(reviews ?? []).length === 0 && <p className="text-sm text-ink/50">No reviews yet — be the first to complete this course and leave one.</p>}
              {(reviews ?? []).map((r: any) => (
                <div key={r.id} className="rounded-xl2 border border-brand-light p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{r.students?.users?.full_name ?? 'Student'}</p>
                    <span className="flex items-center gap-1 text-xs text-gold">
                      <span className="flex items-center gap-0.5 text-xs text-gold">
                        {[...Array(r.rating)].map((_, i) => <StarIcon key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                        {[...Array(5 - r.rating)].map((_, i) => <StarIcon key={`empty-${i}`} className="h-3 w-3 text-gray-300" />)}
                      </span>
                    </span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-ink/70">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div />{/* spacer */}
      </div>
    </div>
  );
}
