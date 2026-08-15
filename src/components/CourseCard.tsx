import Link from 'next/link';
import Image from 'next/image';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { formatCurrency } from '@/lib/validation';
import type { Course } from '@/types/database';

export function CourseCard({ course }: { course: Course & { tutor_name?: string; category_name?: string } }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-brand-light bg-white shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-brand-light">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-brand/30">
            {course.title.slice(0, 1)}
          </div>
        )}
        {course.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand">
            {course.category_name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold text-ink group-hover:text-brand">{course.title}</h3>
        {course.tutor_name && <p className="text-xs text-ink/60">by {course.tutor_name}</p>}

        <div className="mt-1 flex items-center gap-3 text-xs text-ink/70">
          <span className="flex items-center gap-1">
            <IconifyIcon icon="lucide:star" className="h-3.5 w-3.5 fill-gold text-gold" /> {course.rating_avg.toFixed(1)} ({course.rating_count})
          </span>
          <span className="flex items-center gap-1">
            <IconifyIcon icon="lucide:clock" className="h-3.5 w-3.5" /> {course.duration_hours ?? '—'}h
          </span>
          <span className="flex items-center gap-1 capitalize">
            <IconifyIcon icon="lucide:bar-chart-3" className="h-3.5 w-3.5" /> {course.level}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-lg font-bold text-brand">
            {course.is_free ? 'Free' : formatCurrency(course.fee)}
          </span>
          <span className="text-xs text-ink/50">{course.enrollment_count} enrolled</span>
        </div>
      </div>
    </Link>
  );
}
