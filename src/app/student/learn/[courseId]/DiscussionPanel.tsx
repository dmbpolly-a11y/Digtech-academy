'use client';

import { useEffect, useState } from 'react';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { discussionSchema, replySchema } from '@/lib/validation';
import { Button } from '@/components/Button';
import { initials, formatDate } from '@/lib/utils';

interface DiscussionWithReplies {
  id: string;
  question: string;
  created_at: string;
  students: { users: { full_name: string } };
  replies: { id: string; body: string; author_id: string; is_best_answer: boolean; created_at: string; users: { full_name: string; role: string } }[];
}

export function DiscussionPanel({ lessonId, currentUserId }: { lessonId: string; currentUserId: string }) {
  const [discussions, setDiscussions] = useState<DiscussionWithReplies[]>([]);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('discussions')
      .select('*, students(users(full_name)), replies(*, users(full_name, role))')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false });
    setDiscussions((data as any) ?? []);
  }

  useEffect(() => {
    load();
  }, [lessonId]);

  async function postQuestion() {
    const parsed = discussionSchema.safeParse({ question });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    setPosting(true);
    const res = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, question: parsed.data.question })
    });
    setPosting(false);
    if (res.ok) {
      setQuestion('');
      load();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Could not post question.');
    }
  }

  async function postReply(discussionId: string) {
    const draft = replyDrafts[discussionId] ?? '';
    const parsed = replySchema.safeParse({ body: draft });
    if (!parsed.success) return;

    await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discussionId, body: parsed.data.body })
    });
    setReplyDrafts((d) => ({ ...d, [discussionId]: '' }));
    load();
  }

  return (
    <div className="mt-4">
      <div className="rounded-xl2 border border-brand-light p-4">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this lesson…"
          className="w-full resize-none rounded-lg border border-brand-light p-3 text-sm outline-none focus:border-action"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={postQuestion} loading={posting}>Post question</Button>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {discussions.map((d) => (
          <div key={d.id} className="rounded-xl2 border border-brand-light p-4">
            <div className="flex items-start gap-3">
              <Avatar name={d.students?.users?.full_name ?? 'Student'} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{d.students?.users?.full_name ?? 'Student'}</p>
                <p className="text-xs text-ink/40">{formatDate(d.created_at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                <p className="mt-2 text-sm text-ink/80">{d.question}</p>
              </div>
            </div>

            <div className="ml-11 mt-3 space-y-3 border-l border-brand-light pl-4">
              {(d.replies ?? [])
                .sort((a, b) => Number(b.is_best_answer) - Number(a.is_best_answer))
                .map((r) => (
                  <div key={r.id} className="flex items-start gap-3">
                    <Avatar name={r.users?.full_name ?? 'User'} small />
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        {r.users?.full_name}
                        {r.users?.role === 'tutor' && <span className="rounded-full bg-brand-light px-1.5 py-0.5 text-[10px] text-brand">Tutor</span>}
                        {r.is_best_answer && <IconifyIcon icon="lucide:star" className="h-3 w-3 fill-gold text-gold" />}
                      </p>
                      <p className="mt-0.5 text-sm text-ink/70">{r.body}</p>
                    </div>
                  </div>
                ))}

              <div className="flex gap-2">
                <input
                  value={replyDrafts[d.id] ?? ''}
                  onChange={(e) => setReplyDrafts((v) => ({ ...v, [d.id]: e.target.value }))}
                  placeholder="Write a reply…"
                  className="flex-1 rounded-full border border-brand-light px-3 py-1.5 text-xs outline-none focus:border-action"
                />
                <Button size="sm" variant="ghost" onClick={() => postReply(d.id)}>Reply</Button>
              </div>
            </div>
          </div>
        ))}

        {discussions.length === 0 && <p className="text-sm text-ink/50">No questions yet on this lesson — ask the first one.</p>}
      </div>
    </div>
  );
}

function Avatar({ name, small }: { name: string; small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-light font-semibold text-brand ${
        small ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs'
      }`}
    >
      {initials(name)}
    </div>
  );
}
