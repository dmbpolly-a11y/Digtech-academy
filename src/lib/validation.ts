import { z } from 'zod';

// Uganda mobile numbers: 07xxxxxxxx or +2567xxxxxxxx
const ugandaPhoneRegex = /^(?:\+256|0)7\d{8}$/;

export const phoneSchema = z
  .string()
  .trim()
  .regex(ugandaPhoneRegex, 'Enter a valid Uganda mobile number, e.g. 0771234567');

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Full name must be at least 3 characters'),
    email: z.string().trim().email('Enter a valid email address'),
    mobileNumber: phoneSchema,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['student', 'tutor'], { errorMap: () => ({ message: 'Choose a role' }) })
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const courseSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(120),
  categoryId: z.string().uuid('Choose a category'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  courseOverview: z.string().trim().min(20, 'Overview must be at least 20 characters'),
  requirements: z.array(z.string().trim().min(1)).default([]),
  targetAudience: z.string().trim().min(5, 'Describe who this course is for'),
  durationHours: z.number({ invalid_type_error: 'Duration is required' }).positive('Duration must be greater than 0'),
  fee: z.number({ invalid_type_error: 'Fee is required' }).min(0, 'Fee cannot be negative'),
  isFree: z.boolean().default(false),
  language: z.string().trim().min(2).default('English'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  seoTitle: z.string().trim().max(70, 'Keep SEO titles under 70 characters').optional(),
  metaDescription: z.string().trim().max(160, 'Keep meta descriptions under 160 characters').optional()
});

export const moduleSchema = z.object({
  title: z.string().trim().min(3, 'Module title is required'),
  overview: z.string().trim().min(10, 'Give a short overview of this module').optional()
});

export const lessonSchema = z.object({
  title: z.string().trim().min(3, 'Lesson title is required'),
  youtubeUrl: z
    .string()
    .trim()
    .refine((v) => extractYoutubeId(v) !== null, 'Enter a valid YouTube URL or video ID')
});

export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  ];
  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return match[1];
  }
  return null;
}

export const withdrawalSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('mobile_money'),
    amount: z.number().positive('Enter an amount greater than 0'),
    mmFullName: z.string().trim().min(3, 'Full name is required'),
    mmPhoneNumber: phoneSchema
  }),
  z.object({
    method: z.literal('bank'),
    amount: z.number().positive('Enter an amount greater than 0'),
    bankName: z.string().trim().min(2, 'Bank name is required'),
    bankAccountName: z.string().trim().min(2, 'Account name is required'),
    bankAccountNumber: z.string().trim().min(5, 'Enter a valid account number')
  })
]);

export const liveApplicationSchema = z.object({
  fullName: z.string().trim().min(3, 'Full name is required'),
  mobileNumber: phoneSchema,
  preferredDays: z.string().trim().min(1, 'Select your preferred days'),
  preferredStudyTime: z.string().trim().min(1, 'Select a preferred study time')
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject is required'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters')
});

export const discussionSchema = z.object({
  question: z.string().trim().min(5, 'Question must be at least 5 characters').max(2000)
});

export const replySchema = z.object({
  body: z.string().trim().min(1, 'Reply cannot be empty').max(2000)
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional()
});

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers and dashes only'),
  discountPercent: z.number().min(1).max(100),
  courseId: z.string().uuid().nullable(),
  maxUses: z.number().int().positive().nullable(),
  expiresAt: z.string().nullable()
});

export const settingsSchema = z.object({
  academyName: z.string().trim().min(2, 'Academy name is required'),
  heroHeadline: z.string().trim().min(5, 'Headline is too short'),
  heroSubheadline: z.string().trim().min(5, 'Subheadline is too short'),
  contactEmail: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().trim().optional(),
  contactAddress: z.string().trim().optional(),
  facebookUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  instagramUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  mapEmbedUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  platformCommissionPercent: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100'),
  smsSenderId: z.string().trim().min(1, 'SMS sender ID is required')
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(3, 'Full name must be at least 3 characters'),
  mobileNumber: phoneSchema,
  newPassword: z.union([z.literal(''), z.string().min(8, 'New password must be at least 8 characters')])
});

export const createPrincipalSchema = z.object({
  fullName: z.string().trim().min(3, 'Full name is required'),
  email: z.string().trim().email('Enter a valid email'),
  mobileNumber: phoneSchema,
  schoolName: z.string().trim().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export function formatCurrency(amount: number, currency = 'UGX') {
  return new Intl.NumberFormat('en-UG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
