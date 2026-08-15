import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'FAQs' };
export const revalidate = 120;

export default async function FaqsPage() {
  const supabase = createClient();
  const { data: faqs } = await supabase.from('faqs').select('*').order('position');

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">Frequently asked questions</h1>
      <p className="mt-2 text-sm text-ink/60">Can't find what you're looking for? <a href="/contact" className="font-semibold text-brand hover:underline">Contact us</a>.</p>

      <div className="mt-8 divide-y divide-brand-light rounded-xl2 border border-brand-light">
        {(faqs ?? []).map((f) => (
          <details key={f.id} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none">
              <span className="flex items-center justify-between">
                {f.question}
                <span className="ml-4 text-action transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm text-ink/70">{f.answer}</p>
          </details>
        ))}
        {(!faqs || faqs.length === 0) && <p className="p-5 text-sm text-ink/50">FAQs will appear here once added by an administrator.</p>}
      </div>
    </div>
  );
}
