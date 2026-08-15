import { useState } from 'react'
import { Icon } from '@iconify/react'

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
    image: '/images/pexels-photo-3183150.jpeg',
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
    image: '/images/pexels-photo-3184339.jpeg',
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
    image: '/images/pexels-photo-3184291.jpeg',
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
    image: '/images/pexels-photo-3184360.jpeg',
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
    image: '/images/pexels-photo-3183197.jpeg',
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
    image: '/images/pexels-photo-3771511.jpeg',
    free: false,
  },
]

const TUTORS = [
  { name: 'Grace Nakato', specialty: 'Data Science', students: 548, rating: 4.9, avatar: '/images/pexels-photo-12293164.jpeg' },
  { name: 'David Ssekandi', specialty: 'Web Development', students: 312, rating: 4.8, avatar: '/images/pexels-photo-34786947.jpeg' },
  { name: 'Ronald Kato', specialty: 'Digital Marketing', students: 274, rating: 4.6, avatar: '/images/pexels-photo-35638373.jpeg' },
  { name: 'Peter Musoke', specialty: 'Cybersecurity', students: 201, rating: 4.8, avatar: '/images/pexels-photo-3184360.jpeg' },
  { name: 'Amina Nalule', specialty: 'UI/UX Design', students: 189, rating: 4.7, avatar: '/images/pexels-photo-36338866.jpeg' },
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
    platform: 'TikTok Live',
    platformIcon: 'logos:tiktok-icon',
    joinLink: 'https://www.tiktok.com/live',
    badgeColor: 'purple',
  },
]

const INITIAL_TESTIMONIALS: SuccessStory[] = [
  {
    id: 1,
    name: 'Sarah Namutebi',
    text: 'Digtech Academy transformed my career completely. I went from zero coding knowledge to landing a junior developer job in Kampala in 6 months.',
    role: 'Junior Developer at Tecno Uganda',
    avatar: '/images/pexels-photo-8384894.jpeg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Brian Odhiambo',
    text: 'The Data Science course was exceptionally practical. Every project directly matched what I now do daily at work. Worth every shilling!',
    role: 'Data Analyst at MTN Uganda',
    avatar: '/images/pexels-photo-33128556.jpeg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Patricia Auma',
    text: 'Flexible learning that fit my busy schedule. I completed the UI/UX course in 4 weeks and immediately started winning international freelance clients.',
    role: 'Freelance Product Designer',
    avatar: '/images/pexels-photo-33128558.jpeg',
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
}: {
  course: typeof INITIAL_COURSES[0]
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-lift transition-all cursor-pointer group animate-fade-in-up flex flex-col justify-between"
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
          className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          style={{ background: '#28C0F4' }}
        >
          Enroll Now
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
            src="/digitechlogo.png"
            alt="Digtech Academy"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
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
                className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all shadow-sm hover:opacity-90 flex items-center gap-2 hover:scale-105 cursor-pointer"
                style={{ background: '#1A4095' }}
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
                className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105 shadow-sm cursor-pointer"
                style={{ background: '#1A4095' }}
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
                  className="w-full text-xs font-bold py-3 rounded-xl text-white flex items-center justify-center gap-1.5"
                  style={{ background: '#1A4095' }}
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
                  className="w-full text-xs font-bold py-2.5 rounded-xl text-white"
                  style={{ background: '#1A4095' }}
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
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Socials */}
        <div className="space-y-4">
          <div className="flex items-center">
            <img
              src="/digitechlogo.png"
              alt="Digtech Academy"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
            Uganda's premier digital skills academy. Practical, tutor-led courses in tech, business, and trades — learn on any connection, pay in UGX via PesaPal.
          </p>
          <div className="pt-2">
            <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">Connect With Us</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: 'lucide:facebook', href: 'https://facebook.com/digtechacademy', label: 'Facebook' },
                { icon: 'lucide:instagram', href: 'https://instagram.com/digtechacademy', label: 'Instagram' },
                { icon: 'lucide:twitter', href: 'https://x.com/digtechacademy', label: 'X (Twitter)' },
                { icon: 'mdi:tiktok', href: 'https://tiktok.com/@digtechacademy', label: 'TikTok' },
                { icon: 'lucide:linkedin', href: 'https://linkedin.com/company/digtechacademy', label: 'LinkedIn' },
                { icon: 'lucide:youtube', href: 'https://youtube.com/@digtechacademy', label: 'YouTube' },
                { icon: 'mdi:whatsapp', href: 'https://wa.me/256770613201', label: 'WhatsApp' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#1A4095] hover:scale-110 transition-all shadow-sm"
                >
                  <Icon icon={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gray-900 font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setFrame('home')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('courses')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                Browse Courses
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('live-courses')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                Live Classes
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('about')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                About Academy
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('faq')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => setFrame('contact')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                Contact & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Course Categories */}
        <div>
          <h4 className="text-gray-900 font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Course Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            {['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Cybersecurity', 'Mobile App Development'].map((cat) => (
              <li key={cat}>
                <button onClick={() => setFrame('courses')} className="text-gray-600 hover:text-[#1A4095] transition-colors">
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Admin Only Link */}
        <div>
          <h4 className="text-gray-900 font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Support & Academy Desk
          </h4>
          <ul className="space-y-3 text-xs text-gray-600">
            <li className="flex items-start gap-2.5">
              <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#1A4095] flex-shrink-0 mt-0.5" />
              <span>Level 2 Grand West Arcade, High Street Mbarara City - Uganda</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon icon="lucide:phone" className="w-4 h-4 text-[#1A4095] flex-shrink-0" />
              <a href="tel:+256770613201" className="hover:underline">+256 (0) 770 613 201</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon icon="lucide:mail" className="w-4 h-4 text-[#1A4095] flex-shrink-0" />
              <a href="mailto:info@digtechsolutionshub.com" className="hover:underline">info@digtechsolutionshub.com</a>
            </li>
            <li className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setFrame('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A4095] hover:text-[#28C0F4] transition-colors"
              >
                <Icon icon="lucide:shield-check" className="w-4 h-4" />
                Admin Portal Login
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="rounded-2xl overflow-hidden border border-gray-200 h-44 shadow-sm">
          <iframe
            src="https://www.google.com/maps?ll=-0.606781,30.661901&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=8763999400868403491"
            className="h-full w-full border-0"
            loading="lazy"
            title="Digtech Academy Mbarara Location"
          />
        </div>
      </div>

      {/* Automatic Year Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© {new Date().getFullYear()} Digtech Academy. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <span>Official Payment Partner:</span>
          <span className="font-bold text-[#1A4095]">PesaPal Payments Uganda</span>
        </p>
      </div>
    </footer>
  )
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({
  setFrame,
  testimonials,
}: {
  setFrame: (f: Frame) => void
  testimonials: SuccessStory[]
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
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
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
                  className="text-white text-xs font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
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
            <div className="relative">
              <img
                src="/images/pexels-photo-3184339.jpeg"
                alt="Students learning tech"
                className="rounded-3xl shadow-2xl border-4 border-white/20 object-cover w-full h-[420px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icon icon="lucide:award" className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Verified Certificates</div>
                    <div className="text-xs text-gray-500">Recognized by Top Employers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
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
                className="bg-white p-5 rounded-2xl border border-gray-100 text-center hover-lift transition-all group cursor-pointer shadow-sm"
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
              <CourseCard key={c.id} course={c} onClick={() => setFrame('course-detail')} />
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories (Admin Managed) */}
      <section
        style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }}
        className="py-20 text-white"
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
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Icon key={i} icon="lucide:star" className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#28C0F4]" />
                  <div>
                    <div className="font-bold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-white/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── COURSES PAGE ──────────────────────────────────────────────────────────────
function CoursesPage({ setFrame }: { setFrame: (f: Frame) => void }) {
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} onClick={() => setFrame('course-detail')} />
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

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {LIVE_COURSES.map((lc) => (
          <div
            key={lc.id}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
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
                    className="text-xs font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm cursor-pointer"
                    style={{ background: '#1A4095' }}
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
                  className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md mt-2"
                  style={{ background: '#1A4095' }}
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
function CourseDetailPage() {
  const course = INITIAL_COURSES[0]
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'momo' | 'airtel' | 'card' | 'bank'>('momo')

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
              onClick={() => {
                setShowPaymentModal(true)
                setPaymentSuccess(false)
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all mb-3 cursor-pointer"
              style={{ background: '#28C0F4' }}
            >
              Enroll with PesaPal
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
                    Payment Successful!
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Reference ID: <strong className="text-gray-800">PESA-UG-{Math.floor(100000 + Math.random() * 900000)}</strong>
                    <br />
                    Confirmation SMS dispatched to {phone || '+256 770 613 201'}.
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-3 rounded-xl bg-[#1A4095] text-white font-bold text-xs"
                  >
                    Start Learning Now
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setPaymentSuccess(true)
                  }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Course Enrollment</div>
                      <div className="text-xs font-bold text-gray-900">{course.title}</div>
                    </div>
                    <div className="text-base font-extrabold text-[#1A4095]">
                      UGX {course.price.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Select Payment Channel
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'momo', label: 'MTN MoMo', icon: 'lucide:smartphone' },
                        { id: 'airtel', label: 'Airtel Money', icon: 'lucide:phone-call' },
                        { id: 'card', label: 'Visa / Card', icon: 'lucide:credit-card' },
                        { id: 'bank', label: 'Bank Transfer', icon: 'lucide:building-2' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                            method === m.id
                              ? 'border-[#1A4095] bg-blue-50 text-[#1A4095]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon icon={m.icon} className="w-4 h-4" />
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Mobile Money / Account Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0770 000 000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all mt-2"
                    style={{ background: '#1A4095' }}
                  >
                    Pay UGX {course.price.toLocaleString()} via PesaPal
                  </button>

                  <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
                    <Icon icon="lucide:shield-check" className="w-3.5 h-3.5 text-emerald-500" />
                    256-bit Encrypted PesaPal Consumer API
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
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filtered.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span>{item.q}</span>
              <Icon
                icon={openIndex === i ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                className="w-5 h-5 text-[#1A4095] flex-shrink-0 ml-4"
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── LOGIN PORTAL (Unified with Defined Roles) ────────────────────────────────
function LoginPage({
  onLoginSuccess,
  setFrame,
}: {
  onLoginSuccess: (email: string, role: string, name: string) => void
  setFrame: (f: Frame) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'tutor' | 'admin'>('student')
  const [error, setError] = useState('')

  const handleQuickDemo = (demoRole: 'admin' | 'tutor' | 'student') => {
    setRole(demoRole)
    if (demoRole === 'admin') {
      setEmail('admin@digtechacademy.ug')
      setPassword('Digtech@2024')
    } else if (demoRole === 'tutor') {
      setEmail('tutor@digtechacademy.ug')
      setPassword('Tutor@2024')
    } else {
      setEmail('student@digtechacademy.ug')
      setPassword('Student@2024')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    if (role === 'admin' && email === 'admin@digtechacademy.ug' && password !== 'Digtech@2024') {
      setError('Invalid admin credentials. Use admin@digtechacademy.ug / Digtech@2024')
      return
    }

    onLoginSuccess(email, role, role === 'admin' ? 'System Administrator' : 'User')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Logo only - strictly without repeating text */}
        <div className="text-center mb-6">
          <button onClick={() => setFrame('home')} className="inline-block">
            <img src="/digitechlogo.png" alt="Digtech Academy" className="h-10 w-auto object-contain mx-auto" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Portal Sign In
          </h1>
          <p className="text-xs text-gray-500 mt-1">Select your account role to continue</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {(['student', 'tutor', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r)
                setError('')
              }}
              className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === r ? 'bg-white text-[#1A4095] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon
                icon={r === 'admin' ? 'lucide:shield' : r === 'tutor' ? 'lucide:user-check' : 'lucide:graduation-cap'}
                className="w-3.5 h-3.5"
              />
              {r}
            </button>
          ))}
        </div>

        {/* Demo Auto-fill Helper */}
        <div className="mb-5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-blue-950 block capitalize">Demo {role} Access</span>
            <span className="text-[11px] text-blue-700">{role}@digtechacademy.ug</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo(role)}
            className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#1A4095] text-white hover:opacity-90"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@digtechacademy.ug"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A4095]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md transition-all mt-2"
            style={{ background: '#1A4095' }}
          >
            Sign In to {role.toUpperCase()} Portal →
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Need an account?{' '}
          <button onClick={() => setFrame('register')} className="font-bold text-[#1A4095] hover:underline">
            Register as Student or Tutor
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── REGISTRATION PAGE (Students & Tutors) ────────────────────────────────────
function RegisterPage({
  onRegisterSuccess,
  setFrame,
}: {
  onRegisterSuccess: (email: string, role: string, name: string) => void
  setFrame: (f: Frame) => void
}) {
  const [role, setRole] = useState<'student' | 'tutor'>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPass) {
      setError('Passwords do not match.')
      return
    }
    onRegisterSuccess(email, role, name)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Logo only - strictly without repeating text */}
        <div className="text-center mb-6">
          <button onClick={() => setFrame('home')} className="inline-block">
            <img src="/digitechlogo.png" alt="Digtech Academy" className="h-10 w-auto object-contain mx-auto" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Create Your Account
          </h1>
          <p className="text-xs text-gray-500 mt-1">Join Digtech Academy as a Student or Certified Tutor</p>
        </div>

        {/* Role Selector: Student & Tutor only */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'student' ? 'bg-white text-[#1A4095] shadow-sm' : 'text-gray-500'
            }`}
          >
            <Icon icon="lucide:graduation-cap" className="w-4 h-4" /> Student Account
          </button>
          <button
            type="button"
            onClick={() => setRole('tutor')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'tutor' ? 'bg-white text-[#1A4095] shadow-sm' : 'text-gray-500'
            }`}
          >
            <Icon icon="lucide:user-check" className="w-4 h-4" /> Tutor Account
          </button>
        </div>

        <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800 flex items-center gap-1.5">
          <Icon icon="lucide:info" className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Admin accounts are provisioned exclusively by the Academy Principal.</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Mukisa"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#1A4095]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#1A4095]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+256 700 000 000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#1A4095]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1A4095]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Confirm</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1A4095]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md transition-all mt-2"
            style={{ background: '#1A4095' }}
          >
            Create {role.toUpperCase()} Account →
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Already registered?{' '}
          <button onClick={() => setFrame('login')} className="font-bold text-[#1A4095] hover:underline">
            Sign In here
          </button>
        </div>
      </div>
    </div>
  )
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
      avatar: '/images/pexels-photo-8384894.jpeg',
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex p-5">
        <div className="pb-4 border-b border-gray-100">
          <img src="/digitechlogo.png" alt="Digtech Academy" className="h-8 w-auto object-contain" />
          <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mt-1">Admin Operations</div>
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
                tab === item.id ? 'bg-[#1A4095] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
        >
          <Icon icon="lucide:log-out" className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              System Analytics Overview
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Students', val: '5,248', color: '#1A4095' },
                { label: 'Active Tutors', val: '48', color: '#28C0F4' },
                { label: 'Revenue (PesaPal)', val: 'UGX 186M', color: '#10B981' },
                { label: 'Success Stories', val: `${testimonials.length}`, color: '#F59E0B' },
              ].map((s) => (
                <div key={s.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stories' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Publish & Manage Student Success Stories
            </h1>

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
          <img src="/digitechlogo.png" alt="Digtech Academy" className="h-8 w-auto object-contain" />
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
function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Student Learning Portal
      </h1>
      <p className="text-xs text-gray-500 mb-8">Access your enrolled courses and verifiable certificates</p>
      <div className="grid md:grid-cols-2 gap-6">
        <CourseCard course={INITIAL_COURSES[0]} onClick={() => {}} />
      </div>
    </div>
  )
}

function TutorDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Tutor Studio & Curriculum
      </h1>
      <p className="text-xs text-gray-500 mb-8">Manage course modules, grade assignments, and request PesaPal payouts</p>
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
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Contact Digtech Academy
      </h1>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs text-gray-600">
        <p><strong>Campus Location:</strong> Level 2 Grand West Arcade, High Street Mbarara City - Uganda</p>
        <p><strong>Phone:</strong> +256 (0) 770 613 201</p>
        <p><strong>Email:</strong> info@digtechsolutionshub.com</p>
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

  const handleLoginSuccess = (email: string, role: string, name: string) => {
    setCurrentUser({ email, role, name })
    if (role === 'admin') setFrame('admin-dashboard')
    else if (role === 'tutor') setFrame('tutor-dashboard')
    else if (role === 'principal') setFrame('principal-dashboard')
    else setFrame('student-dashboard')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setFrame('home')
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
        {frame === 'home' && <HomePage setFrame={setFrame} testimonials={testimonials} />}
        {frame === 'courses' && <CoursesPage setFrame={setFrame} />}
        {frame === 'course-detail' && <CourseDetailPage />}
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
    </div>
  )
}
