'use client';

import { useState } from 'react';
import Link from 'next/link';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { ProgressRing } from '@/components/ProgressRing';
import { Button } from '@/components/Button';
import { DiscussionPanel } from './DiscussionPanel';
import type { Course, Enrollment, Certificate } from '@/types/database';

interface LessonRow {
  id: string;
  title: string;
  youtube_video_id: string | null;
  resource_pdf_url: string | null;
  position: number;
}
interface ModuleRow {
  id: string;
  title: string;
  overview: string | null;
  lessons: LessonRow[];
}

interface Props {
  course: Course;
  modules: ModuleRow[];
  enrollment: Enrollment;
  watchedLessonIds: string[];
  certificate: Certificate | null;
  currentUserId: string;
}

export function CoursePlayer({ course, modules, enrollment, watchedLessonIds, certificate, currentUserId }: Props) {
  const allLessons = modules.flatMap((m) => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(allLessons[0]?.id ?? null);
  const [watched, setWatched] = useState<Set<string>>(new Set(watchedLessonIds));
  const [progress, setProgress] = useState(enrollment.progress_percent);
  const [marking, setMarking] = useState(false);
  const [certStatus, setCertStatus] = useState(certificate?.status ?? 'not_applied');
  const [certMessage, setCertMessage] = useState<string | null>(null);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) ?? null;

  async function markComplete() {
    if (!activeLesson || watched.has(activeLesson.id)) return;
    setMarking(true);
    const res = await fetch('/api/lessons/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId: enrollment.id, lessonId: activeLesson.id })
    });
    const data = await res.json();
    if (res.ok) {
      setWatched((prev) => new Set(prev).add(activeLesson.id));
      setProgress(data.progressPercent);
    }
    setMarking(false);
  }

  async function applyForCertificate() {
    setCertMessage(null);
    const res = await fetch('/api/certificates/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId: enrollment.id })
    });
    const data = await res.json();
    if (res.ok) {
      setCertStatus('pending_review');
      setCertMessage('Application submitted! You will be notified once it is reviewed.');
    } else {
      setCertMessage(data.error ?? 'Could not submit application.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="order-2 w-full shrink-0 border-brand-light bg-white lg:order-1 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-r">
        <div className="flex items-center gap-2 border-b border-brand-light p-4">
          <Link href="/student/courses" className="text-ink/50 hover:text-brand"><IconifyIcon icon="lucide:chevron-left" className="h-5 w-5" /></Link>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-ink">{course.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <ProgressRing percent={progress} size={22} strokeWidth={3} label="" />
              <span className="text-xs text-ink/50">{progress}% complete</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-brand-light">
          {modules.map((m, mi) => (
            <div key={m.id} className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Module {mi + 1}: {m.title}</p>
              <div className="mt-2 space-y-1">
                {m.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLessonId(l.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                      activeLessonId === l.id ? 'bg-action/10 text-action' : 'text-ink/70 hover:bg-brand-light'
                    }`}
                  >
                    {watched.has(l.id) ? (
                      <IconifyIcon icon="lucide:check-circle-2" className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <IconifyIcon icon="lucide:circle" className="h-4 w-4 shrink-0 text-ink/30" />
                    )}
                    <span className="line-clamp-1">{l.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {progress >= 100 && (
          <div className="border-t border-brand-light p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gold">
              <IconifyIcon icon="lucide:award" className="h-4 w-4" /> Course complete!
            </div>
            {certStatus === 'not_applied' && (
              <Button size="sm" className="mt-3 w-full" onClick={applyForCertificate}>Apply For Certificate</Button>
            )}
            {certStatus === 'pending_review' && <p className="mt-2 text-xs text-ink/60">Certificate application pending review.</p>}
            {certStatus === 'issued' && (
              <Link href="/student/certificates" className="mt-2 block text-xs font-semibold text-brand hover:underline">
                View your certificate →
              </Link>
            )}
            {certMessage && <p className="mt-2 text-xs text-ink/60">{certMessage}</p>}
          </div>
        )}
      </aside>

      <div className="order-1 flex-1 lg:order-2 lg:h-screen lg:overflow-y-auto">
        {activeLesson ? (
          <div className="mx-auto max-w-4xl p-4 md:p-8">
            <div className="aspect-video w-full overflow-hidden rounded-xl2 bg-black">
              {activeLesson.youtube_video_id ? (
                <iframe
                  key={activeLesson.id}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtube_video_id}?rel=0&modestbranding=1`}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/50">Video coming soon</div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <h1 className="font-display text-lg font-bold text-ink">{activeLesson.title}</h1>
              {watched.has(activeLesson.id) ? (
                <span className="flex items-center gap-1 text-sm font-semibold text-success"><IconifyIcon icon="lucide:check-circle-2" className="h-4 w-4" /> Watched</span>
              ) : (
                <Button size="sm" onClick={markComplete} loading={marking}>Mark as complete</Button>
              )}
            </div>

            {activeLesson.resource_pdf_url && (
              <a
                href={activeLesson.resource_pdf_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-fit items-center gap-2 rounded-full border border-brand-light px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
              >
                <IconifyIcon icon="lucide:file-text" className="h-4 w-4" /> Download lesson resource
              </a>
            )}

            <div className="mt-8 border-t border-brand-light pt-6">
              <div className="flex items-center gap-2 font-display text-base font-bold text-ink">
                <IconifyIcon icon="lucide:message-square" className="h-5 w-5 text-action" /> Questions & discussion
              </div>
              <DiscussionPanel lessonId={activeLesson.id} currentUserId={currentUserId} />
            </div>
          </div>
        ) : (
          <div className="p-8 text-sm text-ink/50">This course has no lessons yet.</div>
        )}
      </div>
    </div>
  );
}
