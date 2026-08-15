import Image from 'next/image';
import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';

export const metadata = { title: 'Internship Showcase — Digtech Academy' };

const GALLERY = [
  { src: '/internship/fig.png', title: 'Mobile App Frames', desc: 'Login, account creation, role selection, and settings screens designed during the internship.' },
  { src: '/internship/prototypes.png', title: 'EcoSchool Connect Prototypes', desc: 'Figma prototypes for school management dashboard, reports, and quick actions.' },
  { src: '/internship/schedule.png', title: 'Internship Schedule', desc: 'Weekly timetable and activities from the EYIT eight-week program.' },
  { src: '/internship/IMG_20260729_110146_308@149832055.jpg', title: 'Training Session', desc: 'Hands-on learning at Empower Youth in Technology (EYIT).' },
  { src: '/internship/IMG_20260729_113835_181@149832242.jpg', title: 'Design Work', desc: 'Graphic design and prototyping exercises in progress.' },
  { src: '/internship/IMG_20260729_113841_793@149832243.jpg', title: 'Design Work', desc: 'Practical graphic design and prototyping exercises.' },
  { src: '/internship/IMG_20260729_113851_812@149832244.jpg', title: 'Design Work', desc: 'Practical graphic design and prototyping exercises.' },
  { src: '/internship/IMG_20260729_113858_633@149832245.jpg', title: 'Design Work', desc: 'Practical graphic design and prototyping exercises.' },
  { src: '/internship/IMG_20260729_113925_072@149832246.jpg', title: 'Design Work', desc: 'Practical graphic design and prototyping exercises.' },
  { src: '/internship/IMG-20260608-WA0022.jpg', title: 'Orientation Day', desc: 'First day of the internship with leadership and guest speakers.' },
  { src: '/internship/IMG-20260612-WA0005.jpg', title: 'Adobe Photoshop Training', desc: 'Learning graphic design basics and flyer composition.' },
  { src: '/internship/IMG-20260629-WA0110.jpg', title: 'Video Editing & Livestreaming', desc: 'Advanced video editing with CapCut, Filmora, and Premiere Pro.' },
  { src: '/internship/IMG-20260629-WA0111.jpg', title: 'Video Editing & Livestreaming', desc: 'Advanced video editing with CapCut, Filmora, and Premiere Pro.' },
  { src: '/internship/IMG-20260714-WA0016.jpg', title: 'Design Thinking Workshop', desc: 'Human-centered design and digital entrepreneurship sessions.' },
  { src: '/internship/IMG-20260714-WA0022.jpg', title: 'Design Thinking Workshop', desc: 'Human-centered design and digital entrepreneurship sessions.' },
  { src: '/internship/IMG-20260729-WA0014.jpg', title: 'Prototyping & Fieldwork', desc: 'Speed-monitoring system prototype and community interviews.' },
  { src: '/internship/IMG-20260730-WA0253.jpg', title: 'Closing & Certificate Day', desc: 'Final presentations and certificate-giving ceremony.' },
];

const HIGHLIGHTS = [
  { icon: 'lucide:smartphone', title: 'Mobile App Frames', body: 'Designed login, registration, role selection, and settings screens for a multi-role mobile application.' },
  { icon: 'lucide:monitor', title: 'EcoSchool Connect Prototypes', body: 'Built low-fidelity Figma prototypes for school management dashboards, reports, and quick actions.' },
  { icon: 'lucide:calendar', title: '8-Week Program', body: 'Structured schedule covering orientation, graphic design, video editing, design thinking, and web technologies.' },
  { icon: 'lucide:users', title: 'EYIT Training', body: 'Hands-on industrial training at Empower Youth in Technology under experienced facilitators.' },
];

export default function InternshipPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">← Back to Digtech Academy</Link>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-ink md:text-4xl">Internship Showcase</h1>
        <p className="mt-3 max-w-2xl text-ink/70">
          A complete gallery of frames, prototypes, schedules, and moments from the EYIT internship program at Empower Youth in Technology.
          These works reflect hands-on learning in graphic design, video editing, design thinking, codeless prototyping, and mobile app design.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="rounded-xl2 border border-brand-light bg-white p-5 shadow-card">
            <IconifyIcon icon={h.icon} className="h-7 w-7 text-action" />
            <h3 className="mt-3 font-display font-bold text-ink">{h.title}</h3>
            <p className="mt-1 text-sm text-ink/60">{h.body}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">Full Gallery</h2>
        <span className="text-xs text-ink/50">{GALLERY.length} frames</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map((frame, idx) => (
          <div key={idx} className="group overflow-hidden rounded-xl2 border border-brand-light bg-white shadow-card transition hover:shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden bg-brand-light">
              <Image
                src={frame.src}
                alt={frame.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-ink">{frame.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{frame.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
