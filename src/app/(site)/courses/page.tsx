import { createClient } from '@/lib/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { CourseFilters } from './CourseFilters';

export const metadata = { title: 'Courses' };
export const revalidate = 30;

interface SearchParams {
  [key: string]: string | undefined;
  q?: string;
  category?: string;
  price?: 'free' | 'paid';
  level?: string;
  duration?: 'short' | 'medium' | 'long';
  sort?: 'popular' | 'newest' | 'price_low' | 'price_high';
}

export default async function CoursesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const supabase = createClient();

  const { data: categories } = await supabase.from('categories').select('*').order('name');

  let query = supabase
    .from('courses')
    .select('*, tutors(users(full_name)), categories(name)')
    .eq('status', 'published');

  if (sp.q) query = query.ilike('title', `%${sp.q}%`);
  if (sp.category) query = query.eq('category_id', sp.category);
  if (sp.price === 'free') query = query.eq('is_free', true);
  if (sp.price === 'paid') query = query.eq('is_free', false);
  if (sp.level) query = query.eq('level', sp.level);
  if (sp.duration === 'short') query = query.lt('duration_hours', 3);
  if (sp.duration === 'medium') query = query.gte('duration_hours', 3).lte('duration_hours', 10);
  if (sp.duration === 'long') query = query.gt('duration_hours', 10);

  switch (sp.sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'price_low':
      query = query.order('fee', { ascending: true });
      break;
    case 'price_high':
      query = query.order('fee', { ascending: false });
      break;
    default:
      // Order by enrollment count, but prioritize courses with emojis in title
      query = query.order('enrollment_count', { ascending: false });
  }

  const { data: courses } = await query.limit(24);

  // Sort courses to prioritize emoji-marked ones
  const hasEmoji = (text: string) => /[\p{Emoji}]/u.test(text);
  
  const mapped = (courses ?? []).map((c: any) => ({
    ...c,
    tutor_name: c.tutors?.users?.full_name,
    category_name: c.categories?.name,
    has_emoji: hasEmoji(c.title)
  })).sort((a, b) => {
    // Emoji-marked courses come first
    if (a.has_emoji && !b.has_emoji) return -1;
    if (!a.has_emoji && b.has_emoji) return 1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">Browse courses</h1>
      <p className="mt-1 text-sm text-ink/60">{mapped.length} course{mapped.length === 1 ? '' : 's'} found</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <CourseFilters categories={categories ?? []} searchParams={sp} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {mapped.length === 0 && (
            <div className="col-span-full rounded-xl2 border border-dashed border-brand-light p-10 text-center text-sm text-ink/50">
              No courses match those filters yet. Try widening your search.
            </div>
          )}
          {mapped.map((c: any) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
