# Comprehensive Tutor Management System - Implementation Plan

## Overview
This document outlines the complete implementation of a robust tutor management system for Digtech Academy with full CRUD operations, fee management, student management, certificate generation, and exam system.

## Features to Implement

### 1. Course Management System
**Tutor Can:**
- ✅ Create new courses with full details
- ✅ Edit existing courses
- ✅ Delete courses
- ✅ Update course content
- ✅ Manage course visibility (Published/Draft/Archived)
- ✅ Upload course thumbnails
- ✅ Set course prerequisites

**Data Structure:**
```typescript
interface Course {
  id: number
  title: string
  description: string
  tutor: string
  price: number
  rating: number
  students: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  image: string
  free: boolean
  status: 'draft' | 'published' | 'archived'
  modules: Module[]
  createdAt: string
  updatedAt: string
}
```

### 2. Sub-Courses/Modules System
**Tutor Can:**
- ✅ Create modules under main courses
- ✅ Edit/Delete/Update modules
- ✅ Reorder modules
- ✅ Set individual module fees
- ✅ Dropdown menu to view all modules
- ✅ Students can apply for specific modules

**Data Structure:**
```typescript
interface Module {
  id: number
  courseId: number
  title: string
  description: string
  price: number
  duration: string
  content: string
  videoUrl?: string
  order: number
  isLocked: boolean
}
```

### 3. Fee Management System
**Tutor Can:**
- ✅ Post course fees
- ✅ Change fees
- ✅ Update fee structure
- ✅ Delete fees
- ✅ Lock/Unlock fees (prevent changes)
- ✅ Set discount prices
- ✅ Create fee schedules

**Data Structure:**
```typescript
interface FeeStructure {
  id: number
  courseId: number
  moduleId?: number
  regularPrice: number
  discountPrice?: number
  currency: 'UGX'
  isLocked: boolean
  effectiveDate: string
  expiryDate?: string
}
```

### 4. Live Class Links Management
**Tutor Can:**
- ✅ Add Google Meet links
- ✅ Add Zoom links
- ✅ Add YouTube Live links
- ✅ Edit links
- ✅ Delete links
- ✅ Schedule link availability
- ✅ Set link expiry

**Data Structure:**
```typescript
interface LiveLink {
  id: number
  courseId: number
  platform: 'google-meet' | 'zoom' | 'youtube'
  url: string
  title: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  isActive: boolean
  maxParticipants?: number
}
```

### 5. Student Management System
**Tutor Can:**
- ✅ View all enrolled students
- ✅ Add new students manually
- ✅ Approve pending registrations
- ✅ Reject registrations
- ✅ View student profiles
- ✅ Track student progress
- ✅ Send notifications to students

**Data Structure:**
```typescript
interface Student {
  id: number
  name: string
  email: string
  phone: string
  enrolledCourses: number[]
  status: 'pending' | 'approved' | 'active' | 'suspended'
  registrationDate: string
  progress: Record<number, number> // courseId: percentage
}
```

### 6. Certificate System
**Tutor Can:**
- ✅ Design certificate templates
- ✅ Generate certificates for students
- ✅ Issue certificates upon course completion
- ✅ Track issued certificates
- ✅ Revoke certificates if needed
- ✅ Add QR codes for verification

**Data Structure:**
```typescript
interface Certificate {
  id: number
  studentId: number
  courseId: number
  issueDate: string
  certificateNumber: string
  qrCode: string
  status: 'issued' | 'revoked'
  completionDate: string
  grade: string
}
```

### 7. Marks & Grading System
**Tutor Can:**
- ✅ Enter marks for assignments
- ✅ Calculate total marks
- ✅ Assign grades (A, B, C, D, F)
- ✅ Set grading scale
- ✅ View student performance analytics
- ✅ Export marks to CSV

**Data Structure:**
```typescript
interface StudentMarks {
  id: number
  studentId: number
  courseId: number
  examId?: number
  assignmentId?: number
  marks: number
  maxMarks: number
  percentage: number
  grade: string
  feedback: string
  submittedDate: string
  gradedDate: string
}

interface GradingScale {
  grade: string
  minPercentage: number
  maxPercentage: number
  description: string
}
```

### 8. Exam/Test System
**Tutor Can:**
- ✅ Create exam forms
- ✅ Add multiple question types (MCQ, Essay, True/False)
- ✅ Set time limits
- ✅ Generate exam links
- ✅ Schedule exams
- ✅ Auto-submit on timeout
- ✅ Mark submitted exams
- ✅ Provide feedback
- ✅ View exam analytics

**Data Structure:**
```typescript
interface Exam {
  id: number
  courseId: number
  title: string
  description: string
  duration: number // minutes
  totalMarks: number
  passingMarks: number
  questions: Question[]
  startDate: string
  endDate: string
  attemptLimit: number
  isActive: boolean
  examLink: string
}

interface Question {
  id: number
  examId: number
  type: 'mcq' | 'essay' | 'true-false' | 'short-answer'
  question: string
  options?: string[] // for MCQ
  correctAnswer?: string
  marks: number
  order: number
}

interface ExamSubmission {
  id: number
  examId: number
  studentId: number
  answers: Record<number, string> // questionId: answer
  submittedAt: string
  timeSpent: number
  marks?: number
  graded: boolean
  feedback?: string
}
```

### 9. Registration & Payment Flow
**Student Registration Process:**
1. Student clicks "Apply" on course/module
2. Redirected to registration form with:
   - Personal details
   - Course selection
   - Module selection (dropdown)
   - Emergency contact
   - Educational background
3. After form submission → Payment page
4. Payment via PesaPal
5. Confirmation email sent
6. Tutor receives notification for approval

**Registration Form Fields:**
```typescript
interface RegistrationForm {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  
  // Course Selection
  courseId: number
  moduleIds: number[]
  
  // Emergency Contact
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  
  // Educational Background
  highestEducation: string
  institution: string
  
  // Payment
  totalAmount: number
  paymentMethod: string
}
```

## Implementation Status

This is a comprehensive system that requires:
- Enhanced UI components for tutor dashboard
- State management for all entities
- Form validation
- File upload handling
- Payment integration
- Email notifications
- PDF generation for certificates
- Real-time exam timer
- Data persistence (localStorage or backend)

## Next Steps

1. Create enhanced Tutor Dashboard UI with tabs for each feature
2. Implement CRUD forms for courses, modules, fees
3. Build student management panel
4. Create exam builder interface
5. Implement grading system
6. Build certificate generator
7. Create registration form component
8. Integrate payment flow

## Demo Credentials
- **Tutor Email:** tutor@digtechacademy.ug
- **Password:** Tutor@2024
