# Supabase Setup Guide for DigiTech Academy

## ✅ Step 1: Database Schema Setup

1. Go to your Supabase project: https://supabase.com/dashboard/project/bibhhrpnubdazxdxoglx
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `supabase-schema.sql` in this project
5. Copy ALL the SQL code and paste it into the Supabase SQL editor
6. Click **Run** to execute the schema
7. Wait for "Success. No rows returned" message

This creates 15 tables:
- ✅ users (extended auth)
- ✅ activity_logs
- ✅ visit_stats
- ✅ application_attempts
- ✅ courses
- ✅ course_modules
- ✅ enrollments
- ✅ fees
- ✅ exams
- ✅ exam_submissions
- ✅ certificates
- ✅ media_links
- ✅ website_content
- ✅ principal_comments
- ✅ student_registrations

---

## ✅ Step 2: Create Test Users

Go to **Authentication → Users** in Supabase dashboard and create these users:

### 1. Admin (Super Admin)
- Email: `admin@digtechacademy.ug`
- Password: `Digtech@2024`
- **After creation, copy the UUID!**

### 2. Principal
- Email: `principal@digtechacademy.ug`
- Password: `Principal@2024`
- **Copy UUID**

### 3. Tutor
- Email: `tutor@digtechacademy.ug`
- Password: `Tutor@2024`
- **Copy UUID**

### 4. Student
- Email: `student@digtechacademy.ug`
- Password: `Student@2024`
- **Copy UUID**

---

## ✅ Step 3: Link Auth Users to Roles

After creating users, go back to **SQL Editor** and run this (replace UUIDs with actual ones from step 2):

```sql
-- Insert user records with roles
-- REPLACE the '<uuid-xxx>' with actual UUIDs from Authentication panel

INSERT INTO users (id, email, full_name, role, status) VALUES
  ('<uuid-admin>', 'admin@digtechacademy.ug', 'Super Admin', 'admin', 'active'),
  ('<uuid-principal>', 'principal@digtechacademy.ug', 'Principal User', 'principal', 'active'),
  ('<uuid-tutor>', 'tutor@digtechacademy.ug', 'Grace Nakato', 'tutor', 'active'),
  ('<uuid-student>', 'student@digtechacademy.ug', 'John Doe', 'student', 'active');
```

**Example with real UUIDs:**
```sql
INSERT INTO users (id, email, full_name, role, status) VALUES
  ('a1b2c3d4-1234-5678-90ab-cdef12345678', 'admin@digtechacademy.ug', 'Super Admin', 'admin', 'active'),
  ('b2c3d4e5-2345-6789-01bc-def123456789', 'principal@digtechacademy.ug', 'Principal User', 'principal', 'active'),
  ('c3d4e5f6-3456-7890-12cd-ef1234567890', 'tutor@digtechacademy.ug', 'Grace Nakato', 'tutor', 'active'),
  ('d4e5f6a7-4567-8901-23de-f12345678901', 'student@digtechacademy.ug', 'John Doe', 'student', 'active');
```

---

## ✅ Step 4: Configure RLS Policies (Optional Enhancement)

The schema already includes basic RLS policies, but you can customize them:

1. Go to **Authentication → Policies**
2. Select each table
3. Review and modify policies as needed

Current policies:
- ✅ Public can view published courses
- ✅ Users can view their own data
- ✅ Admins have full access
- ✅ Tutors manage their courses
- ✅ Students view their enrollments

---

## ✅ Step 5: Test the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:8443

3. Try logging in with test accounts:
   - Admin: admin@digtechacademy.ug / Digtech@2024
   - Tutor: tutor@digtechacademy.ug / Tutor@2024
   - Student: student@digtechacademy.ug / Student@2024
   - Principal: principal@digtechacademy.ug / Principal@2024

---

## ✅ Step 6: Verify Data Persistence

After login, check Supabase dashboard:

1. **Activity Logs**: Go to Table Editor → activity_logs
   - Should show login events

2. **Visit Stats**: Go to visit_stats
   - Should track page visits

3. **Users**: Check users table
   - Should show last_login timestamps

---

## 🔧 Troubleshooting

### Issue: "Invalid API key"
**Fix**: Check `.env.local` has correct variables:
```
VITE_SUPABASE_URL=https://bibhhrpnubdazxdxoglx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_f9u1ZPX4hsMnQOxdu_B5qQ_A-4QWsg_
```

### Issue: "relation 'users' does not exist"
**Fix**: Run the `supabase-schema.sql` in SQL Editor again

### Issue: "new row violates row-level security policy"
**Fix**: Temporarily disable RLS during testing:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Issue: User can't login
**Fix**: 
1. Check user exists in Authentication → Users
2. Verify user record in users table has matching UUID
3. Check role is correct ('admin', 'tutor', 'student', 'principal')

---

## 📊 Database Structure Overview

### User Management
- **users**: Core user data with roles
- **activity_logs**: Track all user actions
- **student_registrations**: Course registration forms

### Course System
- **courses**: Main courses
- **course_modules**: Sub-courses/modules
- **enrollments**: Student-course relationships
- **fees**: Fee management
- **exams**: Assessment system
- **exam_submissions**: Student exam results
- **certificates**: Course completion certificates

### Analytics
- **visit_stats**: Website traffic tracking
- **application_attempts**: Registration funnel tracking

### Content Management
- **media_links**: Zoom/YouTube/Meet links
- **website_content**: Editable site content
- **principal_comments**: Principal oversight

---

## 🚀 Next Steps

After completing setup:

1. ✅ Test all 4 user role logins
2. ✅ Create sample courses as tutor
3. ✅ Enroll students in courses
4. ✅ Test admin dashboard features
5. ✅ Test principal comment system
6. ✅ Configure payment gateway (Pesapal)
7. ✅ Deploy to production

---

## 🔐 Security Notes

- Never commit `.env.local` to git
- Service role key should NEVER be in frontend code
- Anon key is safe for frontend (protected by RLS)
- Always use RLS policies in production
- Validate user roles on sensitive operations

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs: Dashboard → Logs
3. Verify environment variables are loaded: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. Test Supabase connection directly in browser console:
   ```javascript
   import { supabase } from './src/lib/supabase'
   await supabase.auth.getSession()
   ```
