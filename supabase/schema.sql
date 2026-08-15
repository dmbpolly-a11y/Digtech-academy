-- =====================================================================
-- DIGTECH ACADEMY — DATABASE SCHEMA
-- Multi-Tenant Online Learning Management System
-- Run this file in the Supabase SQL editor (or `supabase db push`).
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. ENUMS
-- =====================================================================
create type user_role as enum ('admin', 'principal', 'tutor', 'student');
create type course_level as enum ('beginner', 'intermediate', 'advanced');
create type course_status as enum ('draft', 'pending_review', 'published', 'suspended');
create type enrollment_status as enum ('active', 'completed', 'refunded');
create type payment_status as enum ('pending', 'success', 'failed', 'refunded');
create type withdrawal_status as enum ('pending', 'approved', 'paid', 'rejected');
create type withdrawal_method as enum ('mobile_money', 'bank');
create type certificate_status as enum ('not_applied', 'pending_review', 'approved', 'rejected', 'issued');
create type live_application_status as enum ('pending', 'contacted', 'enrolled', 'declined');
create type tutor_verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type notification_channel as enum ('sms', 'in_app', 'email');
create type sms_status as enum ('queued', 'sent', 'failed');

-- =====================================================================
-- 2. USERS & ROLES  (extends supabase auth.users)
-- =====================================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text not null,
  mobile_number text unique,
  email text unique,
  avatar_url text,
  is_active boolean not null default true,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Role detail tables ---------------------------------------------------
create table public.principals (
  user_id uuid primary key references public.users(id) on delete cascade,
  school_name text,
  region text,
  created_at timestamptz not null default now()
);

create table public.tutors (
  user_id uuid primary key references public.users(id) on delete cascade,
  bio text,
  headline text,
  qualifications text,
  national_id_url text,
  profile_photo_url text,
  verification_status tutor_verification_status not null default 'unverified',
  is_activated boolean not null default false,
  activated_by uuid references public.users(id),
  activated_at timestamptz,
  revenue_share_percent numeric(5,2) not null default 70.00, -- tutor keeps 70%
  wallet_balance numeric(14,2) not null default 0,
  total_earned numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.students (
  user_id uuid primary key references public.users(id) on delete cascade,
  date_of_birth date,
  address text,
  enrolled_by_principal uuid references public.users(id), -- if manually enrolled
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 3. COURSES
-- =====================================================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique
);

create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  tutor_id uuid not null references public.tutors(user_id) on delete cascade,
  category_id uuid references public.categories(id),
  title text not null,
  slug text not null unique,
  thumbnail_url text,
  description text,
  course_overview text,
  requirements text[],
  target_audience text,
  duration_hours numeric(6,1),
  fee numeric(14,2) not null default 0,
  is_free boolean not null default false,
  language text not null default 'English',
  level course_level not null default 'beginner',
  status course_status not null default 'draft',
  -- SEO
  seo_title text,
  meta_description text,
  og_image_url text,
  -- stats (denormalised for speed, refreshed by triggers)
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  enrollment_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.courses (status);
create index on public.courses (category_id);
create index on public.courses (tutor_id);

create table public.modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  overview text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  youtube_video_id text, -- privacy-enhanced embed id (youtube-nocookie.com)
  video_duration_seconds integer,
  resource_pdf_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 4. ENROLLMENTS, PAYMENTS, PROGRESS
-- =====================================================================
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status enrollment_status not null default 'active',
  progress_percent numeric(5,2) not null default 0,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (student_id, course_id)
);
create index on public.enrollments (student_id);
create index on public.enrollments (course_id);

create table public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  watched boolean not null default false,
  watched_at timestamptz,
  unique (enrollment_id, lesson_id)
);

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(user_id),
  course_id uuid not null references public.courses(id),
  amount numeric(14,2) not null,
  currency text not null default 'UGX',
  provider text not null default 'pandora',
  provider_reference text,
  status payment_status not null default 'pending',
  tutor_share numeric(14,2),
  platform_share numeric(14,2),
  coupon_code text,
  discount_amount numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);
create index on public.payments (status);
create index on public.payments (student_id);

-- =====================================================================
-- 5. WITHDRAWALS
-- =====================================================================
create table public.withdrawals (
  id uuid primary key default uuid_generate_v4(),
  tutor_id uuid not null references public.tutors(user_id) on delete cascade,
  amount numeric(14,2) not null,
  method withdrawal_method not null,
  -- mobile money fields
  mm_full_name text,
  mm_phone_number text,
  -- bank fields
  bank_name text,
  bank_account_name text,
  bank_account_number text,
  status withdrawal_status not null default 'pending',
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  processed_by uuid references public.users(id),
  expected_by timestamptz generated always as (requested_at + interval '2 days') stored,
  notes text
);
create index on public.withdrawals (tutor_id);
create index on public.withdrawals (status);

-- =====================================================================
-- 6. LIVE ONLINE COURSES
-- =====================================================================
create table public.live_courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  duration text,
  schedule text,
  fee numeric(14,2) not null default 0,
  trainer_id uuid references public.tutors(user_id),
  description text,
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.live_applications (
  id uuid primary key default uuid_generate_v4(),
  live_course_id uuid not null references public.live_courses(id) on delete cascade,
  full_name text not null,
  mobile_number text not null,
  preferred_days text,
  preferred_study_time text,
  status live_application_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 7. DISCUSSIONS (Questions & Replies)
-- =====================================================================
create table public.discussions (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  student_id uuid not null references public.students(user_id) on delete cascade,
  question text not null,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.replies (
  id uuid primary key default uuid_generate_v4(),
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  author_id uuid not null references public.users(id),
  body text not null,
  is_best_answer boolean not null default false,
  mentioned_user_ids uuid[] default '{}',
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 8. REVIEWS, WISHLIST, COUPONS, AFFILIATES
-- =====================================================================
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.students(user_id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (course_id, student_id)
);

create table public.wishlists (
  student_id uuid not null references public.students(user_id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, course_id)
);

create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  course_id uuid references public.courses(id), -- null = sitewide
  created_by uuid not null references public.users(id),
  discount_percent numeric(5,2) not null,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.affiliate_referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid not null references public.users(id),
  referred_user_id uuid references public.users(id),
  referral_code text not null,
  commission_amount numeric(14,2) default 0,
  payment_id uuid references public.payments(id),
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 9. CERTIFICATES
-- =====================================================================
create table public.certificates (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.students(user_id),
  course_id uuid not null references public.courses(id),
  status certificate_status not null default 'not_applied',
  verification_code text not null unique default substr(replace(uuid_generate_v4()::text,'-',''),1,12),
  pdf_url text,
  reviewed_by uuid references public.users(id),
  applied_at timestamptz,
  issued_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.certificates (verification_code);

-- =====================================================================
-- 10. NOTIFICATIONS & SMS LOG
-- =====================================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
create index on public.notifications (user_id, is_read);

create table public.sms_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  phone_number text not null,
  message text not null,
  event_type text not null, -- e.g. 'enrollment', 'payment_success', 'withdrawal_approved'
  status sms_status not null default 'queued',
  provider_response jsonb,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 11. SITE SETTINGS (single-row config editable by admin)
-- =====================================================================
create table public.site_settings (
  id boolean primary key default true check (id),
  academy_name text not null default 'Digtech Academy',
  hero_headline text default 'Learn skills that pay, from tutors you trust.',
  hero_subheadline text default 'Uganda''s multi-tenant academy for live and self-paced courses.',
  contact_email text,
  contact_phone text,
  contact_address text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  linkedin_url text,
  map_embed_url text,
  primary_color text default '#1A4095',
  button_color text default '#28C0F4',
  platform_commission_percent numeric(5,2) not null default 30.00,
  sms_sender_id text default 'DIGTECH',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (true);

create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  position integer not null default 0
);

create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  student_name text not null,
  course_title text,
  quote text not null,
  photo_url text,
  rating smallint default 5,
  position integer default 0
);

-- =====================================================================
-- 12. TRIGGERS — keep denormalised numbers correct
-- =====================================================================
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

create trigger trg_users_updated before update on public.users
  for each row execute function public.touch_updated_at();
create trigger trg_courses_updated before update on public.courses
  for each row execute function public.touch_updated_at();

-- Recompute course rating on review change
create or replace function public.recompute_course_rating() returns trigger as $$
begin
  update public.courses c
  set rating_avg = coalesce((select round(avg(rating)::numeric,2) from public.reviews r where r.course_id = c.id),0),
      rating_count = (select count(*) from public.reviews r where r.course_id = c.id)
  where c.id = coalesce(new.course_id, old.course_id);
  return coalesce(new, old);
end $$ language plpgsql;

create trigger trg_reviews_recompute
  after insert or update or delete on public.reviews
  for each row execute function public.recompute_course_rating();

-- Bump enrollment_count on new enrollment
create or replace function public.bump_enrollment_count() returns trigger as $$
begin
  update public.courses set enrollment_count = enrollment_count + 1 where id = new.course_id;
  return new;
end $$ language plpgsql;

create trigger trg_enrollment_count
  after insert on public.enrollments
  for each row execute function public.bump_enrollment_count();

-- Recompute lesson_progress -> enrollment.progress_percent (Completed Modules ÷ Total Modules × 100)
create or replace function public.recompute_progress() returns trigger as $$
declare
  v_enrollment_id uuid;
  v_total integer;
  v_watched integer;
  v_pct numeric(5,2);
begin
  v_enrollment_id := coalesce(new.enrollment_id, old.enrollment_id);

  select count(*) into v_total
  from public.lessons l
  join public.modules m on m.id = l.module_id
  join public.enrollments e on e.course_id = m.course_id
  where e.id = v_enrollment_id;

  select count(*) into v_watched
  from public.lesson_progress lp
  where lp.enrollment_id = v_enrollment_id and lp.watched = true;

  v_pct := case when v_total = 0 then 0 else round((v_watched::numeric / v_total::numeric) * 100, 2) end;

  update public.enrollments
  set progress_percent = v_pct,
      status = case when v_pct >= 100 then 'completed' else status end,
      completed_at = case when v_pct >= 100 and completed_at is null then now() else completed_at end
  where id = v_enrollment_id;

  return coalesce(new, old);
end $$ language plpgsql;

create trigger trg_lesson_progress_recompute
  after insert or update or delete on public.lesson_progress
  for each row execute function public.recompute_progress();

-- =====================================================================
-- 13. ROW LEVEL SECURITY
-- =====================================================================
alter table public.users enable row level security;
alter table public.principals enable row level security;
alter table public.tutors enable row level security;
alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.payments enable row level security;
alter table public.withdrawals enable row level security;
alter table public.live_courses enable row level security;
alter table public.live_applications enable row level security;
alter table public.discussions enable row level security;
alter table public.replies enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.coupons enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;
alter table public.sms_logs enable row level security;
alter table public.site_settings enable row level security;

-- helper: current user's role
create or replace function public.current_role() returns user_role as $$
  select role from public.users where id = auth.uid();
$$ language sql stable security definer;

-- USERS
create policy "users read own or staff read all" on public.users
  for select using (id = auth.uid() or public.current_role() in ('admin','principal'));
create policy "users update own" on public.users
  for update using (id = auth.uid() or public.current_role() = 'admin');
create policy "users insert self" on public.users
  for insert with check (id = auth.uid());

-- COURSES: public can read published, tutor manages own, admin/principal manage all
create policy "public reads published courses" on public.courses
  for select using (status = 'published' or tutor_id = auth.uid() or public.current_role() in ('admin','principal'));
create policy "tutor manages own courses" on public.courses
  for all using (tutor_id = auth.uid() or public.current_role() = 'admin')
  with check (tutor_id = auth.uid() or public.current_role() = 'admin');

-- MODULES/LESSONS follow parent course visibility
create policy "modules follow course" on public.modules
  for select using (exists (select 1 from public.courses c where c.id = course_id and (c.status='published' or c.tutor_id = auth.uid() or public.current_role() in ('admin','principal'))));
create policy "tutor manages own modules" on public.modules
  for all using (exists (select 1 from public.courses c where c.id = course_id and (c.tutor_id = auth.uid() or public.current_role()='admin')));

create policy "lessons follow course" on public.lessons
  for select using (exists (select 1 from public.modules m join public.courses c on c.id=m.course_id where m.id = module_id and (c.status='published' or c.tutor_id = auth.uid() or public.current_role() in ('admin','principal'))));
create policy "tutor manages own lessons" on public.lessons
  for all using (exists (select 1 from public.modules m join public.courses c on c.id=m.course_id where m.id = module_id and (c.tutor_id = auth.uid() or public.current_role()='admin')));

-- ENROLLMENTS: student sees own; tutor sees for their courses; staff sees all
create policy "enrollment visibility" on public.enrollments
  for select using (
    student_id = auth.uid()
    or exists (select 1 from public.courses c where c.id = course_id and c.tutor_id = auth.uid())
    or public.current_role() in ('admin','principal')
  );
create policy "student creates own enrollment" on public.enrollments
  for insert with check (student_id = auth.uid() or public.current_role() in ('admin','principal'));
create policy "principal updates enrollment" on public.enrollments
  for update using (public.current_role() in ('admin','principal') or student_id = auth.uid());

-- LESSON PROGRESS
create policy "progress owner or staff" on public.lesson_progress
  for all using (
    exists (select 1 from public.enrollments e where e.id = enrollment_id and (e.student_id = auth.uid() or public.current_role() in ('admin','principal')))
  );

-- PAYMENTS
create policy "payments visibility" on public.payments
  for select using (
    student_id = auth.uid()
    or exists (select 1 from public.courses c where c.id = course_id and c.tutor_id = auth.uid())
    or public.current_role() = 'admin'
  );
create policy "payments insert self" on public.payments
  for insert with check (student_id = auth.uid());

-- WITHDRAWALS
create policy "withdrawals visibility" on public.withdrawals
  for select using (tutor_id = auth.uid() or public.current_role() = 'admin');
create policy "tutor requests withdrawal" on public.withdrawals
  for insert with check (tutor_id = auth.uid());
create policy "admin updates withdrawal" on public.withdrawals
  for update using (public.current_role() = 'admin');

-- DISCUSSIONS / REPLIES: public read on published course lessons, authenticated write
create policy "discussions readable" on public.discussions for select using (true);
create policy "students post discussions" on public.discussions
  for insert with check (student_id = auth.uid());
create policy "replies readable" on public.replies for select using (true);
create policy "authenticated post replies" on public.replies
  for insert with check (author_id = auth.uid());

-- REVIEWS
create policy "reviews readable" on public.reviews for select using (true);
create policy "enrolled student reviews" on public.reviews
  for insert with check (
    student_id = auth.uid() and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.course_id = reviews.course_id)
  );

-- WISHLIST
create policy "wishlist owner" on public.wishlists for all using (student_id = auth.uid());

-- CERTIFICATES
create policy "certificate visibility" on public.certificates
  for select using (student_id = auth.uid() or public.current_role() in ('admin','principal') or true); -- public verify page needs read by code
create policy "student applies certificate" on public.certificates
  for update using (student_id = auth.uid() or public.current_role() in ('admin','principal'));

-- NOTIFICATIONS
create policy "notifications owner" on public.notifications for all using (user_id = auth.uid());

-- LIVE COURSES / APPLICATIONS
create policy "live courses public read" on public.live_courses for select using (true);
create policy "live courses staff manage" on public.live_courses for all using (public.current_role() in ('admin','principal'));
create policy "live applications insert public" on public.live_applications for insert with check (true);
create policy "live applications staff read" on public.live_applications for select using (public.current_role() in ('admin','principal'));

-- SITE SETTINGS
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings for update using (public.current_role() = 'admin');

-- SMS LOGS — admin only
create policy "sms logs admin only" on public.sms_logs for select using (public.current_role() = 'admin');

-- =====================================================================
-- 14. SEED DATA (categories + FAQs so the site isn't empty on first run)
-- =====================================================================
insert into public.categories (name, slug) values
  ('Web Development','web-development'),
  ('Digital Marketing','digital-marketing'),
  ('Graphic Design','graphic-design'),
  ('Data & Analytics','data-analytics'),
  ('Business & Entrepreneurship','business-entrepreneurship'),
  ('Languages','languages')
on conflict do nothing;

insert into public.faqs (question, answer, position) values
  ('How do I enrol in a course?', 'Create a free account, open any course, and click Enrol Now. You will be redirected to Pandora Payments to complete your purchase, and access is granted instantly.', 1),
  ('How do tutors get paid?', 'Tutors keep 70% of every course fee. Once your wallet balance is available, request a withdrawal via Mobile Money or bank transfer — processed within 2 working days.', 2),
  ('How do I get my certificate?', 'Once a course reaches 100% completion, click Apply For Certificate on your dashboard. After review, a certificate with a scannable QR verification code is issued.', 3),
  ('Are live classes different from self-paced courses?', 'Yes. Live courses run on a fixed schedule with a trainer. Apply from the Live Courses page and our team will contact you to confirm your seat.', 4)
on conflict do nothing;
