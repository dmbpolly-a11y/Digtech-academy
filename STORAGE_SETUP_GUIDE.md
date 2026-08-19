# 🗄️ Supabase Storage Setup Guide

## Quick Setup (2 minutes)

### Step 1: Run Storage SQL

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/bibhhrpnubdazxdxoglx/sql/new
2. Open `supabase-storage-setup.sql` in your code editor
3. Copy ALL the SQL
4. Paste in Supabase SQL Editor
5. Click **RUN** ▶️

This creates 5 storage buckets:
- ✅ `course-images` - For course thumbnails and banners
- ✅ `profile-images` - For user avatars
- ✅ `testimonial-images` - For success story photos
- ✅ `certificates` - For PDF certificates
- ✅ `media` - For general uploads

### Step 2: Verify Setup

Go to **Storage** in Supabase sidebar. You should see 5 buckets listed.

### Step 3: Test Upload

Try uploading a test image in any bucket to confirm it works!

---

## What This Enables

### For Tutors:
- ✅ Upload course images from phone/computer
- ✅ Add profile pictures
- ✅ Upload module thumbnails
- ✅ Generate and store certificates

### For Admins:
- ✅ Upload testimonial images
- ✅ Manage all media files
- ✅ Delete inappropriate content
- ✅ Full control over storage

### Security:
- ✅ Public read access (anyone can view)
- ✅ Authenticated upload (must be logged in)
- ✅ Users can delete own files
- ✅ Admins can delete any file

---

## Image Upload Features

### Supported Formats:
- JPG, JPEG
- PNG
- GIF
- WebP

### Limits:
- Max file size: **5MB**
- Auto-resize: Coming soon
- CDN delivery: ✅ Built-in

### Upload Methods:
1. **Computer**: Click upload button
2. **Phone**: Use camera or gallery
3. **Drag & Drop**: Coming soon

---

## Troubleshooting

### Can't upload images?
1. Check you're logged in
2. Verify buckets exist in Storage tab
3. Check browser console for errors
4. Try smaller file size (<2MB)

### Images not showing?
1. Check bucket is set to **public**
2. Verify URL format is correct
3. Check CORS settings in Supabase

### Need to delete old images?
- Tutors: Only own images
- Admins: Any image

---

## Ready to Use!

After running the SQL, the image upload system is ready. Tutors and admins can now upload images throughout the app!

**Next**: Try creating a course with an image! 🚀
