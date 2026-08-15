// Mirrors supabase/schema.sql — keep in sync when the schema changes.

export type UserRole = 'admin' | 'principal' | 'tutor' | 'student';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'suspended';
export type EnrollmentStatus = 'active' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';
export type WithdrawalStatus = 'pending' | 'approved' | 'paid' | 'rejected';
export type WithdrawalMethod = 'mobile_money' | 'bank';
export type CertificateStatus = 'not_applied' | 'pending_review' | 'approved' | 'rejected' | 'issued';
export type LiveApplicationStatus = 'pending' | 'contacted' | 'enrolled' | 'declined';
export type TutorVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface AppUser {
  id: string;
  role: UserRole;
  full_name: string;
  mobile_number: string | null;
  email: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_suspended: boolean;
  created_at: string;
}

export interface Tutor {
  user_id: string;
  bio: string | null;
  headline: string | null;
  qualifications: string | null;
  verification_status: TutorVerificationStatus;
  is_activated: boolean;
  revenue_share_percent: number;
  wallet_balance: number;
  total_earned: number;
}

export interface Course {
  id: string;
  tutor_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  description: string | null;
  course_overview: string | null;
  requirements: string[] | null;
  target_audience: string | null;
  duration_hours: number | null;
  fee: number;
  is_free: boolean;
  language: string;
  level: CourseLevel;
  status: CourseStatus;
  seo_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  rating_avg: number;
  rating_count: number;
  enrollment_count: number;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  overview: string | null;
  position: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  youtube_video_id: string | null;
  video_duration_seconds: number | null;
  resource_pdf_url: string | null;
  position: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
}

export interface Payment {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  provider: string;
  provider_reference: string | null;
  status: PaymentStatus;
  tutor_share: number | null;
  platform_share: number | null;
  coupon_code: string | null;
  discount_amount: number;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  tutor_id: string;
  amount: number;
  method: WithdrawalMethod;
  mm_full_name: string | null;
  mm_phone_number: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  status: WithdrawalStatus;
  requested_at: string;
  expected_by: string;
}

export interface Certificate {
  id: string;
  enrollment_id: string;
  student_id: string;
  course_id: string;
  status: CertificateStatus;
  verification_code: string;
  pdf_url: string | null;
  applied_at: string | null;
  issued_at: string | null;
}

export interface LiveCourse {
  id: string;
  title: string;
  duration: string | null;
  schedule: string | null;
  fee: number;
  trainer_id: string | null;
  description: string | null;
  is_open: boolean;
}

export interface LiveApplication {
  id: string;
  live_course_id: string;
  full_name: string;
  mobile_number: string;
  preferred_days: string | null;
  preferred_study_time: string | null;
  status: LiveApplicationStatus;
}

export interface Discussion {
  id: string;
  lesson_id: string;
  student_id: string;
  question: string;
  is_resolved: boolean;
  created_at: string;
}

export interface Reply {
  id: string;
  discussion_id: string;
  author_id: string;
  body: string;
  is_best_answer: boolean;
  created_at: string;
}

export interface SiteSettings {
  academy_name: string;
  hero_headline: string;
  hero_subheadline: string;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  map_embed_url: string | null;
  primary_color: string;
  button_color: string;
  platform_commission_percent: number;
  sms_sender_id: string;
}
