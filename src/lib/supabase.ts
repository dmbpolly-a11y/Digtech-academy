import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// TODO: Replace these with your actual Supabase credentials
// Get them from: https://supabase.com/dashboard > Project Settings > API

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bibhhrpnubdazxdxoglx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpYmhocnBudWJkYXp4ZHhvZ2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NDg5NTEsImV4cCI6MjEwMTMyNDk1MX0.SPVt__ohqYuz6NSGKNFh77d8DbGuBsoJxNyMgXGup9s'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers
export const auth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign up new user
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },
}

// Database helpers
export const db = {
  // Users
  users: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (user: any) => {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
      return { data, error }
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      return { error }
    },
  },

  // Courses
  courses: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    create: async (course: any) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select()
      return { data, error }
    },

    update: async (id: number, updates: any) => {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    delete: async (id: number) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
      return { error }
    },
  },

  // Visit Statistics
  visitStats: {
    track: async (visitorData: any) => {
      const { data, error } = await supabase
        .from('visit_stats')
        .insert([visitorData])
      return { data, error }
    },

    getAll: async () => {
      const { data, error } = await supabase
        .from('visit_stats')
        .select('*')
        .order('visited_at', { ascending: false })
      return { data, error }
    },

    getStats: async () => {
      const { data, error } = await supabase
        .from('visit_stats')
        .select('*')
      
      if (data) {
        const totalVisits = data.length
        const uniqueVisitors = new Set(data.map(v => v.visitor_id)).size
        const deviceBreakdown = data.reduce((acc: any, v: any) => {
          acc[v.device_type] = (acc[v.device_type] || 0) + 1
          return acc
        }, {})
        
        return {
          data: {
            totalVisits,
            uniqueVisitors,
            deviceBreakdown,
          },
          error: null
        }
      }
      
      return { data: null, error }
    },
  },

  // Application Attempts
  applicationAttempts: {
    track: async (attemptData: any) => {
      const { data, error } = await supabase
        .from('application_attempts')
        .insert([attemptData])
      return { data, error }
    },

    getAll: async () => {
      const { data, error } = await supabase
        .from('application_attempts')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },
  },

  // Media Links
  mediaLinks: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('media_links')
        .select('*')
        .order('created_at', { ascending: false})
      return { data, error }
    },

    create: async (link: any) => {
      const { data, error } = await supabase
        .from('media_links')
        .insert([link])
        .select()
      return { data, error }
    },

    update: async (id: number, updates: any) => {
      const { data, error } = await supabase
        .from('media_links')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    delete: async (id: number) => {
      const { error } = await supabase
        .from('media_links')
        .delete()
        .eq('id', id)
      return { error }
    },
  },

  // Enrollments
  enrollments: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id: number) => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (enrollment: any) => {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([enrollment])
        .select()
      return { data, error }
    },

    update: async (id: number, updates: any) => {
      const { data, error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    delete: async (id: number) => {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', id)
      return { error }
    },

    getByStatus: async (status: string) => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('status', status)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getByCourse: async (courseId: number) => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
      return { data, error }
    },
  },
}

// Activity logging
export const logActivity = async (userId: string, action: string, details: any) => {
  const { error } = await supabase
    .from('activity_logs')
    .insert([{
      user_id: userId,
      action,
      details,
      ip_address: '', // Get from browser
      user_agent: navigator.userAgent,
    }])
  
  if (error) console.error('Activity log error:', error)
}

export default supabase
