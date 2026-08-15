import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { discussionSchema, replySchema } from '@/lib/validation';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const body = await request.json();

  // Reply to an existing discussion thread
  if (body.discussionId) {
    const parsed = replySchema.safeParse({ body: body.body });
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const { error } = await supabase.from('replies').insert({
      discussion_id: body.discussionId,
      author_id: user.id,
      body: parsed.data.body
    });
    if (error) return NextResponse.json({ error: 'Could not post reply.' }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // New question on a lesson
  const parsed = discussionSchema.safeParse({ question: body.question });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  if (!body.lessonId) return NextResponse.json({ error: 'Missing lessonId.' }, { status: 400 });

  const { data: discussion, error } = await supabase
    .from('discussions')
    .insert({ lesson_id: body.lessonId, student_id: user.id, question: parsed.data.question })
    .select()
    .single();

  if (error || !discussion) return NextResponse.json({ error: 'Could not post question.' }, { status: 500 });

  // Notify the tutor who owns this lesson's course.
  const { data: lessonInfo } = await supabase
    .from('lessons')
    .select('modules(courses(title, tutor_id))')
    .eq('id', body.lessonId)
    .single();

  const courseInfo = (lessonInfo as any)?.modules?.courses;
  if (courseInfo?.tutor_id) {
    const { data: tutorUser } = await supabase.from('users').select('mobile_number, full_name').eq('id', courseInfo.tutor_id).single();
    const { data: studentUser } = await supabase.from('users').select('full_name').eq('id', user.id).single();
    if (tutorUser?.mobile_number) {
      await sendSms({
        userId: courseInfo.tutor_id,
        phoneNumber: tutorUser.mobile_number,
        event: 'tutor_new_question',
        vars: { course: courseInfo.title, student: studentUser?.full_name ?? 'A student' }
      });
    }
  }

  return NextResponse.json({ ok: true, discussion });
}
