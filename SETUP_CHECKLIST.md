# ✅ Supabase Setup Checklist

Print this and check off each step as you complete it!

---

## 📋 Pre-Setup (Already Done)

- [x] Supabase project created
- [x] Project URL obtained: `https://bibhhrpnubdazxdxoglx.supabase.co`
- [x] Anon key obtained: `sb_publishable_f9u1ZPX4hsMnQOxdu_B5qQ_A-4QWsg_`
- [x] Environment variables configured in `.env.local`
- [x] Supabase client installed (`@supabase/supabase-js`)
- [x] Code integrated with Supabase Auth
- [x] Database schema file created (`supabase-schema.sql`)

---

## 🔧 Setup Steps (YOU MUST DO THESE!)

### Step 1: Create Database Tables

- [ ] Open https://supabase.com/dashboard/project/bibhhrpnubdazxdxoglx
- [ ] Click **SQL Editor** in left sidebar
- [ ] Click **New query** button
- [ ] Open file `supabase-schema.sql` in your code editor
- [ ] Select ALL content (Ctrl+A)
- [ ] Copy (Ctrl+C)
- [ ] Paste into Supabase SQL Editor (Ctrl+V)
- [ ] Click green **RUN** button
- [ ] Wait for "Success. No rows returned" message
- [ ] Verify tables created: Click **Table Editor** → Should see 15 tables

**Tables to verify:**
- [ ] users
- [ ] activity_logs
- [ ] visit_stats
- [ ] application_attempts
- [ ] courses
- [ ] course_modules
- [ ] enrollments
- [ ] fees
- [ ] exams
- [ ] exam_submissions
- [ ] certificates
- [ ] media_links
- [ ] website_content
- [ ] principal_comments
- [ ] student_registrations

---

### Step 2: Create Test Users

Go to **Authentication → Users** in Supabase dashboard:

#### Create Admin User
- [ ] Click **Add user** button
- [ ] Enter email: `admin@digtechacademy.ug`
- [ ] Enter password: `Digtech@2024`
- [ ] Click **Create user**
- [ ] **IMPORTANT:** Copy the UUID shown in the user list
- [ ] Write UUID here: `_______________________________________`

#### Create Principal User
- [ ] Click **Add user** button
- [ ] Enter email: `principal@digtechacademy.ug`
- [ ] Enter password: `Principal@2024`
- [ ] Click **Create user**
- [ ] Copy the UUID
- [ ] Write UUID here: `_______________________________________`

#### Create Tutor User
- [ ] Click **Add user** button
- [ ] Enter email: `tutor@digtechacademy.ug`
- [ ] Enter password: `Tutor@2024`
- [ ] Click **Create user**
- [ ] Copy the UUID
- [ ] Write UUID here: `_______________________________________`

#### Create Student User
- [ ] Click **Add user** button
- [ ] Enter email: `student@digtechacademy.ug`
- [ ] Enter password: `Student@2024`
- [ ] Click **Create user**
- [ ] Copy the UUID
- [ ] Write UUID here: `_______________________________________`

---

### Step 3: Link Users to Roles

- [ ] Go back to **SQL Editor**
- [ ] Click **New query**
- [ ] Copy this SQL (replace `<uuid-xxx>` with actual UUIDs from Step 2):

```sql
INSERT INTO users (id, email, full_name, role, status) VALUES
  ('<admin-uuid>', 'admin@digtechacademy.ug', 'Super Admin', 'admin', 'active'),
  ('<principal-uuid>', 'principal@digtechacademy.ug', 'Principal User', 'principal', 'active'),
  ('<tutor-uuid>', 'tutor@digtechacademy.ug', 'Grace Nakato', 'tutor', 'active'),
  ('<student-uuid>', 'student@digtechacademy.ug', 'John Doe', 'student', 'active');
```

- [ ] Paste into SQL Editor
- [ ] Replace all 4 UUIDs with the ones you copied in Step 2
- [ ] Click **RUN**
- [ ] Verify success: Go to **Table Editor → users** → Should see 4 users

---

### Step 4: Verify Database Setup

- [ ] Open **Table Editor**
- [ ] Click **users** table
- [ ] Verify 4 rows exist
- [ ] Check each user has:
  - [ ] Correct email
  - [ ] Correct role (lowercase: admin, tutor, student, principal)
  - [ ] Status = 'active'
  - [ ] UUID matches Auth user UUID

---

### Step 5: Restart Development Server

- [ ] Stop current server (press `Ctrl+C` in terminal)
- [ ] Run: `npm run dev`
- [ ] Wait for "Local: http://localhost:8443"
- [ ] Server started successfully

---

### Step 6: Test Admin Login

- [ ] Open browser: http://localhost:8443
- [ ] Click **Sign In** button
- [ ] Account type selector appears
- [ ] Click **admin** tile
- [ ] Enter email: `admin@digtechacademy.ug`
- [ ] Enter password: `Digtech@2024`
- [ ] Click **Sign In** button
- [ ] Success message appears
- [ ] Redirected to Admin Dashboard
- [ ] Admin name shown in header

---

### Step 7: Test Session Persistence

- [ ] While logged in as admin
- [ ] Press `F5` to refresh page
- [ ] Page reloads
- [ ] Still logged in (no redirect to login)
- [ ] Admin dashboard still showing
- [ ] ✅ Session persistence works!

---

### Step 8: Test Logout

- [ ] Click **Logout** button
- [ ] Redirected to home page
- [ ] "Sign In" button now showing
- [ ] Not logged in anymore

---

### Step 9: Test Other Roles

#### Test Tutor Login
- [ ] Click **Sign In**
- [ ] Select **tutor** account type
- [ ] Email: `tutor@digtechacademy.ug`
- [ ] Password: `Tutor@2024`
- [ ] Click **Sign In**
- [ ] Redirected to Tutor Dashboard
- [ ] Logout

#### Test Student Login
- [ ] Click **Sign In**
- [ ] Select **student** account type
- [ ] Email: `student@digtechacademy.ug`
- [ ] Password: `Student@2024`
- [ ] Click **Sign In**
- [ ] Redirected to Student Dashboard
- [ ] Logout

#### Test Principal Login
- [ ] Click **Sign In**
- [ ] Select **principal** account type
- [ ] Email: `principal@digtechacademy.ug`
- [ ] Password: `Principal@2024`
- [ ] Click **Sign In**
- [ ] Redirected to Principal Dashboard
- [ ] Logout

---

### Step 10: Verify Supabase Logging

#### Check Activity Logs
- [ ] Open Supabase dashboard
- [ ] Go to **Table Editor**
- [ ] Click **activity_logs** table
- [ ] Should see login events
- [ ] Each login has:
  - [ ] user_id (UUID)
  - [ ] action ('login')
  - [ ] created_at (timestamp)
  - [ ] details (JSON with role)

#### Check Users Table
- [ ] Go to **Table Editor → users**
- [ ] Click admin user row
- [ ] Check `last_login` field
- [ ] Should show recent timestamp
- [ ] Matches when you logged in

---

### Step 11: Test Error Handling

#### Test Wrong Password
- [ ] Try to login with correct email but wrong password
- [ ] Error message appears: "Invalid email or password"
- [ ] ✅ Error handling works

#### Test Wrong Role
- [ ] Select **admin** account type
- [ ] Enter tutor credentials (tutor@digtechacademy.ug)
- [ ] Error message: "This email is registered as tutor..."
- [ ] ✅ Role validation works

#### Test Invalid Email
- [ ] Enter: `notanemail`
- [ ] Error message: "Please enter a valid email address"
- [ ] ✅ Email validation works

---

### Step 12: Test Registration

- [ ] Click **Create Account** button
- [ ] Fill in all fields:
  - [ ] First Name: `Test`
  - [ ] Last Name: `User`
  - [ ] Email: `test@example.com`
  - [ ] Phone: `0700123456`
  - [ ] Password: `Test@1234`
  - [ ] Confirm: `Test@1234`
  - [ ] Select role: **student**
- [ ] Click **Create Account**
- [ ] Success message appears
- [ ] Redirected to Student Dashboard
- [ ] Logout

#### Verify Registration in Supabase
- [ ] Go to **Authentication → Users**
- [ ] See new user: `test@example.com`
- [ ] Go to **Table Editor → users**
- [ ] See profile for test user
- [ ] Has correct role (student)
- [ ] ✅ Registration works!

---

### Step 13: Test Browser Console

- [ ] Press `F12` to open DevTools
- [ ] Go to **Console** tab
- [ ] No red errors showing
- [ ] Test login again
- [ ] Check for any Supabase errors
- [ ] Should be clean (no errors)

---

## 🎉 Final Verification

- [ ] All 4 roles can login
- [ ] Sessions persist on refresh
- [ ] Logout works properly
- [ ] Registration creates real accounts
- [ ] Activity logs recorded in Supabase
- [ ] Last login timestamps update
- [ ] Error messages show correctly
- [ ] Browser console has no errors
- [ ] Build succeeds: `npm run build`

---

## 📊 Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Tables Created | 15 | [ ] |
| Test Users Created | 4 | [ ] |
| Roles Linked | 4 | [ ] |
| Login Success | 100% | [ ] |
| Session Persistence | ✅ | [ ] |
| Activity Logging | ✅ | [ ] |
| Error Handling | ✅ | [ ] |
| Build Success | ✅ | [ ] |

---

## 🐛 If Something Fails

### Database errors?
- [ ] Re-run `supabase-schema.sql`
- [ ] Check all 15 tables exist
- [ ] Check Table Editor for errors

### Login fails?
- [ ] Verify user exists in Authentication
- [ ] Check UUID in users table matches Auth
- [ ] Check role is lowercase
- [ ] Check browser console for errors

### Environment variables?
- [ ] Check `.env.local` has `VITE_` prefix
- [ ] Restart dev server
- [ ] Clear browser cache

### Still stuck?
- [ ] Read `SUPABASE_INTEGRATION_COMPLETE.md`
- [ ] Read `SUPABASE_SETUP_GUIDE.md`
- [ ] Check Supabase logs: Dashboard → Logs
- [ ] Check browser Network tab

---

## 📝 Notes Section

Use this space to write down any UUIDs, errors, or observations:

```
Admin UUID: _________________________________

Principal UUID: _________________________________

Tutor UUID: _________________________________

Student UUID: _________________________________

Errors encountered:




Solutions applied:




```

---

## ✅ COMPLETION

Once all checkboxes are marked:

**🎉 CONGRATULATIONS! 🎉**

Your DigiTech Academy is now fully integrated with Supabase!

- ✅ Real authentication
- ✅ Persistent sessions
- ✅ Activity logging
- ✅ Role-based access
- ✅ User registration
- ✅ Production-ready database

**Next steps:**
1. Connect dashboards to display real data
2. Implement course creation (tutors)
3. Add visit tracking (homepage)
4. Integrate PesaPal payments
5. Deploy to production

**You're ready to build! 🚀**

---

Completed by: ___________________

Date: ___________________

Time taken: ___________________

---

**Keep this checklist for reference!**
