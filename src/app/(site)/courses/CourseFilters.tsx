'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';

interface Props {
  categories: { id: string; name: string }[];
  searchParams: Record<string, string | undefined>;
}

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const DURATIONS = [
  { value: 'short', label: 'Under 3 hours' },
  { value: 'medium', label: '3–10 hours' },
  { value: 'long', label: '10+ hours' }
];

export function CourseFilters({ categories, searchParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <aside className="h-fit rounded-xl2 border border-brand-light p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <IconifyIcon icon="lucide:sliders-horizontal" className="h-4 w-4 text-action" /> Filters
      </div>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <FilterChip key={c.id} active={searchParams.category === c.id} onClick={() => setParam('category', c.id)}>
            {c.name}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <FilterChip active={searchParams.price === 'free'} onClick={() => setParam('price', 'free')}>Free</FilterChip>
        <FilterChip active={searchParams.price === 'paid'} onClick={() => setParam('price', 'paid')}>Paid</FilterChip>
      </FilterGroup>

      <FilterGroup title="Skill level">
        {LEVELS.map((l) => (
          <FilterChip key={l} active={searchParams.level === l} onClick={() => setParam('level', l)}>
            <span className="capitalize">{l}</span>
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup title="Duration">
        {DURATIONS.map((d) => (
          <FilterChip key={d.value} active={searchParams.duration === d.value} onClick={() => setParam('duration', d.value)}>
            {d.label}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup title="Sort by">
        {[
          { value: 'popular', label: 'Most popular' },
          { value: 'newest', label: 'Newest' },
          { value: 'price_low', label: 'Price: low to high' },
          { value: 'price_high', label: 'Price: high to low' }
        ].map((s) => (
          <FilterChip key={s.value} active={(searchParams.sort ?? 'popular') === s.value} onClick={() => setParam('sort', s.value)}>
            {s.label}
          </FilterChip>
        ))}
      </FilterGroup>

      <button
        onClick={() => router.push(pathname)}
        className="mt-5 w-full rounded-full border border-brand/30 py-2 text-xs font-semibold text-brand hover:bg-brand-light"
      >
        Clear all filters
      </button>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-brand-light pt-4 first:mt-4 first:border-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active ? 'border-action bg-action text-white' : 'border-brand-light text-ink/70 hover:border-action hover:text-action'
      }`}
    >
      {children}
    </button>
  );
}
