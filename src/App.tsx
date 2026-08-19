import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { simulateCompletePaymentFlow, validatePaymentDetails, getMerchantAccount } from './utils/pesapal'
import { auth, db, logActivity } from './lib/supabase'
import { CourseForm } from './components/CourseForm'
import { EnrollmentForm } from './components/EnrollmentForm'

// ─── Types ────────────────────────────────────────────────────────────────────
type Frame =
  | 'home'
  | 'courses'
  | 'course-detail'
  | 'student-dashboard'
  | 'tutor-dashboard'
  | 'admin-dashboard'
  | 'principal-dashboard'
  | 'live-courses'
  | 'lesson-player'
  | 'about'
  | 'contact'
  | 'faq'
  | 'login'
  | 'register'

interface SuccessStory {
  id: number
  name: string
  text: string
  role: string
  avatar: string
  rating: number
}

interface AdminUser {
  id: number
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
}

// ─── Initial Data (Sorted Descending by Enrollment Count) ─────────────────────
const INITIAL_COURSES = [
  {
    id: 1,
    title: 'Python for Data Science & Machine Learning',
    tutor: 'Grace Nakato',
    price: 95000,
    rating: 4.9,
    students: 548,
    duration: '18 hours',
    level: 'Beginner',
    category: 'Data Science',
    image: '/images/liveclass2.png',
    free: false,
  },
  {
    id: 2,
    title: 'Full Stack Web Development with React & Node.js',
    tutor: 'David Ssekandi',
    price: 120000,
    rating: 4.8,
    students: 312,
    duration: '24 hours',
    level: 'Intermediate',
    category: 'Web Development',
    image: '/images/liveclass3.png',
    free: false,
  },
  {
    id: 3,
    title: 'Digital Marketing & Social Media Strategy',
    tutor: 'Ronald Kato',
    price: 75000,
    rating: 4.6,
    students: 274,
    duration: '10 hours',
    level: 'Beginner',
    category: 'Marketing',
    image: '/images/liveclass1.png',
    free: false,
  },
  {
    id: 4,
    title: 'Cybersecurity Essentials for Professionals',
    tutor: 'Peter Musoke',
    price: 150000,
    rating: 4.8,
    students: 201,
    duration: '20 hours',
    level: 'Advanced',
    category: 'Security',
    image: '/images/liveclass2.png',
    free: false,
  },
  {
    id: 5,
    title: 'UI/UX Design Fundamentals with Figma',
    tutor: 'Amina Nalule',
    price: 0,
    rating: 4.7,
    students: 189,
    duration: '12 hours',
    level: 'Beginner',
    category: 'Design',
    image: '/images/liveclass4.png',
    free: true,
  },
  {
    id: 6,
    title: 'Mobile App Development with Flutter',
    tutor: 'Josephine Aber',
    price: 110000,
    rating: 4.7,
    students: 163,
    duration: '16 hours',
    level: 'Intermediate',
    category: 'Mobile Dev',
    image: '/images/liveclass5.png',
    free: false,
  },
]

const TUTORS = [
  { name: 'Grace Nakato', specialty: 'Data Science', students: 548, rating: 4.9, avatar: '/images/liveclass1.png' },
  { name: 'David Ssekandi', specialty: 'Web Development', students: 312, rating: 4.8, avatar: '/images/liveclass2.png' },
  { name: 'Ronald Kato', specialty: 'Digital Marketing', students: 274, rating: 4.6, avatar: '/images/liveclass3.png' },
  { name: 'Peter Musoke', specialty: 'Cybersecurity', students: 201, rating: 4.8, avatar: '/images/liveclass4.png' },
  { name: 'Amina Nalule', specialty: 'UI/UX Design', students: 189, rating: 4.7, avatar: '/images/liveclass5.png' },
]

const LIVE_COURSES = [
  {
    id: 1,
    title: 'Certified Cloud Practitioner & DevOps Masterclass',
    trainer: 'Emmanuel Byaruhanga',
    schedule: 'Mon, Wed, Fri',
    time: '7:00 PM – 9:00 PM EAT',
    fee: 350000,
    duration: '6 weeks',
    spots: 8,
    platform: 'Google Meet',
    platformIcon: 'logos:google-meet',
    joinLink: 'https://meet.google.com/new',
    whatsappLink: 'https://wa.me/256770613201?text=I%20want%20to%20join%20Cloud%20Practitioner%20Masterclass',
    youtubeLink: 'https://youtube.com/@digtechacademy',
    emailLink: 'mailto:info@digtechsolutionshub.com?subject=Cloud Practitioner Masterclass Enrollment',
    badgeColor: 'blue',
  },
  {
    id: 2,
    title: 'Advanced Financial Modeling & Excel Analytics',
    trainer: 'Flavia Namukasa',
    schedule: 'Tue, Thu, Sat',
    time: '6:00 PM – 8:00 PM EAT',
    fee: 180000,
    duration: '4 weeks',
    spots: 12,
    platform: 'Zoom',
    platformIcon: 'logos:zoom-icon',
    joinLink: 'https://zoom.us/join',
    whatsappLink: 'https://wa.me/256770613201?text=I%20want%20to%20join%20Financial%20Modeling%20Course',
    youtubeLink: 'https://youtube.com/@digtechacademy',
    emailLink: 'mailto:info@digtechsolutionshub.com?subject=Financial Modeling Course Enrollment',
    badgeColor: 'cyan',
  },
  {
    id: 3,
    title: 'Content Creation, Monetization & Brand Strategy',
    trainer: 'Isaac Tumwine',
    schedule: 'Sat, Sun',
    time: '9:00 AM – 12:00 PM EAT',
    fee: 140000,
    duration: '3 weeks',
    spots: 5,
    platform: 'YouTube Live',
    platformIcon: 'logos:youtube-icon',
    joinLink: 'https://youtube.com/@digtechacademy/live',
    whatsappLink: 'https://wa.me/256770613201?text=I%20want%20to%20join%20Content%20Creation%20Course',
    youtubeLink: 'https://youtube.com/@digtechacademy',
    emailLink: 'mailto:info@digtechsolutionshub.com?subject=Content Creation Course Enrollment',
    badgeColor: 'purple',
  },
]

const INITIAL_TESTIMONIALS: SuccessStory[] = [
  {
    id: 1,
    name: 'Sarah Namutebi',
    text: 'Digtech Academy transformed my career completely. I went from zero coding knowledge to landing a junior developer job in Kampala in 6 months.',
    role: 'Junior Developer at Tecno Uganda',
    avatar: '/images/liveclass1.png',
    rating: 5,
  },
  {
    id: 2,
    name: 'Brian Odhiambo',
    text: 'The Data Science course was exceptionally practical. Every project directly matched what I now do daily at work. Worth every shilling!',
    role: 'Data Analyst at MTN Uganda',
    avatar: '/images/liveclass2.png',
    rating: 5,
  },
  {
    id: 3,
    name: 'Patricia Auma',
    text: 'Flexible learning that fit my busy schedule. I completed the UI/UX course in 4 weeks and immediately started winning international freelance clients.',
    role: 'Freelance Product Designer',
    avatar: '/images/liveclass3.png',
    rating: 5,
  },
]

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 1,
    name: 'System Admin',
    email: 'admin@digtechacademy.ug',
    phone: '+256 770 613 201',
    role: 'Course Operations Admin',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sarah Mukasa',
    email: 'sarah.admin@digtechacademy.ug',
    phone: '+256 701 445 890',
    role: 'Finance & Payments Admin',
    createdAt: '2024-03-10',
  },
]

// ─── Shared UI Components ─────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          icon="lucide:star"
          className={`w-3.5 h-3.5 ${
            i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-600">{rating}</span>
    </div>
  )
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-100',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    red: 'bg-red-50 text-red-700 border border-red-100',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100',
  }
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${styles[color] || styles.blue}`}>
      {children}
    </span>
  )
}

function CourseCard({
  course,
  onClick,
  onEnroll,
}: {
  course: typeof INITIAL_COURSES[0]
  onClick: () => void
  onEnroll?: (course: any) => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-lift transition-all cursor-pointer group animate-fade-in-up flex flex-col justify-between click-zoom"
    >
      <div>
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {course.free && (
            <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse-glow">
              FREE
            </span>
          )}
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            {course.level}
          </span>
        </div>
        <div className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#28C0F4]">
            {course.category}
          </span>
          <h3 className="font-bold text-gray-900 mt-1 mb-2 leading-snug line-clamp-2 group-hover:text-[#1A4095] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {course.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <Icon icon="lucide:user" className="w-3.5 h-3.5 text-gray-400" />
            {course.tutor}
          </p>
          <StarRating rating={course.rating} />
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-gray-400" /> {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon icon="lucide:users" className="w-3.5 h-3.5 text-gray-400" /> {course.students.toLocaleString()} enrolled
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between">
        <span className="font-extrabold text-lg text-[#1A4095]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {course.free ? 'Free' : `UGX ${course.price.toLocaleString()}`}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (onEnroll) {
              onEnroll({ id: course.id, title: course.title })
            }
          }}
          className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          style={{ background: '#28C0F4' }}
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

// ─── Public Navigation ─────────────────────────────────────────────────────────
function PublicNav({
  frame,
  setFrame,
  currentUser,
  onLogout,
}: {
  frame: Frame
  setFrame: (f: Frame) => void
  currentUser: { email: string; role: string; name?: string } | null
  onLogout: () => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const links: { label: string; frame: Frame }[] = [
    { label: 'Home', frame: 'home' },
    { label: 'Courses', frame: 'courses' },
    { label: 'Live Classes', frame: 'live-courses' },
    { label: 'About', frame: 'about' },
    { label: 'Contact', frame: 'contact' },
    { label: 'FAQ', frame: 'faq' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo only - strictly without repeating text */}
        <button
          onClick={() => setFrame('home')}
          className="flex items-center group cursor-pointer focus:outline-none"
          title="Digtech Academy Homepage"
        >
          <img
            src="/images/Digtech Academy Logo.png"
            alt="Digtech Academy"
            className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.frame}
              onClick={() => setFrame(l.frame)}
              className={`text-sm font-medium transition-all hover:scale-105 cursor-pointer ${
                frame === l.frame ? 'font-bold text-[#1A4095] border-b-2 border-[#1A4095] pb-0.5' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Desktop Auth Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') setFrame('admin-dashboard')
                  else if (currentUser.role === 'tutor') setFrame('tutor-dashboard')
                  else if (currentUser.role === 'principal') setFrame('principal-dashboard')
                  else setFrame('student-dashboard')
                }}
                className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all shadow-sm hover:opacity-90 flex items-center gap-2 hover:scale-105 cursor-pointer blue-btn-gradient-hover"
                style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
              >
                <Icon icon="lucide:layout-dashboard" className="w-4 h-4" />
                {currentUser.role.toUpperCase()} DASHBOARD
              </button>
              <button
                onClick={onLogout}
                className="text-xs font-bold px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="lucide:log-out" className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setFrame('login')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-1.5 hover:bg-blue-50 hover:scale-105 cursor-pointer ${
                  frame === 'login' ? 'bg-blue-50 border-[#1A4095] text-[#1A4095]' : 'border-gray-200 text-gray-700'
                }`}
              >
                <Icon icon="lucide:lock" className="w-4 h-4 text-[#1A4095]" /> Sign In
              </button>
              <button
                onClick={() => setFrame('register')}
                className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105 shadow-sm cursor-pointer blue-btn-gradient-hover"
                style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          <Icon icon={mobileOpen ? 'lucide:x' : 'lucide:menu'} className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-2 animate-fade-in-down shadow-lg">
          {links.map((l) => (
            <button
              key={l.frame}
              onClick={() => {
                setFrame(l.frame)
                setMobileOpen(false)
              }}
              className={`text-left text-sm font-medium py-2.5 px-3 rounded-lg ${
                frame === l.frame ? 'bg-blue-50 text-[#1A4095] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {l.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') setFrame('admin-dashboard')
                    else if (currentUser.role === 'tutor') setFrame('tutor-dashboard')
                    else if (currentUser.role === 'principal') setFrame('principal-dashboard')
                    else setFrame('student-dashboard')
                    setMobileOpen(false)
                  }}
                  className="w-full text-xs font-bold py-3 rounded-xl text-white flex items-center justify-center gap-1.5 blue-btn-gradient-hover"
                  style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                >
                  <Icon icon="lucide:layout-dashboard" className="w-4 h-4" /> Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout()
                    setMobileOpen(false)
                  }}
                  className="w-full text-xs font-bold py-2.5 rounded-xl border border-red-200 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFrame('login')
                    setMobileOpen(false)
                  }}
                  className="w-full text-xs font-bold py-2.5 rounded-xl border-2 border-[#1A4095] text-[#1A4095] flex items-center justify-center gap-1.5"
                >
                  <Icon icon="lucide:lock" className="w-4 h-4" /> Sign In
                </button>
                <button
                  onClick={() => {
                    setFrame('register')
                    setMobileOpen(false)
                  }}
                  className="w-full text-xs font-bold py-2.5 rounded-xl text-white blue-btn-gradient-hover"
                  style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Footer Component (White Theme & Complete Specs) ──────────────────────────
function Footer({ setFrame }: { setFrame: (f: Frame) => void }) {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  // Update East African Time (EAT) every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // EAT is UTC+3
      const eatTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }))
      
      // Format time
      const timeFormatted = eatTime.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      
      // Format date
      const dateFormatted = eatTime.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      
      setCurrentTime(timeFormatted)
      setCurrentDate(dateFormatted)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-[#04263A] border-t border-gray-700 text-gray-300 py-12 footer-animate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Socials */}
        <div className="space-y-4 footer-section">
          <div className="flex items-center">
            <img
              src="/images/Digtech Academy Logo White.png"
              alt="Digtech Academy"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            Uganda's premier digital skills academy. Practical, tutor-led courses in tech, business, and trades — learn on any connection, pay in UGX via PesaPal.
          </p>
          <div className="pt-2">
            <p className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Connect With Us</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: 'lucide:facebook', href: 'https://www.facebook.com/digtechsolutionshub/', label: 'Facebook' },
                { icon: 'lucide:instagram', href: 'https://instagram.com/digtechacademy', label: 'Instagram' },
                { icon: 'lucide:twitter', href: 'https://x.com/Digtech1', label: 'X (Twitter)' },
                { icon: 'mdi:tiktok', href: 'https://www.tiktok.com/@korabusiness/video/7543967921161112888', label: 'TikTok' },
                { icon: 'lucide:linkedin', href: 'https://ug.linkedin.com/company/digtech-solutions-hub', label: 'LinkedIn' },
                { icon: 'lucide:youtube', href: 'https://youtube.com/@digtechacademy', label: 'YouTube' },
                { icon: 'mdi:whatsapp', href: 'https://wa.me/256770613201', label: 'WhatsApp' },
                { icon: 'lucide:mail', href: 'mailto:info@digtechsolutionshub.com', label: 'Email' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#28C0F4] transition-all shadow-sm footer-social-icon"
                >
                  <Icon icon={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="text-white font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setFrame('home')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('courses')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                Browse Courses
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('live-courses')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                Live Classes
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('about')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                About Academy
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('faq')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('contact')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                Contact & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Course Categories */}
        <div className="footer-section">
          <h4 className="text-white font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Course Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            {['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Cybersecurity', 'Mobile App Development'].map((cat) => (
              <li key={cat}>
                <button onClick={() => setFrame('courses')} className="text-gray-400 hover:text-[#28C0F4] transition-colors footer-link">
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Contact Details */}
        <div className="footer-section">
          <h4 className="text-white font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Support
          </h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li className="flex items-start gap-2.5">
              <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#28C0F4] flex-shrink-0 mt-0.5" />
              <span>Level 2 Grand West Arcade, High Street Mbarara City - Uganda</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon icon="lucide:phone" className="w-4 h-4 text-[#28C0F4] flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <a href="tel:+256702524736" className="hover:underline footer-link">Airtel: +256 702 524 736</a>
                <a href="tel:+256770613201" className="hover:underline footer-link">MTN: +256 770 613 201</a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon icon="lucide:mail" className="w-4 h-4 text-[#28C0F4] flex-shrink-0" />
              <a href="mailto:info@digtechsolutionshub.com" className="hover:underline footer-link">info@digtechsolutionshub.com</a>
            </li>
            <li className="pt-2 border-t border-gray-700">
              <button
                onClick={() => setFrame('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#28C0F4] hover:text-white transition-all footer-link"
              >
                <Icon icon="lucide:shield-check" className="w-4 h-4" />
                Admin Portal Login
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Embedded Google Map for Mbarara Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 animate-slide-in-bottom">
        <div className="rounded-2xl overflow-hidden border-2 border-[#28C0F4]/30 h-64 shadow-lg hover:shadow-2xl transition-all ease-in-out" style={{ boxShadow: '0 10px 40px rgba(40, 192, 244, 0.2)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7608791885!2d30.659711!3d-0.606781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x176584af1e2a08ff%3A0x79a3e7bc3b8f5123!2sMbarara%2C%20Uganda!5e0!3m2!1sen!2sug!4v1234567890"
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            title="Digtech Academy Mbarara Location - Grand West Arcade, High Street"
            style={{ border: 0 }}
          />
        </div>
      </div>

      {/* Live East African Time Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="live-clock flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:clock" className="w-5 h-5 text-[#28C0F4] animate-pulse" />
            <span className="text-xs font-bold text-[#28C0F4] uppercase tracking-wider">Live Time - East African Time (EAT)</span>
          </div>
          <div className="live-clock-time text-2xl md:text-3xl">
            {currentTime}
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {currentDate}
          </div>
        </div>
      </div>

      {/* Automatic Year Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>© {new Date().getFullYear()} Digtech Academy. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <span>Official Payment Partner:</span>
          <span className="font-bold text-[#28C0F4]">PesaPal Payments Uganda</span>
        </p>
      </div>
    </footer>
  )
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({
  setFrame,
  testimonials,
  onEnroll,
}: {
  setFrame: (f: Frame) => void
  testimonials: SuccessStory[]
  onEnroll: (course?: { id: number; title: string }) => void
}) {
  const [searchQ, setSearchQ] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Sorted descending by enrollment count
  const sortedCourses = [...INITIAL_COURSES].sort((a, b) => b.students - a.students)

  const searchResults =
    searchQ.trim().length > 0
      ? INITIAL_COURSES.filter(
          (c) =>
            c.title.toLowerCase().includes(searchQ.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQ.toLowerCase()) ||
            c.tutor.toLowerCase().includes(searchQ.toLowerCase())
        )
      : []

  const categories = [
    { name: 'Web Development', icon: 'lucide:globe', color: '#1A4095' },
    { name: 'Data Science', icon: 'lucide:bar-chart-3', color: '#10B981' },
    { name: 'Design', icon: 'lucide:palette', color: '#F59E0B' },
    { name: 'Marketing', icon: 'lucide:megaphone', color: '#EC4899' },
    { name: 'Security', icon: 'lucide:shield', color: '#EF4444' },
    { name: 'Mobile Dev', icon: 'lucide:smartphone', color: '#8B5CF6' },
  ]

  return (
    <div>
      {/* Marquee Banner */}
      <div className="marquee-banner">
        <div className="marquee-content">
          <span><Icon icon="lucide:graduation-cap" className="inline w-4 h-4 mr-2" />Uganda's Leading Online Digital Academy</span>
          <span><Icon icon="lucide:book-open" className="inline w-4 h-4 mr-2" />Expert-Led Courses</span>
          <span><Icon icon="lucide:laptop" className="inline w-4 h-4 mr-2" />Learn Tech, Business & Trades</span>
          <span><Icon icon="lucide:award" className="inline w-4 h-4 mr-2" />Accredited Certificates</span>
          <span><Icon icon="lucide:credit-card" className="inline w-4 h-4 mr-2" />Pay in UGX via PesaPal</span>
          <span><Icon icon="lucide:graduation-cap" className="inline w-4 h-4 mr-2" />Uganda's Leading Online Digital Academy</span>
          <span><Icon icon="lucide:book-open" className="inline w-4 h-4 mr-2" />Expert-Led Courses</span>
          <span><Icon icon="lucide:laptop" className="inline w-4 h-4 mr-2" />Learn Tech, Business & Trades</span>
          <span><Icon icon="lucide:award" className="inline w-4 h-4 mr-2" />Accredited Certificates</span>
          <span><Icon icon="lucide:credit-card" className="inline w-4 h-4 mr-2" />Pay in UGX via PesaPal</span>
        </div>
      </div>

      {/* Magnetic Field Animation */}
      <div className="magnetic-field-container">
        <div className="magnetic-field-orb orb-1"></div>
        <div className="magnetic-field-orb orb-2"></div>
        <div className="magnetic-field-orb orb-3"></div>
        <div className="magnetic-field-orb orb-4"></div>
        <div className="magnetic-field-orb orb-5"></div>
        <div className="magnetic-field-orb orb-6"></div>
      </div>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden click-zoom"
        style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 60%, #1A4095 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full blur-3xl bg-[#28C0F4]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#28C0F4]" />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                Uganda's Leading Online Digital Academy
              </span>
            </div>
            <h1
              className="text-white font-extrabold text-4xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Master In-Demand <br />
              <span className="text-[#28C0F4]">Digital Skills</span> & Career Growth
            </h1>
            <p className="text-white/80 text-base mb-8 leading-relaxed">
              Expert-led courses, live hands-on classes, and accredited certifications. Pay easily in UGX with PesaPal and learn at your own pace.
            </p>

            {/* Live Search Appearance with Autocomplete Dropdown */}
            <div className="relative max-w-lg">
              <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-2xl">
                <div className="flex items-center pl-3 text-gray-400">
                  <Icon icon="lucide:search" className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => {
                    setSearchQ(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search courses, categories, tutors..."
                  className="flex-1 px-2 py-3 text-gray-800 text-sm outline-none bg-transparent placeholder-gray-400 font-medium"
                />
                <button
                  onClick={() => setFrame('courses')}
                  className="text-white text-xs font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer click-zoom"
                  style={{ background: '#28C0F4' }}
                >
                  Search
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down max-h-80 overflow-y-auto">
                  <div className="p-2 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Suggested Courses ({searchResults.length})
                  </div>
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setShowSuggestions(false)
                        setFrame('course-detail')
                      }}
                      className="w-full text-left p-3.5 hover:bg-blue-50/60 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-gray-900">{c.title}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="text-[#28C0F4] font-semibold">{c.category}</span>
                            <span>•</span>
                            <span>{c.tutor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-[#1A4095]">
                          {c.free ? 'Free' : `UGX ${c.price.toLocaleString()}`}
                        </div>
                        <div className="text-[10px] text-gray-400">{c.students} enrolled</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:block animate-fade-in-right">
            <div className="relative section-zoom-animate">
              <button 
                onClick={() => setFrame('courses')}
                className="block w-full cursor-pointer group"
              >
                <img
                  src="/images/liveclass1.png"
                  alt="Students learning tech in live class"
                  className="rounded-3xl shadow-2xl border-4 border-[#28C0F4]/40 object-cover w-full h-[420px] image-with-blue-border transition-transform group-hover:scale-105"
                />
              </button>
              <button 
                onClick={() => setFrame('about')}
                className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 animate-float hover:scale-110 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icon icon="lucide:award" className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Verified Certificates</div>
                    <div className="text-xs text-gray-500">Recognized by Top Employers</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50 section-zoom-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#28C0F4] mb-2">Explore Skills</p>
            <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Top Learning Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setFrame('courses')}
                className="bg-white p-5 rounded-2xl border-2 border-[#28C0F4]/30 text-center hover-lift transition-all group cursor-pointer shadow-sm blue-accent-overlay click-zoom card-flip-hover"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm"
                  style={{ background: cat.color }}
                >
                  <Icon icon={cat.icon} className="w-6 h-6" />
                </div>
                <div className="font-bold text-xs text-gray-900 group-hover:text-[#1A4095]">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses (Ordered Descending by Enrollment Count) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#28C0F4] mb-2">Popular Programs</p>
              <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Featured Courses
              </h2>
              <p className="text-xs text-gray-500 mt-1">Sorted by highest student enrollment and ratings</p>
            </div>
            <button
              onClick={() => setFrame('courses')}
              className="text-xs font-bold text-[#1A4095] hover:text-[#28C0F4] flex items-center gap-1 cursor-pointer"
            >
              View All Courses <Icon icon="lucide:chevron-right" className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.slice(0, 6).map((c) => (
              <CourseCard key={c.id} course={c} onClick={() => setFrame('course-detail')} onEnroll={onEnroll} />
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories (Admin Managed) */}
      <section
        style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }}
        className="py-20 text-white section-zoom-animate"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#28C0F4] mb-2">Student Testimonials</p>
            <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Real Success Stories
            </h2>
            <p className="text-white/70 text-sm mt-1 max-w-lg mx-auto">
              Read how Digtech Academy students are transforming their careers across East Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between card-flip-hover"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Icon key={i} icon="lucide:star" className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                </div>
                <button 
                  onClick={() => setFrame('courses')}
                  className="flex items-center gap-3 pt-4 border-t border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#28C0F4]" />
                  <div className="text-left">
                    <div className="font-bold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-white/60">{t.role}</div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── COURSES PAGE ──────────────────────────────────────────────────────────────
function CoursesPage({ setFrame, onEnroll }: { setFrame: (f: Frame) => void; onEnroll: (course?: { id: number; title: string }) => void }) {
  const [selectedCat, setSelectedCat] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [searchQ, setSearchQ] = useState('')

  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Marketing', 'Security', 'Mobile Dev']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filtered = INITIAL_COURSES.filter((c) => {
    if (selectedCat !== 'All' && c.category !== selectedCat) return false
    if (selectedLevel !== 'All' && c.level !== selectedLevel) return false
    if (searchQ.trim() && !c.title.toLowerCase().includes(searchQ.toLowerCase())) return false
    return true
  }).sort((a, b) => b.students - a.students)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Explore Academy Courses
        </h1>
        <p className="text-gray-500 text-sm">Showing {filtered.length} courses ordered by enrollment popularity</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search by title or topic..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1A4095]"
            />
            <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Level:</span>
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLevel(l)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  selectedLevel === l ? 'bg-[#1A4095] text-white border-[#1A4095]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase self-center mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full border font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-[#28C0F4] text-white border-[#28C0F4] shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Icon icon="lucide:search-x" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-600">No courses found matching your criteria</p>
          <button
            onClick={() => {
              setSelectedCat('All')
              setSelectedLevel('All')
              setSearchQ('')
            }}
            className="mt-3 text-xs font-bold text-[#1A4095] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 section-zoom-animate">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} onClick={() => setFrame('course-detail')} onEnroll={onEnroll} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── LIVE COURSES PAGE (With Platform Links & Details) ────────────────────────
function LiveCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<typeof LIVE_COURSES[0] | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [appliedSuccess, setAppliedSuccess] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-wider text-[#28C0F4] mb-2">Real-Time Interaction</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Live Online Classes
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Interactive cohort-based sessions streamed directly on Google Meet, Zoom, and TikTok Live. Direct mentorship, Q&A, and practical code reviews.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12 section-zoom-animate">
        {LIVE_COURSES.map((lc) => (
          <div
            key={lc.id}
            className="bg-white rounded-3xl border-2 border-[#28C0F4]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between card-hover click-zoom card-flip-hover"
          >
            <div className="p-1" style={{ background: 'linear-gradient(135deg, #1A4095, #28C0F4)' }}>
              <div className="bg-white rounded-[22px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge color={lc.badgeColor}>{lc.duration.toUpperCase()}</Badge>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {lc.spots} spots left
                  </div>
                </div>

                <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {lc.title}
                </h2>
                <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
                  <Icon icon="lucide:user" className="w-4 h-4 text-gray-400" />
                  Lead Trainer: <span className="font-semibold text-gray-800">{lc.trainer}</span>
                </p>

                {/* Platform Tag */}
                <div className="mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Icon icon={lc.platformIcon} className="w-5 h-5" />
                    <span>Hosted on {lc.platform}</span>
                  </div>
                  <a
                    href={lc.joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#1A4095] hover:text-[#28C0F4] flex items-center gap-1 hover:underline"
                  >
                    Test Link <Icon icon="lucide:external-link" className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Icon icon="lucide:calendar" className="w-4 h-4 text-gray-400" />
                    <span>Schedule: <strong className="text-gray-800">{lc.schedule}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Icon icon="lucide:clock" className="w-4 h-4 text-gray-400" />
                    <span>Timing: <strong className="text-gray-800">{lc.time}</strong></span>
                  </div>
                </div>

                {/* Live Platform Links */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Join Via:</div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={lc.joinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title={lc.platform}
                    >
                      <Icon icon={lc.platformIcon} className="w-4 h-4" />
                      {lc.platform}
                    </a>
                    <a
                      href={lc.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                      title="WhatsApp"
                    >
                      <Icon icon="mdi:whatsapp" className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <a
                      href={lc.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                      title="YouTube"
                    >
                      <Icon icon="lucide:youtube" className="w-4 h-4" />
                      YouTube
                    </a>
                    <a
                      href={lc.emailLink}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      title="Email"
                    >
                      <Icon icon="lucide:mail" className="w-4 h-4" />
                      Email
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase font-semibold">Tuition Fee</div>
                    <div className="text-xl font-extrabold text-[#1A4095]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      UGX {lc.fee.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourse(lc)
                      setShowApplyModal(true)
                      setAppliedSuccess(false)
                    }}
                    className="text-xs font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm cursor-pointer blue-btn-gradient-hover"
                    style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Join Live Class Cohort
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon icon="lucide:check-circle" className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Application Submitted!</h3>
                <p className="text-xs text-gray-500 mb-4">
                  We have sent the live cohort link and schedule details to your WhatsApp and email.
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="w-full py-3 rounded-xl bg-[#1A4095] text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setAppliedSuccess(true)
                }}
                className="space-y-4"
              >
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs">
                  <div className="font-bold text-gray-900">{selectedCourse.title}</div>
                  <div className="text-gray-500 mt-0.5">{selectedCourse.schedule} • {selectedCourse.time}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Isaac Mugisha"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 700 000 000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md mt-2 blue-btn-gradient-hover"
                  style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                >
                  Submit & Get Live Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── COURSE DETAIL & PESAPAL PAYMENT ──────────────────────────────────────────
function CourseDetailPage({ onEnroll }: { onEnroll: (course?: { id: number; title: string }) => void }) {
  const course = INITIAL_COURSES[0]
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentReference, setPaymentReference] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [method, setMethod] = useState<'momo' | 'airtel' | 'card' | 'bank'>('momo')
  const [errorMessage, setErrorMessage] = useState('')

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentProcessing(true)
    setErrorMessage('')

    try {
      // Validate payment details using PesaPal utility
      const validation = validatePaymentDetails(
        phone,
        email,
        firstName,
        lastName,
        method === 'momo' ? 'MTN' : method === 'airtel' ? 'AIRTEL' : 'MTN'
      )
      
      if (!validation.valid) {
        throw new Error(validation.errors.join('. '))
      }

      // Map method to PesaPal format
      const paymentMethod = method === 'momo' ? 'MTN' : method === 'airtel' ? 'AIRTEL' : 'MTN'
      const merchantAccount = getMerchantAccount(paymentMethod)
      
      // Initiate phone payment via PesaPal
      const paymentResult = await simulateCompletePaymentFlow(
        course.price,
        phone,
        paymentMethod,
        `Enrollment: ${course.title}`
      )

      if (!paymentResult.success) {
        throw new Error(paymentResult.message)
      }

      setPaymentReference(paymentResult.reference)
      setPaymentSuccess(true)
      
      // Show merchant account info in success message
      alert(`✅ SMS with PIN prompt sent to ${phone}!\n\n${paymentResult.message}\n\nPlease check your phone and enter PIN to authorize payment.\n\nMerchant Account: ${merchantAccount}`)
    } catch (error: any) {
      setErrorMessage(error.message || 'Payment failed. Please try again.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }} className="text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex gap-2 mb-4">
              <Badge color="cyan">{course.category}</Badge>
              <Badge color="green">{course.level}</Badge>
            </div>
            <h1 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {course.title}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Master industrial machine learning, statistical modeling, and data pipelines using Python, Pandas, Scikit-Learn, and PyTorch.
            </p>
            <div className="flex flex-wrap gap-5 text-xs text-white/80">
              <span className="flex items-center gap-1.5"><Icon icon="lucide:clock" className="w-4 h-4 text-[#28C0F4]" /> {course.duration}</span>
              <span className="flex items-center gap-1.5"><Icon icon="lucide:users" className="w-4 h-4 text-[#28C0F4]" /> {course.students} enrolled</span>
              <span className="flex items-center gap-1.5"><Icon icon="lucide:globe" className="w-4 h-4 text-[#28C0F4]" /> English & Luganda support</span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl p-6 text-gray-900 shadow-2xl border border-white/20">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Course Fee</div>
            <div className="text-3xl font-extrabold text-[#1A4095] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              UGX {course.price.toLocaleString()}
            </div>
            <button
              onClick={() => onEnroll({ id: course.id, title: course.title })}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all mb-3 cursor-pointer"
              style={{ background: '#28C0F4' }}
            >
              Apply Now - Complete Enrollment Form
            </button>
            <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2"><Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-500" /> Instant access to all modules</div>
              <div className="flex items-center gap-2"><Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-500" /> Verifiable Certificate included</div>
              <div className="flex items-center gap-2"><Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-500" /> Direct tutor Q&A support</div>
            </div>
          </div>
        </div>
      </div>

      {/* PesaPal Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-gray-100">
            {/* Header with PesaPal Badge */}
            <div className="p-4 bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white text-[#1A4095] text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                  PESAPAL
                </div>
                <span className="text-xs font-bold">Secure Payment Gateway</span>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-white/80 hover:text-white">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon icon="lucide:check-circle" className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    PIN Prompt Sent!
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Reference ID: <strong className="text-gray-800">{paymentReference}</strong>
                    <br />
                    📱 SMS with PIN prompt sent to <strong>{phone}</strong>
                    <br />
                    💰 Please check your phone and enter PIN to authorize payment
                    <br />
                    📧 Receipt will be emailed to {email}.
                    <br />
                    <br />
                    <strong>Merchant Account:</strong> {method === 'momo' ? 'MTN: 0770613201' : method === 'airtel' ? 'Airtel: 0702524736' : 'Check SMS for details'}
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-3 rounded-xl bg-[#1A4095] text-white font-bold text-xs"
                  >
                    Close & Wait for SMS
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handlePayment}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Course Enrollment</div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">{course.title}</div>
                    </div>
                    <div className="text-base font-extrabold text-[#1A4095]">
                      UGX {course.price.toLocaleString()}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
                      <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. John"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Doe"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Select Payment Channel
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'momo', label: 'MTN MoMo', icon: 'lucide:smartphone', note: '0770613201' },
                        { id: 'airtel', label: 'Airtel Money', icon: 'lucide:phone-call', note: '0702524736' },
                        { id: 'card', label: 'Visa / Card', icon: 'lucide:credit-card', note: '' },
                        { id: 'bank', label: 'Bank Transfer', icon: 'lucide:building-2', note: '' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start gap-0.5 transition-all ${
                            method === m.id
                              ? 'border-[#1A4095] bg-blue-50 text-[#1A4095]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon icon={m.icon} className="w-4 h-4" />
                            {m.label}
                          </div>
                          {m.note && (
                            <span className="text-[10px] text-gray-500 font-normal">{m.note}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Mobile Number / Account *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0770123456"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed blue-btn-gradient-hover"
                    style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                  >
                    {paymentProcessing ? (
                      <>
                        <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>Pay UGX {course.price.toLocaleString()} via PesaPal</>
                    )}
                  </button>

                  <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
                    <Icon icon="lucide:shield-check" className="w-3.5 h-3.5 text-emerald-500" />
                    256-bit Encrypted | PesaPal API v3
                  </div>
                  <div className="text-center text-[10px] text-gray-500">
                    Merchant Accounts: Airtel (0702524736) | MTN (0770613201)
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FAQ PAGE (Dedicated Page) ─────────────────────────────────────────────────
function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState('All')

  const faqs = [
    {
      category: 'Enrollment & Access',
      q: 'How do I enroll and start learning a course?',
      a: 'Browse through our courses catalog, click "Enroll Now", and complete the checkout using PesaPal. You will receive immediate dashboard access and an SMS confirmation with your login details.',
    },
    {
      category: 'Payments',
      q: 'What payment methods are supported via PesaPal?',
      a: 'Through our official PesaPal integration, we accept MTN Mobile Money, Airtel Money, Visa, Mastercard, and direct bank transfers in Ugandan Shillings (UGX).',
    },
    {
      category: 'Live Classes',
      q: 'How do live online classes work?',
      a: 'Live classes are real-time sessions hosted on Google Meet, Zoom, and TikTok Live. Trainers demonstrate code live, review assignments, and answer questions directly.',
    },
    {
      category: 'Certificates',
      q: 'Are certificates verifiable by employers?',
      a: 'Yes! Upon 100% course completion and project submission, you earn a digital certificate equipped with a unique QR code and verification ID for employers.',
    },
    {
      category: 'Tutors & Support',
      q: 'Can I interact with my tutor during self-paced courses?',
      a: 'Absolutely. Every lesson includes a dedicated Q&A discussion tab where you can post questions and receive direct responses from your course tutor within 24 hours.',
    },
  ]

  const categories = ['All', 'Enrollment & Access', 'Payments', 'Live Classes', 'Certificates', 'Tutors & Support']

  const filtered = faqs.filter((f) => activeCategory === 'All' || f.category === activeCategory)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, rgba(26, 64, 149, 0.05) 0%, rgba(40, 192, 244, 0.05) 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#28C0F4] mb-2">Help Center</p>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm">Everything you need to know about Digtech Academy programs, payments, and certificates.</p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`text-xs px-4 py-2 rounded-full border font-bold transition-all ${
                activeCategory === c
                  ? 'bg-[#1A4095] text-white border-[#1A4095] shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-[#1A4095] hover:to-[#28C0F4] hover:text-white hover:border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {filtered.map((item, i) => (
            <div key={i} className="border-2 border-[#28C0F4]/20 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
              >
                <span>{item.q}</span>
                <Icon
                  icon={openIndex === i ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                  className="w-5 h-5 text-[#1A4095] flex-shrink-0 ml-4"
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t-2 border-[#28C0F4]/10 pt-3 bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── UNIFIED AUTH PAGE (Single Login with Role Selector) ──────────────────────
function LoginPage({
  onLoginSuccess,
  setFrame,
  initialMode = 'login',
}: {
  onLoginSuccess: (email: string, role: string, name: string) => void
  setFrame: (f: Frame) => void
  initialMode?: 'login' | 'register' | 'reset'
}) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode)
  const [accountType, setAccountType] = useState<'student' | 'tutor' | 'admin' | 'principal'>('student')
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  
  // Register fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerRole, setRegisterRole] = useState<'student' | 'tutor'>('student')
  
  // Reset password fields
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Password strength calculator
  const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong' | 'very-strong', label: string, color: string } => {
    if (!password) return { strength: 'weak', label: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++
    
    if (score <= 2) return { strength: 'weak', label: 'Weak', color: '#EF4444' }
    if (score === 3) return { strength: 'medium', label: 'Medium', color: '#F59E0B' }
    if (score === 4) return { strength: 'strong', label: 'Strong', color: '#10B981' }
    return { strength: 'very-strong', label: 'Very Strong', color: '#059669' }
  }
  
  const passwordStrength = getPasswordStrength(regPassword)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+?256|0)?[7][0-9]{8}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  const checkDuplicates = (email: string, phone: string) => {
    // Simulate checking for existing users
    const existingEmails = ['admin@digtechacademy.ug', 'test@example.com']
    const existingPhones = ['0770000000']
    
    if (existingEmails.includes(email.toLowerCase())) {
      return 'This email is already registered. Please login instead.'
    }
    
    if (existingPhones.includes(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'This phone number is already registered.'
    }
    
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!loginEmail || !loginPassword) {
      setError('Please fill in both email and password.')
      return
    }

    if (!validateEmail(loginEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      // Sign in with Supabase
      const { data, error: signInError } = await auth.signIn(loginEmail, loginPassword)
      
      if (signInError) {
        setError('Invalid email or password.')
        return
      }

      if (!data.user) {
        setError('Login failed. Please try again.')
        return
      }

      // Get user profile from database
      const { data: userData, error: userError } = await db.users.getById(data.user.id)
      
      if (userError || !userData) {
        setError('Unable to load user profile. Please contact support.')
        return
      }

      // Validate account type matches selected role
      if (userData.role !== accountType) {
        setError(`This email is registered as ${userData.role}. Please select the correct account type.`)
        // Sign out the user since role doesn't match
        await auth.signOut()
        return
      }

      // Check if account is active
      if (userData.status !== 'active') {
        setError(`Your account is ${userData.status}. Please contact support.`)
        await auth.signOut()
        return
      }

      // Update last login timestamp
      await db.users.update(data.user.id, { last_login: new Date().toISOString() })

      // Log the activity
      await logActivity(data.user.id, 'login', {
        role: userData.role,
        timestamp: new Date().toISOString()
      })

      setSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        onLoginSuccess(userData.email, userData.role, userData.full_name)
      }, 800)
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate all fields
    if (!firstName || !lastName || !regEmail || !regPhone || !regPassword || !confirmPass) {
      setError('Please fill in all required fields.')
      return
    }

    // Validate names (at least 2 characters)
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('First name and last name must be at least 2 characters.')
      return
    }

    // Validate email
    if (!validateEmail(regEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    // Validate phone
    if (!validatePhone(regPhone)) {
      setError('Invalid phone number. Use format: 0770123456')
      return
    }

    // Validate password strength
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (!/[A-Z]/.test(regPassword) || !/[a-z]/.test(regPassword) || !/[0-9]/.test(regPassword)) {
      setError('Password must contain uppercase, lowercase, and numbers.')
      return
    }

    // Check password match
    if (regPassword !== confirmPass) {
      setError('Passwords do not match.')
      return
    }

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await auth.signUp(
        regEmail,
        regPassword,
        {
          full_name: `${firstName} ${lastName}`,
          phone: regPhone,
          role: registerRole,
        }
      )

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.')
        } else {
          setError(signUpError.message || 'Registration failed. Please try again.')
        }
        return
      }

      if (!data.user) {
        setError('Registration failed. Please try again.')
        return
      }

      // Insert user profile into database
      const { error: insertError } = await db.users.create({
        id: data.user.id,
        email: regEmail,
        full_name: `${firstName} ${lastName}`,
        phone: regPhone,
        role: registerRole,
        status: 'active',
      })

      if (insertError) {
        console.error('Profile creation error:', insertError)
        // Continue anyway since auth account is created
      }

      // Log the activity
      await logActivity(data.user.id, 'registration', {
        role: registerRole,
        timestamp: new Date().toISOString()
      })

      // Success
      setSuccess('Account created successfully! Redirecting to dashboard...')
      setTimeout(() => {
        onLoginSuccess(regEmail, registerRole, `${firstName} ${lastName}`)
      }, 1500)
    } catch (err) {
      console.error('Registration error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateEmail(resetEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setResetSent(true)
    setTimeout(() => {
      setSuccess('Password reset link sent! Check your email.')
      setTimeout(() => {
        setMode('login')
        setResetSent(false)
        setSuccess('')
      }, 2000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-[#28C0F4]/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blue background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#28C0F4]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1A4095]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-md relative z-10 auth-container">
        {/* Logo */}
        <div className="text-center mb-6">
          <button onClick={() => setFrame('home')} className="inline-block">
            <img src="/images/Digtech Academy Logo.png" alt="Digtech Academy" className="h-10 w-auto object-contain mx-auto hover:scale-105 transition-transform" />
          </button>
        </div>

        {/* Animated Container */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#28C0F4]/30 overflow-hidden auth-form-slide" style={{ boxShadow: '0 20px 60px rgba(40, 192, 244, 0.25), 0 0 40px rgba(26, 64, 149, 0.1)' }}>
          {/* Mode Toggle Tabs */}
          <div className="flex border-b border-[#28C0F4]/20 bg-gradient-to-r from-blue-50/50 to-[#28C0F4]/5">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
                setSuccess('')
              }}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'text-[#1A4095] border-b-2 border-[#1A4095] bg-blue-50/30'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon icon="lucide:log-in" className="w-4 h-4 inline mr-1.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
                setSuccess('')
              }}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'text-[#1A4095] border-b-2 border-[#1A4095] bg-blue-50/30'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon icon="lucide:user-plus" className="w-4 h-4 inline mr-1.5" />
              Register
            </button>
          </div>

          <div className="p-8">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-fade-in-down">
                <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2 animate-fade-in-down">
                <Icon icon="lucide:check-circle" className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Welcome Back
                </h2>
                <p className="text-xs text-gray-500 mb-6">Select your role and sign in to continue</p>

                {/* Role Selector Dropdown */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Account Type</label>
                  <div className="relative">
                    <select
                      value={accountType}
                      onChange={(e) => {
                        setAccountType(e.target.value as 'student' | 'tutor' | 'admin' | 'principal')
                        setError('')
                      }}
                      className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input appearance-none bg-white cursor-pointer pr-10"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                      <option value="principal">Principal</option>
                    </select>
                    <Icon icon="lucide:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="user@digtechacademy.ug"
                      className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4095] transition-colors"
                      >
                        <Icon icon={showLoginPassword ? "lucide:eye-off" : "lucide:eye"} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="font-bold text-[#1A4095] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all auth-button"
                    style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                  >
                    Sign In to {accountType.charAt(0).toUpperCase() + accountType.slice(1)} Portal →
                  </button>
                </form>
              </div>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Create Account
                </h2>
                <p className="text-xs text-gray-500 mb-6">Join as a Student or Certified Tutor</p>

                {/* Role Selector: Student & Tutor only */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('student')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      registerRole === 'student' ? 'bg-white text-[#1A4095] shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Icon icon="lucide:graduation-cap" className="w-4 h-4" /> Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('tutor')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      registerRole === 'tutor' ? 'bg-white text-[#1A4095] shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Icon icon="lucide:user-check" className="w-4 h-4" /> Tutor
                  </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">First Name *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0770123456"
                      className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password *</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 8 chars, uppercase, lowercase, numbers"
                        className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-2.5 pr-12 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4095] transition-colors"
                      >
                        <Icon icon={showRegPassword ? "lucide:eye-off" : "lucide:eye"} className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {regPassword && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300"
                              style={{ 
                                width: passwordStrength.strength === 'weak' ? '25%' : 
                                       passwordStrength.strength === 'medium' ? '50%' : 
                                       passwordStrength.strength === 'strong' ? '75%' : '100%',
                                backgroundColor: passwordStrength.color
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold" style={{ color: passwordStrength.color }}>
                              {passwordStrength.label}
                            </span>
                            {(passwordStrength.strength === 'strong' || passwordStrength.strength === 'very-strong') && (
                              <Icon icon="lucide:check-circle" className="w-4 h-4" style={{ color: passwordStrength.color }} />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full border-2 border-[#28C0F4]/20 rounded-xl px-4 py-2.5 pr-12 text-sm outline-none focus:border-[#28C0F4] focus:ring-2 focus:ring-[#28C0F4]/20 transition-all auth-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4095] transition-colors"
                      >
                        <Icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!!success}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-60 auth-button"
                    style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                  >
                    Create {registerRole.charAt(0).toUpperCase() + registerRole.slice(1)} Account
                  </button>

                  <p className="text-[11px] text-gray-500 text-center">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </div>
            )}

            {/* Password Reset Form */}
            {mode === 'reset' && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Reset Password
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Enter your email and we'll send you a password reset link
                </p>

                {resetSent ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon icon="lucide:mail-check" className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Check Your Email</p>
                    <p className="text-xs text-gray-500">We've sent a password reset link to {resetEmail}</p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="user@digtechacademy.ug"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1A4095] focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all blue-btn-gradient-hover"
                      style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
                    >
                      Send Reset Link
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="w-full text-xs text-gray-600 hover:text-gray-900 font-semibold"
                    >
                      ← Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Note: Admin and Principal accounts can only be created by existing Principals</p>
        </div>
      </div>
    </div>
  )
}

// Keep RegisterPage for backward compatibility (now just redirects to LoginPage in register mode)
function RegisterPage({
  onRegisterSuccess,
  setFrame,
}: {
  onRegisterSuccess: (email: string, role: string, name: string) => void
  setFrame: (f: Frame) => void
}) {
  // This function sets the initial mode to 'register' so users see the registration form immediately
  return <LoginPage onLoginSuccess={onRegisterSuccess} setFrame={setFrame} initialMode="register" />
}

// ─── ADMIN DASHBOARD (With Success Stories Manager) ───────────────────────────
function AdminDashboard({
  testimonials,
  setTestimonials,
  onLogout,
}: {
  testimonials: SuccessStory[]
  setTestimonials: React.Dispatch<React.SetStateAction<SuccessStory[]>>
  onLogout: () => void
}) {
  const [tab, setTab] = useState<'overview' | 'stories' | 'withdrawals'>('overview')
  const [newStoryName, setNewStoryName] = useState('')
  const [newStoryRole, setNewStoryRole] = useState('')
  const [newStoryText, setNewStoryText] = useState('')

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStoryName || !newStoryText) return
    const newStory: SuccessStory = {
      id: Date.now(),
      name: newStoryName,
      role: newStoryRole || 'Academy Graduate',
      text: newStoryText,
      avatar: '/images/liveclass1.png',
      rating: 5,
    }
    setTestimonials([newStory, ...testimonials])
    setNewStoryName('')
    setNewStoryRole('')
    setNewStoryText('')
  }

  const handleDeleteStory = (id: number) => {
    setTestimonials(testimonials.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col sticky top-0 h-screen hidden md:flex p-5" style={{ background: 'linear-gradient(180deg, #1A4095 0%, #0d2556 100%)' }}>
        <div className="pb-4 border-b border-blue-400/20">
          <img src="/images/Digtech Academy Logo White.png" alt="Digtech Academy" className="h-8 w-auto object-contain" />
          <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-1">Admin Operations</div>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {[
            { id: 'overview', label: 'System Overview', icon: 'lucide:layout-dashboard' },
            { id: 'stories', label: 'Success Stories', icon: 'lucide:star' },
            { id: 'withdrawals', label: 'PesaPal Payouts', icon: 'lucide:banknote' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                tab === item.id ? 'bg-white/20 text-white shadow-lg backdrop-blur' : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
        >
          <Icon icon="lucide:log-out" className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {tab === 'overview' && (
          <div>
            <div className="bg-gradient-to-r from-[#1A4095] to-[#28C0F4] rounded-2xl p-6 mb-6 text-white shadow-lg">
              <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                System Analytics Overview
              </h1>
              <p className="text-blue-100 text-sm">Real-time performance metrics for DigiTech Academy</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Students', val: '5,248', color: '#1A4095', icon: 'lucide:users' },
                { label: 'Active Tutors', val: '48', color: '#28C0F4', icon: 'lucide:user-check' },
                { label: 'Revenue (PesaPal)', val: 'UGX 186M', color: '#10B981', icon: 'lucide:banknote' },
                { label: 'Success Stories', val: `${testimonials.length}`, color: '#F59E0B', icon: 'lucide:star' },
              ].map((s) => (
                <div key={s.label} className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.val}</div>
                    <Icon icon={s.icon} className="w-8 h-8 opacity-20" style={{ color: s.color }} />
                  </div>
                  <div className="text-xs text-gray-600 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stories' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1A4095] to-[#28C0F4] rounded-2xl p-6 text-white shadow-lg">
              <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Publish & Manage Student Success Stories
              </h1>
              <p className="text-blue-100 text-sm">Share inspiring student achievements with the world</p>
            </div>

            {/* Create Story Form */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Post New Student Testimonial</h3>
              <form onSubmit={handleAddStory} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={newStoryName}
                    onChange={(e) => setNewStoryName(e.target.value)}
                    placeholder="Student Full Name (e.g. Sandra Asiimwe)"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                  />
                  <input
                    type="text"
                    value={newStoryRole}
                    onChange={(e) => setNewStoryRole(e.target.value)}
                    placeholder="Current Job / Company (e.g. Data Lead at SafeBoda)"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  placeholder="Write the full success story or testimonial..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#1A4095]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#28C0F4] text-white font-bold text-xs hover:opacity-90 cursor-pointer shadow-sm"
                >
                  Publish Story to Homepage
                </button>
              </form>
            </div>

            {/* Stories List */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Published Testimonials ({testimonials.length})</h3>
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-gray-900">{t.name}</div>
                        <div className="text-[11px] text-gray-500">{t.role}</div>
                        <p className="text-xs text-gray-600 mt-1 max-w-xl italic">"{t.text}"</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStory(t.id)}
                      className="text-xs text-red-500 font-bold hover:underline p-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'withdrawals' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">PesaPal Payouts & Tutors Ledger</h2>
            <p className="text-xs text-gray-500">Connected to PesaPal API v3 (Live Environment).</p>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── PRINCIPAL DASHBOARD (Super Admin: Admin Management) ──────────────────────
function PrincipalDashboard({
  admins,
  setAdmins,
}: {
  admins: AdminUser[]
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>
}) {
  const [tab, setTab] = useState<'admins' | 'tutors' | 'certs'>('admins')
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [adminRole, setAdminRole] = useState('Course Operations Admin')

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminName || !adminEmail) return
    const newAdmin: AdminUser = {
      id: Date.now(),
      name: adminName,
      email: adminEmail,
      phone: adminPhone || '+256 700 000 000',
      role: adminRole,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setAdmins([...admins, newAdmin])
    setAdminName('')
    setAdminEmail('')
    setAdminPhone('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-100 p-5 hidden md:flex flex-col">
        <div className="pb-4 border-b border-gray-100">
          <img src="/images/Digtech Academy Logo.png" alt="Digtech Academy" className="h-8 w-auto object-contain" />
          <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-1">Super Admin / Principal</div>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {[
            { id: 'admins', label: 'Admin Accounts Provisioning', icon: 'lucide:shield-alert' },
            { id: 'tutors', label: 'Faculty & Tutors', icon: 'lucide:user-check' },
            { id: 'certs', label: 'Certificate Approvals', icon: 'lucide:award' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left ${
                tab === item.id ? 'bg-[#1A4095] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {tab === 'admins' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Principal Admin Provisioning Portal
            </h1>
            <p className="text-xs text-gray-500">
              Only the Principal (Super Admin) is authorized to create, configure, and deactivate Admin accounts.
            </p>

            {/* Create Admin Form */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Provision New Administrator</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Admin Full Name"
                    className="border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#1A4095]"
                  />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin.name@digtechacademy.ug"
                    className="border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#1A4095]"
                  />
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+256 700 000 000"
                    className="border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#1A4095]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1A4095] text-white font-bold text-xs hover:opacity-90"
                >
                  Create Admin Account
                </button>
              </form>
            </div>

            {/* List of Admins */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Configured Administrators ({admins.length})</h3>
              <div className="space-y-3">
                {admins.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{a.name}</div>
                      <div className="text-[11px] text-gray-500">{a.email} • {a.phone}</div>
                      <Badge color="blue">{a.role}</Badge>
                    </div>
                    <span className="text-[11px] text-gray-400">Created: {a.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── STUDENT & TUTOR DASHBOARDS & ABOUT & CONTACT ─────────────────────────────
// ─── USER PROFILE COMPONENT (Shared between Student & Tutor) ──────────────────
function UserProfile() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'student@digtechacademy.ug',
    phone: '0770123456',
    role: 'student',
    bio: 'Passionate learner exploring data science and web development.',
  })
  const [profileImage, setProfileImage] = useState('/images/liveclass3.png')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    // Simulate upload process
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      
      // Simulate API call delay
      setTimeout(() => {
        setProfileImage(result)
        setImagePreview(null)
        setUploading(false)
        setSuccessMessage('Profile picture updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    // Validate phone number format
    const phoneRegex = /^(\+?256|0)?[7][0-9]{8}$/
    if (!phoneRegex.test(profile.phone.replace(/[\s\-\(\)]/g, ''))) {
      alert('Please enter a valid Ugandan phone number (e.g., 0770123456)')
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profile.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Validate names
    if (profile.firstName.trim().length < 2 || profile.lastName.trim().length < 2) {
      alert('First name and last name must be at least 2 characters each')
      return
    }

    setSuccessMessage('Profile updated successfully!')
    setEditing(false)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          My Profile
        </h2>
        <button
          onClick={() => editing ? handleSaveProfile() : setEditing(true)}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-[#1A4095] text-white hover:opacity-90 transition-all"
        >
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2 animate-fade-in-down">
          <Icon icon="lucide:check-circle" className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="text-center">
              <Icon icon="lucide:camera" className="w-8 h-8 text-white mx-auto mb-1" />
              <span className="text-xs text-white font-bold">Change Photo</span>
            </div>
          </label>
        </div>
        
        {uploading && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Icon icon="lucide:loader-2" className="w-3 h-3 animate-spin" />
            Uploading image...
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-2">Click photo to upload (JPG/PNG, max 5MB)</p>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            disabled={!editing}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            disabled={!editing}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            disabled={!editing}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            disabled={!editing}
            placeholder="0770123456"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
          Bio / About Me
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          disabled={!editing}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#1A4095] disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      {editing && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                setSuccessMessage('Account deletion requested. Please contact support for final confirmation.')
                setTimeout(() => setSuccessMessage(''), 3000)
              }
            }}
            className="text-xs font-bold text-red-600 hover:text-red-800 px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
          >
            <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 inline mr-1.5" />
            Delete Account
          </button>
        </div>
      )}
    </div>
  )
}

function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Student Learning Portal
      </h1>
      <p className="text-xs text-gray-500 mb-8">Access your enrolled courses and manage your profile</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* User Profile */}
        <div className="md:col-span-1">
          <UserProfile />
        </div>

        {/* Enrolled Courses */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              My Enrolled Courses
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <CourseCard course={INITIAL_COURSES[0]} onClick={() => {}} onEnroll={() => {}} />
              <CourseCard course={INITIAL_COURSES[1]} onClick={() => {}} onEnroll={() => {}} />
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              My Certificates
            </h2>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900">Python for Data Science</div>
                <div className="text-[11px] text-gray-500">Issued: Jan 15, 2024 • Expires: Never</div>
              </div>
              <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1A4095] text-white hover:opacity-90">
                View Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TutorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'modules' | 'fees' | 'students' | 'exams' | 'marks' | 'certificates' | 'links'>('overview')
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [showExamModal, setShowExamModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [tutorId, setTutorId] = useState<string>('')

  // Load tutor ID and courses on mount
  useEffect(() => {
    loadTutorData()
  }, [])

  const loadTutorData = async () => {
    try {
      // Get current user
      const { user } = await auth.getUser()
      if (user) {
        setTutorId(user.id)
        await loadCourses(user.id)
      }
    } catch (error) {
      console.error('Error loading tutor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async (userId: string) => {
    try {
      const { data, error } = await db.courses.getAll()
      if (error) {
        console.error('Error loading courses:', error)
        return
      }
      // Filter courses by tutor
      const tutorCourses = data?.filter((c: any) => c.tutor_id === userId) || []
      setCourses(tutorCourses)
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  const handleCourseSuccess = () => {
    loadCourses(tutorId)
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse(course)
    setShowCourseModal(true)
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    
    try {
      const { error } = await db.courses.delete(courseId)
      if (error) {
        alert('Failed to delete course: ' + error.message)
        return
      }
      loadCourses(tutorId)
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course')
    }
  }
  
  const handleCloseCourseModal = () => {
    setShowCourseModal(false)
    setEditingCourse(null)
  }
  
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)' }}>
      {/* Top Header */}
      <div className="sticky top-0 z-40 shadow-sm" style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/Digtech Academy Logo White.png" alt="Digtech" className="h-10 w-auto" />
              <div>
                <div className="text-xs font-bold text-white">Tutor Dashboard</div>
                <div className="text-[10px] text-blue-100">Content & Student Management</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-white">Grace Nakato</div>
                <div className="text-[10px] text-blue-100">Verified Tutor</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold border-2 border-white/30">
                GN
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur border-b border-blue-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview', icon: 'lucide:layout-dashboard' },
              { id: 'courses', label: 'My Courses', icon: 'lucide:book-open' },
              { id: 'modules', label: 'Modules', icon: 'lucide:layers' },
              { id: 'fees', label: 'Fee Management', icon: 'lucide:dollar-sign' },
              { id: 'students', label: 'Students', icon: 'lucide:users' },
              { id: 'exams', label: 'Exams & Tests', icon: 'lucide:file-text' },
              { id: 'marks', label: 'Marks & Grades', icon: 'lucide:award' },
              { id: 'certificates', label: 'Certificates', icon: 'lucide:badge-check' },
              { id: 'links', label: 'Live Links', icon: 'lucide:video' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1A4095] to-[#28C0F4] rounded-2xl p-6 text-white shadow-lg">
              <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Welcome Back, Grace!
              </h1>
              <p className="text-sm text-blue-100">Here's what's happening with your courses today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-[#28C0F4]/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Icon icon="lucide:book-open" className="w-6 h-6 text-[#1A4095]" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#1A4095]">6</div>
                    <div className="text-xs text-gray-500">Active Courses</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#28C0F4]/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Icon icon="lucide:users" className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-green-600">548</div>
                    <div className="text-xs text-gray-500">Total Students</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#28C0F4]/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Icon icon="lucide:clock" className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-yellow-600">12</div>
                    <div className="text-xs text-gray-500">Pending Approvals</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#28C0F4]/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Icon icon="lucide:dollar-sign" className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-purple-600">12.5M</div>
                    <div className="text-xs text-gray-500">Total Earnings (UGX)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setActiveTab('courses')} className="p-4 rounded-xl border-2 border-[#28C0F4]/30 hover:bg-blue-50 transition-all">
                  <Icon icon="lucide:plus-circle" className="w-8 h-8 text-[#1A4095] mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-900">Create Course</div>
                </button>
                <button onClick={() => setActiveTab('modules')} className="p-4 rounded-xl border-2 border-[#28C0F4]/30 hover:bg-blue-50 transition-all">
                  <Icon icon="lucide:layers" className="w-8 h-8 text-[#1A4095] mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-900">Add Module</div>
                </button>
                <button onClick={() => setActiveTab('exams')} className="p-4 rounded-xl border-2 border-[#28C0F4]/30 hover:bg-blue-50 transition-all">
                  <Icon icon="lucide:file-plus" className="w-8 h-8 text-[#1A4095] mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-900">Create Exam</div>
                </button>
                <button onClick={() => setActiveTab('students')} className="p-4 rounded-xl border-2 border-[#28C0F4]/30 hover:bg-blue-50 transition-all">
                  <Icon icon="lucide:user-plus" className="w-8 h-8 text-[#1A4095] mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-900">Add Student</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  My Courses
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage your course content and settings</p>
              </div>
              <button 
                onClick={() => setShowCourseModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white font-bold text-sm hover:shadow-lg transition-all"
              >
                <Icon icon="lucide:plus" className="w-4 h-4" />
                Create New Course
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Icon icon="lucide:loader-2" className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-500">Loading your courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-2 border-blue-100 text-center">
                <Icon icon="lucide:book-open" className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h2>
                <p className="text-sm text-gray-500 mb-6">Create your first course to start teaching!</p>
                <button 
                  onClick={() => setShowCourseModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white font-bold text-sm"
                >
                  Create First Course
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl border-2 border-[#28C0F4]/30 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                    <div className="relative">
                      <img 
                        src={course.image_url || '/images/liveclass1.png'} 
                        alt={course.title} 
                        className="w-full h-40 object-cover" 
                      />
                      {course.status === 'draft' && (
                        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Draft
                        </span>
                      )}
                      {course.status === 'published' && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Icon icon="lucide:users" className="w-3 h-3" />
                          {course.enrollments_count || 0} students
                        </span>
                        <span className="font-bold text-blue-600">
                          UGX {(course.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditCourse(course)}
                          className="flex-1 py-2 px-3 rounded-lg bg-[#1A4095] text-white text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1"
                        >
                          <Icon icon="lucide:edit" className="w-3 h-3" />
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCourse(course)
                            setActiveTab('modules')
                          }}
                          className="flex-1 py-2 px-3 rounded-lg border-2 border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-1"
                        >
                          <Icon icon="lucide:layers" className="w-3 h-3" />
                          Modules
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="py-2 px-3 rounded-lg border-2 border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-all"
                        >
                          <Icon icon="lucide:trash-2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other tabs with placeholder content */}
        {activeTab === 'modules' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:layers" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Module Management</h2>
            <p className="text-sm text-gray-500 mb-4">Create and manage sub-courses/modules under your main courses</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              Create First Module
            </button>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:dollar-sign" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Fee Management</h2>
            <p className="text-sm text-gray-500 mb-4">Set, update, and lock course and module fees</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              Configure Fees
            </button>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Student Management</h2>
            <p className="text-sm text-gray-500 mb-4">Add, approve, and manage your students</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              View Students
            </button>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:file-text" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Exam System</h2>
            <p className="text-sm text-gray-500 mb-4">Create exams, set time limits, and track submissions</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              Create Exam
            </button>
          </div>
        )}

        {activeTab === 'marks' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:award" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Marks & Grading</h2>
            <p className="text-sm text-gray-500 mb-4">Enter marks, calculate grades, and view analytics</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              Grade Students
            </button>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:badge-check" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Certificate Management</h2>
            <p className="text-sm text-gray-500 mb-4">Generate and issue certificates to students</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              Issue Certificate
            </button>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <Icon icon="lucide:video" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Live Class Links</h2>
            <p className="text-sm text-gray-500 mb-4">Add and manage Google Meet, Zoom, and YouTube links</p>
            <button className="px-6 py-3 rounded-xl bg-[#1A4095] text-white font-bold text-sm">
              Add Link
            </button>
          </div>
        )}

      </div>

      {/* Course Form Modal */}
      {showCourseModal && (
        <CourseForm
          onClose={handleCloseCourseModal}
          onSuccess={handleCourseSuccess}
          editingCourse={editingCourse}
          tutorId={tutorId}
        />
      )}
    </div>
  )
}

function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        About Digtech Academy
      </h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        Digtech Academy is Uganda's flagship technology learning hub, located in Grand West Arcade, Mbarara City. We empower African talent with practical, real-world skills in software engineering, data science, cybersecurity, and creative design.
      </p>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Contact Digtech Academy
      </h1>
      <div className="contact-box-animated space-y-6 text-sm text-gray-700">
        <div className="text-center">
          <p className="font-bold text-lg text-[#1A4095] mb-2">Campus Location</p>
          <p>Level 2 Grand West Arcade</p>
          <p>High Street Mbarara City - Uganda</p>
          <a 
            href="https://maps.google.com/?q=Level+2+Grand+West+Arcade+Mbarara" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-[#28C0F4] hover:text-[#1A4095] font-semibold transition-colors"
          >
            <Icon icon="lucide:map-pin" className="w-4 h-4" />
            View on Map
          </a>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-[#1A4095] mb-2">Phone</p>
          <a href="tel:+256770613201" className="text-[#28C0F4] hover:text-[#1A4095] font-semibold transition-colors">
            +256 (0) 770 613 201
          </a>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-[#1A4095] mb-2">Email</p>
          <a href="mailto:info@digtechsolutionshub.com" className="text-[#28C0F4] hover:text-[#1A4095] font-semibold transition-colors">
            info@digtechsolutionshub.com
          </a>
        </div>
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="font-bold text-sm text-[#1A4095] mb-3">Connect With Us</p>
          <div className="flex justify-center gap-4">
            <a href="https://facebook.com/digtechacademy" target="_blank" rel="noopener noreferrer" className="text-[#28C0F4] hover:text-[#1A4095] transition-colors">
              <Icon icon="lucide:facebook" className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/digtechacademy" target="_blank" rel="noopener noreferrer" className="text-[#28C0F4] hover:text-[#1A4095] transition-colors">
              <Icon icon="lucide:twitter" className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/digtechacademy" target="_blank" rel="noopener noreferrer" className="text-[#28C0F4] hover:text-[#1A4095] transition-colors">
              <Icon icon="lucide:instagram" className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/company/digtechacademy" target="_blank" rel="noopener noreferrer" className="text-[#28C0F4] hover:text-[#1A4095] transition-colors">
              <Icon icon="lucide:linkedin" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [frame, setFrame] = useState<Frame>('home')
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; name?: string } | null>(null)
  const [testimonials, setTestimonials] = useState<SuccessStory[]>(INITIAL_TESTIMONIALS)
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS)
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false)
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<{ id: number; title: string } | undefined>(undefined)

  // Check for existing Supabase session on app load
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await auth.getSession()
      
      if (session?.user) {
        // Get user profile from database
        const { data: userData, error } = await db.users.getById(session.user.id)
        
        if (userData && !error) {
          setCurrentUser({
            email: userData.email,
            role: userData.role,
            name: userData.full_name
          })
          
          // Update last login
          await db.users.update(session.user.id, { last_login: new Date().toISOString() })
        }
      }
    }
    
    checkSession()
  }, [])

  const handleLoginSuccess = (email: string, role: string, name: string) => {
    setCurrentUser({ email, role, name })
    if (role === 'admin') setFrame('admin-dashboard')
    else if (role === 'tutor') setFrame('tutor-dashboard')
    else if (role === 'principal') setFrame('principal-dashboard')
    else setFrame('student-dashboard')
  }

  const handleLogout = async () => {
    // Sign out from Supabase
    await auth.signOut()
    setCurrentUser(null)
    setFrame('home')
  }

  const handleEnrollClick = (course?: { id: number; title: string }) => {
    // If user is not logged in, redirect to login/register
    if (!currentUser) {
      setFrame('login')
      return
    }
    
    // Open enrollment form
    setSelectedCourseForEnrollment(course)
    setShowEnrollmentForm(true)
  }

  const handleEnrollmentSuccess = () => {
    setShowEnrollmentForm(false)
    setSelectedCourseForEnrollment(undefined)
    alert('Application submitted successfully! We\'ll review your application and contact you within 24-48 hours.')
  }

  const handleEnrollmentClose = () => {
    setShowEnrollmentForm(false)
    setSelectedCourseForEnrollment(undefined)
  }

  const isFullDashboard = ['admin-dashboard', 'principal-dashboard'].includes(frame)

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      {!isFullDashboard && (
        <PublicNav
          frame={frame}
          setFrame={setFrame}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <div className="flex-1">
        {frame === 'home' && <HomePage setFrame={setFrame} testimonials={testimonials} onEnroll={handleEnrollClick} />}
        {frame === 'courses' && <CoursesPage setFrame={setFrame} onEnroll={handleEnrollClick} />}
        {frame === 'course-detail' && <CourseDetailPage onEnroll={handleEnrollClick} />}
        {frame === 'live-courses' && <LiveCoursesPage />}
        {frame === 'about' && <AboutPage />}
        {frame === 'contact' && <ContactPage />}
        {frame === 'faq' && <FaqPage />}
        {frame === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} setFrame={setFrame} />}
        {frame === 'register' && <RegisterPage onRegisterSuccess={handleLoginSuccess} setFrame={setFrame} />}
        {frame === 'admin-dashboard' && (
          <AdminDashboard
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            onLogout={handleLogout}
          />
        )}
        {frame === 'principal-dashboard' && (
          <PrincipalDashboard admins={admins} setAdmins={setAdmins} />
        )}
        {frame === 'student-dashboard' && <StudentDashboard />}
        {frame === 'tutor-dashboard' && <TutorDashboard />}
      </div>

      {!isFullDashboard && <Footer setFrame={setFrame} />}

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <EnrollmentForm
          onClose={handleEnrollmentClose}
          onSuccess={handleEnrollmentSuccess}
          preSelectedCourse={selectedCourseForEnrollment}
        />
      )}
    </div>
  )
}
