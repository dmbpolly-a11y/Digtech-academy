# 🔐 Comprehensive Admin & Principal System Specification

## ✅ Unified Login System - COMPLETED

### Single Login Form with Role Dropdown
- **Account Types Available:**
  - 👨‍🎓 Student
  - 👨‍🏫 Tutor
  - ⚡ Admin (Super Admin)
  - 🎓 Principal

### Login Credentials

**Super Admin:**
- Email: `admin@digtechacademy.ug`
- Password: `Digtech@2024`
- Role: Super Administrator (Full System Control)

**Principal:**
- Email: `principal@digtechacademy.ug`
- Password: `Principal@2024`
- Role: School Principal (View & Comment)

**Tutor:**
- Email: `tutor@digtechacademy.ug`
- Password: `Tutor@2024`

**Student:**
- Email: `student@digtechacademy.ug`
- Password: `Student@2024`

---

## 🔥 SUPER ADMIN (Admin) - Complete Features List

### 1. User Management System

#### Manage All Users
- ✅ View all users (Students, Tutors, Principals)
- ✅ Approve new registrations
- ✅ Edit user accounts
- ✅ Reset user passwords
- ✅ Delete user accounts
- ✅ Pause/Suspend accounts
- ✅ Reactivate accounts
- ✅ View user activity logs

#### User Actions:
```typescript
interface UserManagement {
  actions: {
    approve: (userId: number) => void
    edit: (userId: number, data: UserData) => void
    resetPassword: (userId: number) => void
    delete: (userId: number) => void
    pause: (userId: number) => void
    reactivate: (userId: number) => void
    viewLogs: (userId: number) => ActivityLog[]
  }
}
```

### 2. Tutor Management
- ✅ View all tutors
- ✅ Approve tutor applications
- ✅ Verify tutor credentials
- ✅ Assign courses to tutors
- ✅ Monitor tutor performance
- ✅ Suspend/Remove tutors
- ✅ View tutor earnings
- ✅ Manage tutor permissions

### 3. Student Management
- ✅ View all students
- ✅ Approve student registrations
- ✅ Edit student information
- ✅ Transfer students between courses
- ✅ Refund student payments
- ✅ View student progress
- ✅ Export student data

### 4. Visit Statistics & Analytics

#### Website Visitors Tracking
- ✅ Total unique visitors
- ✅ Page views per page
- ✅ Visit duration
- ✅ Geographic location
- ✅ Device breakdown (Mobile/Desktop/Tablet)
- ✅ Browser statistics
- ✅ Traffic sources (Direct, Social, Search, Referral)
- ✅ Daily/Weekly/Monthly trends

#### User Behavior Tracking
- ✅ Who clicked on the website
- ✅ Who visited specific pages
- ✅ Who attempted to apply for courses
- ✅ Application abandonment rate
- ✅ Conversion funnel analysis
- ✅ Time spent on each page
- ✅ Click heatmaps

**Analytics Dashboard:**
```typescript
interface VisitStats {
  totalVisits: number
  uniqueVisitors: number
  pageViews: Record<string, number>
  registeredUsers: number
  applicationAttempts: number
  completedApplications: number
  conversionRate: number
  visitsByDate: Record<string, number>
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  topPages: Array<{
    page: string
    views: number
    avgDuration: number
  }>
}
```

### 5. Registered Users Management
- ✅ View all registered users
- ✅ Filter by registration date
- ✅ Filter by status (Active/Pending/Suspended)
- ✅ Export user list to CSV
- ✅ Send bulk emails
- ✅ View registration source
- ✅ Incomplete registrations tracking

### 6. Application Tracking
- ✅ View who attempted to apply
- ✅ Track incomplete applications
- ✅ Application completion rate
- ✅ Follow-up automation
- ✅ Application funnel visualization
- ✅ Abandonment reasons tracking

### 7. Media Links Management
- ✅ Add/Edit/Delete Google Meet links
- ✅ Add/Edit/Delete Zoom links
- ✅ Add/Edit/Delete YouTube links
- ✅ Add/Edit/Delete Facebook Live links
- ✅ Add/Edit/Delete Instagram Live links
- ✅ Add/Edit/Delete TikTok Live links
- ✅ Schedule link availability
- ✅ Set link expiry
- ✅ Track link usage
- ✅ View link analytics

**Media Link Structure:**
```typescript
interface MediaLink {
  id: number
  platform: 'google-meet' | 'zoom' | 'youtube' | 'facebook' | 'instagram' | 'tiktok'
  url: string
  title: string
  description: string
  courseId?: number
  scheduledDate?: string
  expiryDate?: string
  isActive: boolean
  clickCount: number
  createdBy: string
  createdAt: string
}
```

### 8. Website Content Management (CMS)
- ✅ Edit homepage content
- ✅ Update hero section
- ✅ Manage course listings
- ✅ Edit About page
- ✅ Edit Contact information
- ✅ Update FAQ content
- ✅ Manage testimonials
- ✅ Edit footer content
- ✅ Update images
- ✅ Change colors/themes
- ✅ Manage navigation menu

**Content Editing:**
```typescript
interface ContentManagement {
  homepage: {
    heroTitle: string
    heroSubtitle: string
    heroImage: string
    featuredCourses: number[]
  }
  about: {
    mission: string
    vision: string
    story: string
    team: TeamMember[]
  }
  contact: {
    email: string
    phone: string
    address: string
    mapLink: string
    socialLinks: SocialLinks
  }
}
```

### 9. Delete, Update, Edit Controls
- ✅ Delete any content
- ✅ Update any record
- ✅ Edit any user account
- ✅ Modify course content
- ✅ Change pricing
- ✅ Update images
- ✅ Edit text content
- ✅ Manage permissions
- ✅ Configure settings

### 10. Financial Management
- ✅ View all transactions
- ✅ Payment history
- ✅ Refund management
- ✅ Revenue reports
- ✅ Tutor payout management
- ✅ Commission settings
- ✅ Financial analytics
- ✅ Export financial reports

---

## 🎓 PRINCIPAL - Features List

### Principal Role: "View & Comment"

#### Can View:
- ✅ All users (Students, Tutors, Admins)
- ✅ All courses and content
- ✅ All statistics and analytics
- ✅ Financial reports (read-only)
- ✅ User activity logs
- ✅ Website traffic
- ✅ Application data
- ✅ System health

#### Can Comment:
- ✅ Add comments to user profiles
- ✅ Comment on applications
- ✅ Provide feedback on courses
- ✅ Add notes to transactions
- ✅ Comment on tutor performance
- ✅ Add remarks to student progress
- ✅ Suggest improvements
- ✅ Flag issues for admin review

#### Cannot Do:
- ❌ Edit or delete content
- ❌ Approve/reject applications
- ❌ Modify user accounts
- ❌ Change financial settings
- ❌ Delete records
- ❌ Manage permissions
- ❌ Access sensitive operations

**Principal Comment System:**
```typescript
interface PrincipalComment {
  id: number
  targetType: 'user' | 'course' | 'application' | 'transaction'
  targetId: number
  comment: string
  priority: 'low' | 'medium' | 'high'
  principalName: string
  createdAt: string
  isResolved: boolean
}
```

---

## 🗄️ SUPABASE DATABASE INTEGRATION

### Database Tables to Create

#### 1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. User Activity Logs
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Visit Statistics
```sql
CREATE TABLE visit_stats (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255),
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100),
  duration_seconds INTEGER,
  visited_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Application Attempts
```sql
CREATE TABLE application_attempts (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255),
  course_id INTEGER,
  step_reached INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  form_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Media Links
```sql
CREATE TABLE media_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50),
  url VARCHAR(500),
  title VARCHAR(255),
  description TEXT,
  course_id INTEGER,
  scheduled_date TIMESTAMP,
  expiry_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  click_count INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Website Content
```sql
CREATE TABLE website_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(100),
  key VARCHAR(100),
  value TEXT,
  data_type VARCHAR(50),
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. Principal Comments
```sql
CREATE TABLE principal_comments (
  id SERIAL PRIMARY KEY,
  target_type VARCHAR(50),
  target_id INTEGER,
  comment TEXT,
  priority VARCHAR(20),
  principal_id INTEGER REFERENCES users(id),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. Courses Table
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  tutor_id INTEGER REFERENCES users(id),
  price DECIMAL(10,2),
  duration VARCHAR(50),
  level VARCHAR(50),
  category VARCHAR(100),
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 9. Course Modules
```sql
CREATE TABLE course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(50),
  content TEXT,
  video_url VARCHAR(500),
  order_index INTEGER,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. Enrollments
```sql
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  module_ids INTEGER[],
  payment_status VARCHAR(50),
  amount_paid DECIMAL(10,2),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending'
);
```

---

## 📊 Admin Dashboard Tabs

### 1. Overview (Dashboard Home)
- System statistics
- Recent activity
- Pending approvals count
- Quick actions

### 2. User Management
- All users list
- Filter by role
- Bulk actions
- User details modal

### 3. Visit Analytics
- Traffic graphs
- Visitor breakdown
- Page performance
- Conversion funnel

### 4. Applications
- Pending applications
- Completed applications
- Abandoned applications
- Application timeline

### 5. Media Links
- All platform links
- Link performance
- Schedule management
- Link analytics

### 6. Content Management
- Homepage editor
- Page content
- Images management
- SEO settings

### 7. Financial Reports
- Revenue dashboard
- Transaction history
- Refunds
- Tutor payouts

### 8. Settings
- System configuration
- Email templates
- Payment settings
- Security settings

---

## 🚀 Implementation Priority

### Phase 1 - Authentication ✅
- [x] Unified login with role selector
- [x] Role-based routing
- [x] Session management

### Phase 2 - Super Admin Core (NEXT)
- [ ] User management CRUD
- [ ] Visit tracking setup
- [ ] Basic analytics dashboard
- [ ] Media links management

### Phase 3 - Analytics & Tracking
- [ ] Visitor tracking implementation
- [ ] Application funnel tracking
- [ ] Advanced analytics
- [ ] Reports generation

### Phase 4 - Content Management
- [ ] CMS interface
- [ ] Content editor
- [ ] Image upload system
- [ ] Version control

### Phase 5 - Principal Portal
- [ ] Read-only dashboards
- [ ] Comment system
- [ ] Notification system
- [ ] Report generation

### Phase 6 - Supabase Integration
- [ ] Database schema creation
- [ ] API endpoints
- [ ] Real-time updates
- [ ] Data synchronization

---

## 🔒 Security & Permissions Matrix

| Feature | Student | Tutor | Principal | Admin |
|---------|---------|-------|-----------|-------|
| View own data | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ | ✅ |
| Edit any user | ❌ | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ❌ | ✅ |
| View analytics | ❌ | Partial | ✅ | ✅ |
| Manage courses | ❌ | Own only | ❌ | ✅ |
| Add comments | ❌ | ❌ | ✅ | ✅ |
| Financial access | ❌ | Own only | View only | ✅ |
| Content management | ❌ | ❌ | ❌ | ✅ |

---

**Last Updated:** January 2026
**Status:** Phase 1 Complete, Phase 2 in Planning
**Database:** Supabase (PostgreSQL)
**Frontend:** React + TypeScript + Tailwind CSS v4
