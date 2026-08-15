import Link from 'next/link';
import Image from 'next/image';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/server';
import { CourseCard } from '@/components/CourseCard';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: settings }, { data: popular }, { data: latest }, { data: testimonials }, { data: faqs }, { data: liveCourses }] =
    await Promise.all([
      supabase.from('site_settings').select('*').single(),
      supabase
        .from('courses')
        .select('*, tutors(users(full_name)), categories(name)')
        .eq('status', 'published')
        .order('enrollment_count', { ascending: false })
        .limit(4),
      supabase.from('courses').select('*, tutors(users(full_name)), categories(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(4),
      supabase.from('testimonials').select('*').order('position').limit(3),
      supabase.from('faqs').select('*').order('position').limit(4),
      supabase.from('live_courses').select('*').eq('is_open', true).limit(3)
    ]);

  const mapCourse = (c: any) => ({
    ...c,
    tutor_name: c.tutors?.users?.full_name,
    category_name: c.categories?.name
  });

  const stats = [
    { label: 'Active students', value: '4,200+' },
    { label: 'Verified tutors', value: '180+' },
    { label: 'Courses published', value: '650+' },
    { label: 'Certificates issued', value: '2,900+' }
  ];

  return (
    <>
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-action">
              Multi-tenant learning, built for Uganda
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-5xl">
              {settings?.hero_headline ?? 'Learn skills that pay, from tutors you trust.'}
            </h1>
            <p className="mt-4 text-base text-white/80 md:text-lg">
              {settings?.hero_subheadline ?? "Uganda's multi-tenant academy for live and self-paced courses."}
            </p>

            <div className="mt-6 animate-float">
              <IconifyIcon icon="lucide:graduation-cap" className="h-24 w-24 text-brand mx-auto" />
            </div>

            <form action="/courses" className="mt-8 flex max-w-lg overflow-hidden rounded-full bg-white p-1.5 shadow-lg">
              <input
                name="q"
                type="text"
                placeholder="Search web development, marketing, design…"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-ink outline-none placeholder:text-ink/40"
              />
              <button className="flex items-center gap-2 rounded-full bg-action px-5 py-2 text-sm font-semibold text-white hover:bg-action-dark">
                <IconifyIcon icon="lucide:search" className="h-4 w-4" /> Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
              <span>Popular:</span>
              {['Web Development', 'Digital Marketing', 'Graphic Design'].map((t) => (
                <Link key={t} href={`/courses?q=${encodeURIComponent(t)}`} className="rounded-full border border-white/20 px-3 py-1 hover:border-action hover:text-action">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-light bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-extrabold text-brand md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-ink/60 md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Popular courses</h2>
            <p className="mt-1 text-sm text-ink/60">The courses students are enrolling in right now.</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(popular ?? []).length === 0 && <EmptyCoursesNote />}
          {(popular ?? []).map((c: any) => (
            <CourseCard key={c.id} course={mapCourse(c)} />
          ))}
        </div>
      </section>

      <section className="bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="flex items-center gap-2">
            <IconifyIcon icon="lucide:radio" className="h-5 w-5 text-action" />
            <h2 className="font-display text-2xl font-bold text-ink">Live online classes</h2>
          </div>
          <p className="mt-1 text-sm text-ink/60">Scheduled sessions with a trainer, in real time.</p>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {(liveCourses ?? []).length === 0 && (
              <p className="text-sm text-ink/50">Live classes will appear here once scheduled.</p>
            )}
            {(liveCourses ?? []).map((lc: any) => (
              <div key={lc.id} className="rounded-xl2 bg-white p-5 shadow-card">
                <h3 className="font-display font-bold text-ink">{lc.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{lc.schedule}</p>
                <p className="mt-3 font-mono font-bold text-brand">{lc.fee > 0 ? `UGX ${lc.fee.toLocaleString()}` : 'Free'}</p>
                <Link href="/live-courses" className="mt-4 inline-block text-sm font-semibold text-action hover:underline">
                  Apply now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <h2 className="font-display text-2xl font-bold text-ink">Latest courses</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(latest ?? []).length === 0 && <EmptyCoursesNote />}
          {(latest ?? []).map((c: any) => (
            <CourseCard key={c.id} course={mapCourse(c)} />
          ))}
        </div>
      </section>

      <section className="border-y border-brand-light bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
          {[
            { icon: 'lucide:shield-check', title: 'Verified tutors', body: 'Every tutor is reviewed before activation, with ID and qualifications on file.' },
            { icon: 'lucide:trending-up', title: 'Track real progress', body: 'Watch lessons, complete modules, and see your completion percentage update live.' },
            { icon: 'lucide:award', title: 'Verifiable certificates', body: 'Every certificate carries a QR code employers can scan to confirm it is genuine.' }
          ].map((f, i) => (
            <div key={i} className="flex gap-4">
              <IconifyIcon icon={f.icon} className="h-8 w-8 shrink-0 text-action" />
              <div>
                <h3 className="font-display font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(testimonials ?? []).length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <h2 className="font-display text-2xl font-bold text-ink">What students say</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {(testimonials!).map((t: any) => (
              <blockquote key={t.id} className="rounded-xl2 border border-brand-light p-5">
                <p className="text-sm italic text-ink/80">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-brand">{t.student_name}</footer>
                {t.course_title && <p className="text-xs text-ink/50">{t.course_title}</p>}
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-brand-light bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="flex items-center gap-2">
            <IconifyIcon icon="lucide:briefcase" className="h-5 w-5 text-action" />
            <h2 className="font-display text-2xl font-bold text-ink">Internship showcase</h2>
          </div>
          <p className="mt-1 text-sm text-ink/60">Real work from our EYIT internship program — frames, prototypes, and schedules.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { src: '/internship/fig.png', title: 'Mobile App Frames' },
              { src: '/internship/prototypes.png', title: 'EcoSchool Connect Prototypes' },
              { src: '/internship/schedule.png', title: 'Internship Schedule' },
              { src: '/internship/IMG-20260730-WA0253.jpg', title: 'Closing Day' }
            ].map((item, i) => (
              <Link key={i} href="/internship" className="group overflow-hidden rounded-xl2 border border-brand-light bg-white shadow-card transition hover:shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden bg-brand-light">
                  <Image src={item.src} alt={item.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/internship" className="mt-6 inline-block text-sm font-semibold text-action hover:underline">View full gallery →</Link>
        </div>
      </section>

      <section className="bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <h2 className="font-display text-2xl font-bold text-ink">Frequently asked questions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(faqs ?? []).map((f: any) => (
              <div key={f.id} className="rounded-xl2 bg-white p-5 shadow-card">
                <p className="font-semibold text-ink">{f.question}</p>
                <p className="mt-1 text-sm text-ink/60">{f.answer}</p>
              </div>
            ))}
          </div>
          <Link href="/faqs" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">See all FAQs →</Link>
        </div>
      </section>
    </>
  );
}

function EmptyCoursesNote() {
  return (
    <div className="col-span-full rounded-xl2 border border-dashed border-brand-light p-8 text-center text-sm text-ink/50">
      No published courses yet — once a tutor publishes a course, it appears here automatically.
    </div>
  );
}
