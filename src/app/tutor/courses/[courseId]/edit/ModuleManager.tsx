'use client';

import { useState } from 'react';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { createClient } from '@/lib/supabase/client';
import { moduleSchema, lessonSchema, extractYoutubeId } from '@/lib/validation';
import { Button } from '@/components/Button';
import { FileUpload } from '@/components/FileUpload';

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
  position: number;
  lessons: LessonRow[];
}

export function ModuleManager({ courseId, initialModules }: { courseId: string; initialModules: ModuleRow[] }) {
  const [modules, setModules] = useState<ModuleRow[]>(initialModules);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(initialModules.map((m) => m.id)));

  const supabase = createClient();

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function addModule() {
    const parsed = moduleSchema.safeParse({ title: newModuleTitle });
    if (!parsed.success) {
      setModuleError(parsed.error.issues[0].message);
      return;
    }
    setModuleError(null);

    const { data, error } = await supabase
      .from('modules')
      .insert({ course_id: courseId, title: parsed.data.title, position: modules.length })
      .select()
      .single();

    if (!error && data) {
      setModules((m) => [...m, { ...data, lessons: [] }]);
      setNewModuleTitle('');
      setExpanded((prev) => new Set(prev).add(data.id));
    }
  }

  async function deleteModule(moduleId: string) {
    await supabase.from('modules').delete().eq('id', moduleId);
    setModules((m) => m.filter((x) => x.id !== moduleId));
  }

  async function addLesson(moduleId: string, title: string, youtubeUrl: string) {
    const parsed = lessonSchema.safeParse({ title, youtubeUrl });
    if (!parsed.success) return parsed.error.issues[0].message;

    const module = modules.find((m) => m.id === moduleId)!;
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        title: parsed.data.title,
        youtube_video_id: extractYoutubeId(parsed.data.youtubeUrl),
        position: module.lessons.length
      })
      .select()
      .single();

    if (error || !data) return 'Could not add lesson.';

    setModules((mods) => mods.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m)));
    return null;
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    await supabase.from('lessons').delete().eq('id', lessonId);
    setModules((mods) => mods.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m)));
  }

  async function attachResource(lessonId: string, moduleId: string, url: string) {
    await supabase.from('lessons').update({ resource_pdf_url: url }).eq('id', lessonId);
    setModules((mods) =>
      mods.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, resource_pdf_url: url } : l)) } : m
      )
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((m, i) => (
        <div key={m.id} className="rounded-xl2 border border-brand-light">
          <div className="flex items-center gap-2 p-4">
            <IconifyIcon icon="lucide:grip-vertical" className="h-4 w-4 text-ink/30" />
            <button onClick={() => toggle(m.id)} className="flex flex-1 items-center justify-between text-left">
              <span className="font-semibold text-ink">Module {i + 1}: {m.title}</span>
              {expanded.has(m.id) ? <IconifyIcon icon="lucide:chevron-up" className="h-4 w-4 text-ink/40" /> : <IconifyIcon icon="lucide:chevron-down" className="h-4 w-4 text-ink/40" />}
            </button>
            <button onClick={() => deleteModule(m.id)} aria-label="Delete module">
              <IconifyIcon icon="lucide:trash-2" className="h-4 w-4 text-red-400 hover:text-red-600" />
            </button>
          </div>

          {expanded.has(m.id) && (
            <div className="space-y-3 border-t border-brand-light p-4">
              {m.lessons.map((l) => (
                <LessonRowItem key={l.id} lesson={l} onDelete={() => deleteLesson(m.id, l.id)} onAttachResource={(url) => attachResource(l.id, m.id, url)} />
              ))}
              <NewLessonForm onAdd={(title, url) => addLesson(m.id, title, url)} />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          placeholder="New module title, e.g. Getting Started"
          className="flex-1 rounded-xl border border-brand-light px-3 py-2 text-sm outline-none focus:border-action"
        />
        <Button onClick={addModule} size="sm"><IconifyIcon icon="lucide:plus" className="h-4 w-4" /> Add module</Button>
      </div>
      {moduleError && <p className="text-xs text-red-600">{moduleError}</p>}
    </div>
  );
}

function LessonRowItem({ lesson, onDelete, onAttachResource }: { lesson: LessonRow; onDelete: () => void; onAttachResource: (url: string) => void }) {
  return (
    <div className="rounded-xl border border-brand-light/70 bg-brand-light/20 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-ink">
          <IconifyIcon icon="lucide:youtube" className="h-4 w-4 text-red-500" />
          {lesson.title}
        </div>
        <button onClick={onDelete} aria-label="Delete lesson"><IconifyIcon icon="lucide:trash-2" className="h-3.5 w-3.5 text-red-400 hover:text-red-600" /></button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-ink/50">
        <IconifyIcon icon="lucide:file-text" className="h-3.5 w-3.5" />
        {lesson.resource_pdf_url ? 'Resource attached' : 'No resource yet'}
      </div>
      <div className="mt-2">
        <FileUpload bucket="course-resources" pathPrefix="lesson-resources" accept="application/pdf" currentUrl={lesson.resource_pdf_url} onUploaded={onAttachResource} label="Attach PDF resource" />
      </div>
    </div>
  );
}

function NewLessonForm({ onAdd }: { onAdd: (title: string, youtubeUrl: string) => Promise<string | null> }) {
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    const err = await onAdd(title, youtubeUrl);
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      setTitle('');
      setYoutubeUrl('');
      setError(null);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-brand-light p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" className="rounded-lg border border-brand-light px-3 py-2 text-sm outline-none focus:border-action" />
        <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="YouTube URL or video ID" className="rounded-lg border border-brand-light px-3 py-2 text-sm outline-none focus:border-action" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <Button size="sm" variant="ghost" className="mt-2" onClick={submit} loading={saving}>
        <IconifyIcon icon="lucide:plus" className="h-3.5 w-3.5" /> Add lesson
      </Button>
    </div>
  );
}
