-- Supabase Storage Setup for DigiTech Academy
-- Run this in Supabase SQL Editor after running supabase-schema.sql

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- 1. Course Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Profile Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Testimonial Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Certificate PDFs Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 5. General Media Bucket (for misc uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Anyone can view images in public buckets
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('course-images', 'profile-images', 'testimonial-images', 'certificates', 'media'));

-- Policy: Authenticated users can upload to course-images
CREATE POLICY "Authenticated users can upload course images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can upload to profile-images
CREATE POLICY "Authenticated users can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can upload to testimonial-images
CREATE POLICY "Authenticated users can upload testimonial images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'testimonial-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Users can update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE USING (
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Admins can delete any file
CREATE POLICY "Admins can delete any file" ON storage.objects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check buckets were created
-- SELECT * FROM storage.buckets;

-- Check policies are active
-- SELECT * FROM pg_policies WHERE tablename = 'objects';
