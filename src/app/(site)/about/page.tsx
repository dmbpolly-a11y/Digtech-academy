import IconifyIcon from '@/components/icons/IconifyIcon';
import Link from 'next/link';

export const metadata = { title: 'About Us' };

const TEAM = [
  { name: 'Sarah Nakato', role: 'Founder & CEO' },
  { name: 'David Mugisha', role: 'Head of Academics' },
  { name: 'Grace Auma', role: 'Head of Tutor Success' },
  { name: 'Peter Okello', role: 'Engineering Lead' }
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-action">Our story</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
        Built in Uganda, for anyone ready to learn a skill that pays.
      </h1>
      <p className="mt-5 max-w-3xl text-ink/70">
        Digtech Academy started with a simple observation: talented tutors across Uganda had knowledge worth
        sharing, but no easy way to reach students beyond their own neighbourhood — and students had the drive to
        learn, but not always the fees for a traditional classroom. We built a platform where a tutor in Gulu can
        teach a student in Mbarara, get paid fairly, and both walk away with something to show for it: a
        completed course and a verifiable certificate.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl2 border border-brand-light p-6">
          <IconifyIcon icon="lucide:target" className="h-7 w-7 text-action" />
          <h2 className="mt-3 font-display text-lg font-bold text-ink">Our mission</h2>
          <p className="mt-2 text-sm text-ink/70">
            Make practical, income-generating skills affordable and accessible to every Ugandan with a smartphone
            and an internet connection — however light that connection is.
          </p>
        </div>
        <div className="rounded-xl2 border border-brand-light p-6">
          <IconifyIcon icon="lucide:eye" className="h-7 w-7 text-action" />
          <h2 className="mt-3 font-display text-lg font-bold text-ink">Our vision</h2>
          <p className="mt-2 text-sm text-ink/70">
            A Digtech certificate recognised by employers across East Africa as proof of real, verified,
            hands-on ability — not just a piece of paper.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex items-center gap-2">
          <IconifyIcon icon="lucide:users" className="h-6 w-6 text-brand" />
          <h2 className="font-display text-2xl font-bold text-ink">Meet the team</h2>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {TEAM.map((t) => (
            <div key={t.name} className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-light font-display text-xl font-bold text-brand">
                {t.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-ink/50">{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-xl2 border border-brand-light bg-white p-6 md:p-8">
        <div className="flex items-center gap-2">
          <IconifyIcon icon="lucide:briefcase" className="h-6 w-6 text-action" />
          <h2 className="font-display text-2xl font-bold text-ink">Internship at EYIT</h2>
        </div>
        <p className="mt-3 text-sm text-ink/70">
          Our team recently completed an intensive eight-week industrial training at Empower Youth in Technology (EYIT),
          covering graphic design, video editing, design thinking, codeless prototyping, and web technologies.
          Explore the frames, schedules, and prototypes from the program.
        </p>
        <Link href="/internship" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-action px-5 py-2.5 text-sm font-semibold text-white hover:bg-action-dark">
          View internship showcase <IconifyIcon icon="lucide:arrow-right" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
