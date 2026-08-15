import { useState } from 'react'
import { Icon } from '@iconify/react'
import { LocationIcon, PhoneIcon, EmailIcon, ClockIcon, MapIcon, CalendarIcon, TimerIcon, GlobeIcon, TrophyIcon, CheckCircleIcon, BarChartIcon, FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, MapPinIcon, MailIcon, UsersIcon, UserCheckIcon, DollarSignIcon, TrendingUpIcon, FileTextIcon, GraduationCapIcon, LayoutDashboardIcon, BookOpenIcon, AwardIcon, RadioIcon, ShieldIcon, SettingsIcon, PlusIcon, TrashIcon, ChevronLeftIcon, StarIcon, ExternalLinkIcon, GripVerticalIcon, ChevronDownIcon, ChevronUpIcon, XIcon, MenuIcon, LogOutIcon, LockIcon, ShieldAlertIcon, UploadCloudIcon, HomeIcon, BookMarkedIcon, VideoIcon, InfoIcon, PlayIcon, BanknoteIcon, UserCircleIcon, Building2Icon, MessageCircleIcon, SearchIcon, FilterIcon, ShoppingCartIcon, HeartIcon, Share2Icon, DownloadIcon, UploadIcon, EditIcon, Trash2Icon, CopyIcon, EyeIcon, EyeOffIcon, ChevronRightIcon, ChevronUpIconAlt, ChevronDownIconAlt, MoreVerticalIcon, MoreHorizontalIcon, RefreshCwIcon, RotateCcwIcon, MaximizeIcon, MinimizeIcon, XCircleIcon, CheckIcon, AlertCircleIcon, AlertTriangleIcon, InfoIconAlt, HelpCircleIcon, QuestionMarkCircleIcon, BellIcon, BellOffIcon, Volume2Icon, VolumeXIcon, MicIcon, MicOffIcon, VideoIconAlt, VideoOffIcon, MonitorIcon, SmartphoneIcon, TabletIcon, LaptopIcon, DesktopIcon, WifiIcon, WifiOffIcon, BluetoothIcon, UsbIcon, BatteryIcon, BatteryChargingIcon, ZapIcon, SunIcon, MoonIcon, CloudIcon, CloudRainIcon, CloudSnowIcon, WindIcon, UmbrellaIcon, ThermometerIcon, DropletIcon, HandshakeIcon, ClipboardListIcon, NewspaperIcon, SparklesIcon, UserIcon, FlameIcon, FileTypeIcon, FileArchiveIcon, TargetIcon, TelescopeIcon, StarIconAlt } from '@/components/icons'

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
  | 'login'
  | 'faq'
  | 'register'

// ─── Data ─────────────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
  { name: 'David Ssekandi', specialty: 'Web Development', students: 312, rating: 4.8, avatar: '/images/pexels-photo-34786947.jpeg' },
  { name: 'Grace Nakato', specialty: 'Data Science', students: 548, rating: 4.9, avatar: '/images/pexels-photo-12293164.jpeg' },
  { name: 'Amina Nalule', specialty: 'UI/UX Design', students: 189, rating: 4.7, avatar: '/images/pexels-photo-36338866.jpeg' },
  { name: 'Ronald Kato', specialty: 'Digital Marketing', students: 274, rating: 4.6, avatar: '/images/pexels-photo-35638373.jpeg' },
]

const LIVE_COURSES = [
  { title: 'Certified Cloud Practitioner', trainer: 'Emmanuel Byaruhanga', schedule: 'Mon, Wed, Fri', time: '7:00 PM – 9:00 PM', fee: 350000, duration: '6 weeks', spots: 8, platform: 'Google Meet', joinLink: 'https://meet.google.com' },
  { title: 'Advanced Excel & Data Analysis', trainer: 'Flavia Namukasa', schedule: 'Tue, Thu', time: '6:00 PM – 8:00 PM', fee: 180000, duration: '4 weeks', spots: 12, platform: 'Zoom', joinLink: 'https://zoom.us' },
  { title: 'Project Management Professional (PMP)', trainer: 'Isaac Tumwine', schedule: 'Sat, Sun', time: '9:00 AM – 12:00 PM', fee: 420000, duration: '8 weeks', spots: 5, platform: 'TikTok Live', joinLink: 'https://www.tiktok.com/live' },
]

const TESTIMONIALS = [
  { name: 'Sarah Namutebi', text: "Digtech Academy changed my career completely. I went from zero coding knowledge to landing a junior developer job in 6 months. The tutors are incredibly supportive.", role: 'Junior Developer at Tecno Uganda', avatar: '/images/pexels-photo-8384894.jpeg' },
  { name: 'Brian Odhiambo', text: "The Data Science course was comprehensive and practical. I especially loved how each module built on the previous one. Worth every shilling!", role: 'Data Analyst at MTN Uganda', avatar: '/images/pexels-photo-33128556.jpeg' },
  { name: 'Patricia Auma', text: "Flexible learning that fits my schedule as a working mother. I completed the UI/UX course in 3 weeks and immediately started freelancing.", role: 'Freelance Designer', avatar: '/images/pexels-photo-33128558.jpeg' },
]

// ─── Shared Components ────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Icon key={i} icon="lucide:star" className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
      <span className="ml-1 text-xs font-600 text-gray-600">{rating}</span>
    </div>
  )
}

function CourseCard({ course, onClick }: { course: typeof COURSES[0]; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-lift transition-all cursor-pointer group animate-fade-in-up">
      <div className="relative overflow-hidden bg-gray-100">
        <img src={course.image} alt={course.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        {course.free && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-600 px-2.5 py-1 rounded-full animate-pulse-glow">FREE</span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-500 px-2 py-1 rounded-full shadow-sm">{course.level}</span>
      </div>
      <div className="p-4">
        <span className="text-xs font-600 uppercase tracking-wider" style={{ color: '#28C0F4' }}>{course.category}</span>
        <h3 className="font-600 text-gray-900 mt-1 mb-2 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{course.tutor}</p>
        <StarRating rating={course.rating} />
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Icon icon="lucide:clock" className="w-3.5 h-3.5 text-gray-400" /> {course.duration}</span>
          <span className="flex items-center gap-1.5"><Icon icon="lucide:users" className="w-3.5 h-3.5 text-gray-400" /> {course.students.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <span className="font-700 text-lg" style={{ color: '#1A4095' }}>
            {course.free ? 'Free' : `UGX ${course.price.toLocaleString()}`}
          </span>
          <button
            className="text-xs font-600 px-4 py-2 rounded-xl text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{ background: '#28C0F4' }}
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
    cyan: 'bg-cyan-50 text-cyan-700',
  }
  return (
    <span className={`inline-block text-xs font-600 px-2.5 py-1 rounded-full ${styles[color] || styles.blue}`}>
      {children}
    </span>
  )
}

// ─── Public Navigation ─────────────────────────────────────────────────────────
function PublicNav({ frame, setFrame, isAdminLoggedIn, onLogout }: { frame: Frame; setFrame: (f: Frame) => void; isAdminLoggedIn?: boolean; onLogout?: () => void }) {
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
        <button onClick={() => setFrame('home')} className="flex items-center gap-2.5 group">
          <img src="/digitechlogo.png" alt="Digtech Academy Logo" className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" />
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button
              key={l.frame}
              onClick={() => setFrame(l.frame)}
              className={`text-sm font-500 transition-all hover:scale-105 ${frame === l.frame ? 'font-600' : 'text-gray-600 hover:text-gray-900'}`}
              style={frame === l.frame ? { color: '#1A4095' } : undefined}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {isAdminLoggedIn ? (
            <>
              <button
                onClick={() => setFrame('admin-dashboard')}
                className="text-sm font-600 px-4 py-2 rounded-xl text-white transition-all shadow-sm hover:opacity-90 flex items-center gap-2 hover:scale-105"
                style={{ background: '#1A4095' }}
              >
                <Icon icon="lucide:settings" className="w-4 h-4" /> Admin Dashboard
              </button>
              <button
                onClick={onLogout}
                className="text-sm font-600 px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5"
              >
                <Icon icon="lucide:log-out" className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setFrame('login')}
                className={`text-sm font-600 px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 hover:bg-blue-50 hover:scale-105 ${frame === 'login' ? 'bg-blue-50' : ''}`}
                style={{ borderColor: '#1A4095', color: '#1A4095' }}
              >
                <Icon icon="lucide:lock" className="w-4 h-4" /> Login
              </button>
              <button
                onClick={() => setFrame('register')}
                className="text-sm font-600 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105 shadow-sm"
                style={{ background: '#1A4095' }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <XIcon className="w-5 h-5 text-gray-700" /> : <MenuIcon className="w-5 h-5 text-gray-700" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 animate-fade-in-down">
          {links.map(l => (
            <button key={l.frame} onClick={() => { setFrame(l.frame); setMobileOpen(false) }} className="text-left text-sm font-500 py-2 text-gray-700">
              {l.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {isAdminLoggedIn ? (
              <>
                <button onClick={() => { setFrame('admin-dashboard'); setMobileOpen(false) }} className="w-full text-sm font-600 py-2 rounded-xl text-white flex items-center justify-center gap-1.5" style={{ background: '#1A4095' }}><SettingsIcon className="h-4 w-4" /> Admin Dashboard</button>
                <button onClick={() => { onLogout?.(); setMobileOpen(false) }} className="w-full text-sm font-600 py-2 rounded-xl border border-red-200 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setFrame('login'); setMobileOpen(false) }} className="w-full text-sm font-600 py-2 rounded-xl border-2 flex items-center justify-center gap-1.5" style={{ borderColor: '#1A4095', color: '#1A4095' }}><LockIcon className="h-4 w-4" /> Login</button>
                <button onClick={() => { setFrame('register'); setMobileOpen(false) }} className="w-full text-sm font-600 py-2 rounded-xl text-white" style={{ background: '#1A4095' }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ setFrame }: { setFrame: (f: Frame) => void }) {
  const [searchQ, setSearchQ] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const sortedCourses = [...COURSES].sort((a, b) => b.students - a.students)

  const searchResults = searchQ.trim().length > 0
    ? COURSES.filter(c =>
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
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 60%, #1A4095 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full blur-3xl" style={{ background: '#28C0F4' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6 animate-pulse-glow">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#28C0F4' }} />
              <span className="text-white/90 text-sm font-500">Uganda's Leading Online Academy</span>
            </div>
            <h1 className="text-white font-800 text-4xl md:text-5xl leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Unlock Your<br />
              <span style={{ color: '#28C0F4' }}>Digital Potential</span><br />
              Today
            </h1>
            <p className="text-white/75 text-lg mb-8 leading-relaxed">
              Expert-led courses in tech, design, and business. Learn at your pace, earn a certificate, and transform your career — all in one platform.
            </p>
            {/* Search with Autocomplete */}
            <div className="relative">
              <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-xl hover:shadow-2xl transition-shadow">
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => { setSearchQ(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="What do you want to learn today?"
                  className="flex-1 px-4 py-2.5 text-gray-800 text-sm outline-none bg-transparent placeholder-gray-400"
                />
                <button
                  onClick={() => setFrame('courses')}
                  className="text-white text-sm font-600 px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md"
                  style={{ background: '#28C0F4' }}
                >
                  Search
                </button>
              </div>
              {/* Autocomplete Dropdown */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                  {searchResults.slice(0, 5).map(c => (
                    <button
                      key={c.id}
                      onMouseDown={() => { setSearchQ(''); setFrame('courses') }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                    >
                      <img src={c.image} alt="" className="w-10 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-600 text-gray-900 truncate">{c.title}</div>
                        <div className="text-xs text-gray-400">{c.category} · {c.tutor}</div>
                      </div>
                      <span className="text-xs font-600 text-gray-400 flex-shrink-0">{c.students} enrolled</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-5 flex-wrap">
              {['Web Development', 'Data Science', 'UI/UX Design'].map(tag => (
                 <button key={tag} onClick={() => setFrame('courses')} className="text-white/70 text-xs border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 hover:border-white/50 hover:text-white transition-all hover:scale-105">
                  {tag}
                </button>
              ))}
            </div>
          </div>
            <div className="hidden md:block relative animate-fade-in-right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
                <img
                  src="/images/pexels-photo-3771511.jpeg"
                  alt="Students learning online"
                  className="w-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            {/* Floating cards with animation */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 floating-orb border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-900" style={{ background: '#e8f0fb' }}>
                <Icon icon="lucide:award" className="w-5 h-5" />
              </div>
              <div>
                <div className="font-700 text-gray-900 text-sm">2,800+ Students</div>
                <div className="text-xs text-gray-400">Enrolled this month</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 floating-orb-reverse border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-500" style={{ background: '#fffbeb' }}>
                <Icon icon="lucide:star" className="w-5 h-5" />
              </div>
              <div>
                <div className="font-700 text-gray-900 text-sm">4.8 / 5.0</div>
                <div className="text-xs text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
        {/* Break after hero */}
        <div className="relative z-10">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100" style={{ background: '#f8faff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '120+', label: 'Courses', icon: 'lucide:book-open' },
            { value: '5,200+', label: 'Students', icon: 'lucide:graduation-cap' },
            { value: '48', label: 'Expert Tutors', icon: 'lucide:user-check' },
            { value: '94%', label: 'Completion Rate', icon: 'lucide:check-circle-2' },
          ].map(s => (
            <div key={s.label} className="text-center group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon icon={s.icon} className="w-6 h-6 text-blue-900" />
              </div>
              <div className="text-3xl font-800" style={{ color: '#1A4095' }}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1 font-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>Browse By Category</p>
          <h2 className="text-3xl font-800 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Explore Course Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setFrame('courses')}
              className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ background: `${cat.color}15` }}>
                <Icon icon={cat.icon} className="w-7 h-7" style={{ color: cat.color }} />
              </div>
              <div className="text-sm font-600 text-gray-800">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">{COURSES.filter(c => c.category === cat.name).length} courses</div>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Courses - Sorted by enrollment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>Most Enrolled</p>
            <h2 className="text-3xl font-800 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Popular Courses</h2>
          </div>
          <button onClick={() => setFrame('courses')} className="text-sm font-600 border-2 border-blue-900 px-4 py-2 rounded-xl hover:bg-blue-900 hover:text-white transition-all" style={{ borderColor: '#1A4095', color: '#1A4095' }}>
            View All →
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.slice(0, 6).map(c => (
            <CourseCard key={c.id} course={c} onClick={() => setFrame('course-detail')} />
          ))}
        </div>
      </section>

      {/* Featured Tutors */}
      <section style={{ background: '#f8faff' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>Learn from the Best</p>
            <h2 className="text-3xl font-800 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Featured Tutors</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TUTORS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-4 ring-blue-50" />
                <h3 className="font-700 text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{t.specialty}</p>
                <div className="flex justify-center mt-3">
                  <StarRating rating={t.rating} />
                </div>
                <div className="mt-3 text-xs text-gray-400">{t.students} students</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Courses Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>Interactive Learning</p>
            <h2 className="text-3xl font-800 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Live Online Classes</h2>
          </div>
          <button onClick={() => setFrame('live-courses')} className="text-sm font-600 border-2 border-blue-900 px-4 py-2 rounded-xl hover:bg-blue-900 hover:text-white transition-all" style={{ borderColor: '#1A4095', color: '#1A4095' }}>View All →</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {LIVE_COURSES.map(lc => (
            <div key={lc.title} className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-1" style={{ background: 'linear-gradient(135deg, #1A4095, #28C0F4)' }}>
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge color="cyan">LIVE</Badge>
                    <span className="text-xs text-gray-400">{lc.spots} spots left</span>
                  </div>
                  <h3 className="font-700 text-gray-900 mb-1">{lc.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">Trainer: {lc.trainer}</p>
                  {/* Platform Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 mb-3" style={{ background: lc.platform === 'Zoom' ? '#2D8CFF15' : lc.platform === 'Google Meet' ? '#00897B15' : '#EE104515', color: lc.platform === 'Zoom' ? '#2D8CFF' : lc.platform === 'Google Meet' ? '#00897B' : '#EE1045' }}>
                    <Icon icon={lc.platform === 'Zoom' ? 'lucide:video' : lc.platform === 'Google Meet' ? 'lucide:video' : 'lucide:radio'} className="w-3.5 h-3.5" />
                    {lc.platform}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-gray-400" /> {lc.schedule}</div>
                    <div className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-gray-400" /> {lc.time}</div>
                    <div className="flex items-center gap-2"><TimerIcon className="h-4 w-4 text-gray-400" /> {lc.duration}</div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <span className="font-700" style={{ color: '#1A4095' }}>UGX {lc.fee.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <a href={lc.joinLink} target="_blank" rel="noopener noreferrer" className="text-xs font-600 px-3 py-2 rounded-xl border-2 transition-all hover:scale-105" style={{ borderColor: '#28C0F4', color: '#28C0F4' }}>
                        Join Live
                      </a>
                      <button className="text-xs font-600 text-white px-4 py-2 rounded-xl" style={{ background: '#28C0F4' }}>Apply Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>Success Stories</p>
            <h2 className="text-3xl font-800 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>What Our Students Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <StarIcon key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/85 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-600 text-sm">{t.name}</div>
                    <div className="text-white/50 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-800 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Frequently Asked Questions</h2>
        </div>
        <FaqAccordion />
        <div className="text-center mt-8">
          <button onClick={() => setFrame('faq')} className="text-sm font-600 border-2 px-6 py-2.5 rounded-xl hover:bg-blue-900 hover:text-white transition-all" style={{ borderColor: '#1A4095', color: '#1A4095' }}>
            View All FAQs →
          </button>
        </div>
      </section>

      {/* Footer - White Background */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/digitechlogo.png" alt="Digtech Academy Logo" className="h-9 w-auto object-contain" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Uganda's premier online learning platform. Building digital skills for Africa's future.</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: 'lucide:facebook', href: 'https://facebook.com', label: 'Facebook' },
                { icon: 'lucide:instagram', href: 'https://instagram.com', label: 'Instagram' },
                { icon: 'lucide:twitter', href: 'https://x.com', label: 'X' },
                { icon: 'mdi:tiktok', href: 'https://tiktok.com', label: 'TikTok' },
                { icon: 'lucide:linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: 'lucide:youtube', href: 'https://youtube.com', label: 'YouTube' },
                { icon: 'mdi:whatsapp', href: 'https://wa.me/256770613201', label: 'WhatsApp' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:scale-110 transition-all" style={{ ['--tw-hover-bg' as string]: '#1A4095' }} onMouseEnter={e => (e.currentTarget.style.background = '#1A4095')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <Icon icon={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Quick Links', links: [
              { label: 'Home', action: () => setFrame('home') },
              { label: 'Courses', action: () => setFrame('courses') },
              { label: 'Live Classes', action: () => setFrame('live-courses') },
              { label: 'About Us', action: () => setFrame('about') },
              { label: 'FAQ', action: () => setFrame('faq') },
            ]},
            { title: 'Categories', links: [
              { label: 'Web Development', action: () => setFrame('courses') },
              { label: 'Data Science', action: () => setFrame('courses') },
              { label: 'Design', action: () => setFrame('courses') },
              { label: 'Marketing', action: () => setFrame('courses') },
              { label: 'Security', action: () => setFrame('courses') },
            ]},
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-gray-900 font-700 mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}><button onClick={link.action} className="text-gray-500 text-sm hover:text-blue-700 transition-colors">{link.label}</button></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-gray-900 font-700 mb-4">Support</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Level 2 Grand West Arcade, High Street Mbarara City - Uganda</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <PhoneIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>+256 (0) 770 613 201</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <MailIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>info@digtechsolutionshub.com</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Google Map */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="rounded-2xl overflow-hidden border border-gray-200 h-48">
            <iframe
              src="https://www.google.com/maps?ll=-0.606781,30.661901&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=8763999400868403491"
              className="h-full w-full"
              loading="lazy"
              title="Digtech Academy location"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Digtech Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  const faqs = [
    { q: 'How do I enroll in a course?', a: 'Browse our courses, click "Enroll Now", complete the payment via PesaPal, and you\'ll get instant access. We also send an SMS confirmation.' },
    { q: 'What payment methods are accepted?', a: 'We accept Mobile Money (MTN & Airtel), bank cards, and bank transfers through our PesaPal integration.' },
    { q: 'Can I get a certificate?', a: 'Yes! Complete 100% of a course to unlock your digital certificate. Certificates include a QR code for employer verification.' },
    { q: 'What if I need help with a lesson?', a: 'Each lesson has a built-in Q&A section where you can ask your tutor directly. Tutors typically respond within 24 hours.' },
    { q: 'Are there live classes available?', a: 'Yes, we offer live online classes with real-time instruction. Check our Live Classes section for current schedules and apply online.' },
  ]
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
          <button
            className="w-full text-left px-6 py-4 flex items-center justify-between font-600 text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {faq.q}
            <span className="text-gray-400 ml-4 transition-transform" style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}><PlusIcon className="h-4 w-4" /></span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── COURSES PAGE ──────────────────────────────────────────────────────────────
function CoursesPage({ setFrame }: { setFrame: (f: Frame) => void }) {
  const [filters, setFilters] = useState({ category: 'All', level: 'All', price: 'All' })
  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Marketing', 'Security', 'Mobile Dev']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const prices = ['All', 'Free', 'Paid']

  const filtered = COURSES.filter(c => {
    if (filters.category !== 'All' && c.category !== filters.category) return false
    if (filters.level !== 'All' && c.level !== filters.level) return false
    if (filters.price === 'Free' && !c.free) return false
    if (filters.price === 'Paid' && c.free) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-800 text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>All Courses</h1>
        <p className="text-gray-500">{filtered.length} courses available</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 flex flex-wrap gap-6">
        {[
          { label: 'Category', key: 'category', opts: categories },
          { label: 'Level', key: 'level', opts: levels },
          { label: 'Price', key: 'price', opts: prices },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-600 text-gray-500 mb-2 uppercase tracking-wider">{f.label}</label>
            <div className="flex gap-2 flex-wrap">
              {f.opts.map(opt => (
                <button
                  key={opt}
                  onClick={() => setFilters(prev => ({ ...prev, [f.key]: opt }))}
                  className={`text-sm px-4 py-1.5 rounded-full border font-500 transition-all ${
                    filters[f.key as keyof typeof filters] === opt
                      ? 'text-white border-transparent'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                  style={filters[f.key as keyof typeof filters] === opt ? { background: '#1A4095', borderColor: '#1A4095' } : undefined}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4"><SearchIcon className="h-16 w-16 text-gray-300 mx-auto" /></div>
          <p className="font-600 text-gray-600">No courses match your filters</p>
          <button onClick={() => setFilters({ category: 'All', level: 'All', price: 'All' })} className="mt-4 text-sm font-600 hover:opacity-70 transition-opacity" style={{ color: '#1A4095' }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <CourseCard key={c.id} course={c} onClick={() => setFrame('course-detail')} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── COURSE DETAIL ─────────────────────────────────────────────────────────────
function CourseDetailPage() {
  const course = COURSES[0]
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview')
  const [showPayment, setShowPayment] = useState(false)

  const modules = [
    { title: 'Introduction to Web Development', lessons: 5, duration: '2h 30m' },
    { title: 'HTML5 & Semantic Markup', lessons: 8, duration: '3h 45m' },
    { title: 'CSS3 & Responsive Design', lessons: 10, duration: '4h 20m' },
    { title: 'JavaScript Fundamentals', lessons: 12, duration: '5h 10m' },
    { title: 'React.js Core Concepts', lessons: 15, duration: '6h 30m' },
    { title: 'Node.js & Express Backend', lessons: 11, duration: '4h 50m' },
    { title: 'Database Design with PostgreSQL', lessons: 8, duration: '3h 20m' },
    { title: 'Deployment & DevOps', lessons: 6, duration: '2h 40m' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex gap-2 mb-4">
              <Badge color="cyan">{course.category}</Badge>
              <Badge color="gray">{course.level}</Badge>
            </div>
            <h1 className="text-3xl font-800 mb-4 leading-snug" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</h1>
            <p className="text-white/75 mb-6 leading-relaxed">
              Master full-stack web development from scratch. Build real-world projects using React, Node.js, and PostgreSQL.
              This comprehensive course takes you from beginner to job-ready developer.
            </p>
            <div className="flex flex-wrap gap-5 text-sm text-white/80">
              <div className="flex items-center gap-2"><TimerIcon className="h-4 w-4 text-white/70" /> {course.duration}</div>
              <div className="flex items-center gap-2"><UsersIcon className="h-4 w-4 text-white/70" /> {course.students} enrolled</div>
              <div className="flex items-center gap-2"><GlobeIcon className="h-4 w-4 text-white/70" /> English</div>
              <div className="flex items-center gap-2"><RefreshCwIcon className="h-4 w-4 text-white/70" /> Last updated Aug 2024</div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <img src={course.image} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30" />
              <div>
                <div className="text-xs text-white/50">Instructor</div>
                <div className="font-600">{course.tutor}</div>
              </div>
            </div>
          </div>
          {/* Enrollment Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl text-gray-900">
            <div className="relative">
              <img src={course.image} alt={course.title} className="w-full h-44 object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <PlayIcon className="h-5 w-5 text-white ml-1" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-800" style={{ color: '#1A4095' }}>UGX {course.price.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="w-full py-3.5 rounded-xl text-white font-700 text-base mb-3 hover:opacity-90 transition-all"
                style={{ background: '#28C0F4' }}
              >
                Enroll Now
              </button>
              <button className="w-full py-3.5 rounded-xl font-700 text-base border-2 hover:bg-blue-50 transition-colors" style={{ borderColor: '#1A4095', color: '#1A4095' }}>
                Add to Wishlist
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">30-day money-back guarantee</p>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {['Full lifetime access', 'Access on mobile & desktop', 'Certificate of completion', 'Direct Q&A with tutor'].map(b => (
                  <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500"><CheckIcon className="h-4 w-4 inline" /></span> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 bg-white border-b border-gray-100 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6">
            {(['overview', 'curriculum', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-600 capitalize border-b-2 transition-all ${
                  activeTab === tab ? 'border-b-2' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={activeTab === tab ? { borderColor: '#1A4095', color: '#1A4095' } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-700 text-gray-900 mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Build full-stack web applications', 'Master React.js & Node.js', 'Work with databases (PostgreSQL)', 'Deploy apps to production', 'Understand REST APIs', 'Version control with Git & GitHub', 'Write clean, maintainable code', 'Land a developer job'].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0"><CheckIcon className="h-4 w-4 inline" /></span> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-700 text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                <li>A computer with internet access</li>
                <li>Basic computer literacy (no prior coding experience needed)</li>
                <li>Willingness to learn and practice daily</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-700 text-gray-900">Course Curriculum</h2>
              <p className="text-sm text-gray-500 mt-1">{modules.length} modules · {course.duration} total</p>
            </div>
            <div className="divide-y divide-gray-50">
              {modules.map((m, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-700 text-white flex-shrink-0" style={{ background: '#1A4095' }}>{i + 1}</div>
                    <div>
                      <div className="font-600 text-gray-900 text-sm">{m.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{m.lessons} lessons · {m.duration}</div>
                    </div>
                  </div>
                  {i === 0 && <Badge color="green">Preview</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-8 items-center">
              <div className="text-center">
                <div className="text-6xl font-800" style={{ color: '#1A4095' }}>{course.rating}</div>
                <div className="mt-2"><StarRating rating={course.rating} /></div>
                <div className="text-sm text-gray-400 mt-1">Course Rating</div>
              </div>
              <div className="flex-1">
                {[5,4,3,2,1].map(stars => (
                  <div key={stars} className="flex items-center gap-3 mb-1.5">
                    <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: stars === 5 ? '72%' : stars === 4 ? '20%' : stars === 3 ? '6%' : '2%' }} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 w-16 text-right">
                       <span className="flex items-center gap-0.5">{[...Array(stars)].map((_, i) => <StarIcon key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-600 text-gray-900">{t.name}</span>
                      <StarRating rating={4.8} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{t.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-1" style={{ background: 'linear-gradient(135deg, #1A4095, #28C0F4)' }}>
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-700 text-gray-900">Complete Enrollment</h2>
                  <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="h-5 w-5" /></button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-sm text-gray-500 mb-1">You're enrolling in</div>
                  <div className="font-600 text-gray-900">{course.title}</div>
                  <div className="text-2xl font-800 mt-2" style={{ color: '#1A4095' }}>UGX {course.price.toLocaleString()}</div>
                </div>
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-600 text-gray-700">Select Payment Method</p>
                  {['Mobile Money (MTN / Airtel)', 'Visa / Mastercard', 'Bank Transfer'].map((method, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                      <input type="radio" name="payment" defaultChecked={i === 0} className="accent-blue-700" />
                      <span className="text-sm font-500">{method}</span>
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-600 text-gray-500 mb-2 uppercase tracking-wider">Phone / Account Number</label>
                  <input type="text" placeholder="e.g. 0700 000 000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
                </div>
                <button className="w-full py-3.5 rounded-xl text-white font-700 text-base hover:opacity-90 transition-all" style={{ background: '#28C0F4' }}>
                  Pay UGX {course.price.toLocaleString()}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">Powered by PesaPal · Secured by 256-bit SSL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── STUDENT DASHBOARD ─────────────────────────────────────────────────────────
function StudentDashboard() {
  const [tab, setTab] = useState<'home' | 'courses' | 'certificates' | 'profile'>('home')

  const myCourses = [
    { ...COURSES[0], progress: 65, lastWatched: 'Module 5: React.js Core Concepts' },
    { ...COURSES[2], progress: 100, lastWatched: 'Completed!' },
    { ...COURSES[3], progress: 30, lastWatched: 'Module 2: Audience Research' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-5 border-b border-gray-100">
          <div className="font-700 text-lg" style={{ color: '#1A4095' }}>Digtech <span style={{ color: '#28C0F4' }}>Academy</span></div>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-700" style={{ background: '#1A4095' }}>SN</div>
            <div>
              <div className="font-600 text-sm text-gray-900">Sarah Namutebi</div>
              <div className="text-xs text-gray-400">Student</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { key: 'home', label: 'Dashboard', icon: <HomeIcon className="h-4 w-4" /> },
            { key: 'courses', label: 'My Courses', icon: <BookOpenIcon className="h-4 w-4" /> },
            { key: 'certificates', label: 'Certificates', icon: <TrophyIcon className="h-4 w-4" /> },
            { key: 'profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all text-left ${
                tab === item.key ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={tab === item.key ? { background: '#1A4095' } : undefined}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Tab bar */}
        <div className="md:hidden flex border-b border-gray-100 bg-white overflow-x-auto">
          {[
            { key: 'home', label: 'Home', icon: <HomeIcon className="h-4 w-4" /> },
            { key: 'courses', label: 'Courses', icon: <BookOpenIcon className="h-4 w-4" /> },
            { key: 'certificates', label: 'Certs', icon: <TrophyIcon className="h-4 w-4" /> },
            { key: 'profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 ${tab === item.key ? 'font-600' : 'text-gray-400'}`}
              style={tab === item.key ? { color: '#1A4095' } : undefined}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {tab === 'home' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-800 text-gray-900">Welcome back, Sarah! <HandshakeIcon className="h-6 w-6 text-action inline ml-1" /></h1>
                <p className="text-gray-500 mt-1">Keep up the momentum — you're doing great.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Enrolled Courses', value: '3', icon: <BookOpenIcon className="h-5 w-5 text-gray-400" />, color: '#1A4095' },
                  { label: 'Completed', value: '1', icon: <CheckCircleIcon className="h-5 w-5 text-gray-400" />, color: '#10B981' },
                  { label: 'Certificates', value: '1', icon: <TrophyIcon className="h-5 w-5 text-gray-400" />, color: '#F59E0B' },
                  { label: 'Avg. Progress', value: '65%', icon: <BarChartIcon className="h-5 w-5 text-gray-400" />, color: '#28C0F4' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="mb-2">{s.icon}</div>
                    <div className="text-2xl font-800" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-1 font-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Continue learning */}
              <h2 className="text-lg font-700 text-gray-900 mb-4">Continue Learning</h2>
              <div className="space-y-4">
                {myCourses.filter(c => c.progress < 100).map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start hover:shadow-sm transition-shadow">
                    <img src={c.image} alt={c.title} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-600 text-gray-900 text-sm truncate">{c.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{c.lastWatched}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: '#28C0F4' }} />
                        </div>
                        <span className="text-xs font-600 text-gray-600">{c.progress}%</span>
                      </div>
                    </div>
                    <button className="text-xs font-600 text-white px-4 py-2 rounded-xl flex-shrink-0 hover:opacity-90" style={{ background: '#1A4095' }}>
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'courses' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">My Courses</h1>
              <div className="grid sm:grid-cols-2 gap-5">
                {myCourses.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img src={c.image} alt={c.title} className="w-full h-36 object-cover" />
                      {c.progress === 100 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/80">
                          <span className="text-white font-700 text-lg"><CheckCircleIcon className="h-5 w-5 inline mr-1" /> Completed</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-600 text-gray-900 text-sm leading-snug mb-3">{c.title}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: c.progress === 100 ? '#10B981' : '#28C0F4' }} />
                        </div>
                        <span className="text-xs font-600" style={{ color: c.progress === 100 ? '#10B981' : '#28C0F4' }}>{c.progress}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4">{c.lastWatched}</p>
                      <button className={`w-full py-2.5 rounded-xl text-sm font-600 transition-all ${c.progress === 100 ? 'bg-gray-50 text-gray-600' : 'text-white hover:opacity-90'}`} style={c.progress < 100 ? { background: '#1A4095' } : undefined}>
                        {c.progress === 100 ? 'Review Course' : 'Continue'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'certificates' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">My Certificates</h1>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
                <div style={{ background: 'linear-gradient(135deg, #1A4095, #28C0F4)' }} className="p-8 text-center text-white">
                  <div className="mb-3"><TrophyIcon className="h-10 w-10 text-white mx-auto" /></div>
                  <div className="text-xs font-600 uppercase tracking-widest mb-2 opacity-75">Certificate of Completion</div>
                  <h2 className="text-xl font-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>UI/UX Design Fundamentals with Figma</h2>
                  <p className="opacity-75 text-sm mt-2">Awarded to Sarah Namutebi</p>
                  <div className="mt-4 text-xs opacity-60">Issued: 15 July 2024 · Verify: digtechacademy.ug/verify/CERT-2024-0847</div>
                </div>
                <div className="p-5 flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-600 text-white hover:opacity-90 transition-all inline-flex items-center justify-center gap-2" style={{ background: '#1A4095' }}>
                    <DownloadIcon className="h-4 w-4" /> Download PDF
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-600 border-2 hover:bg-blue-50 transition-colors" style={{ borderColor: '#1A4095', color: '#1A4095' }}>
                    Share
                  </button>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 flex items-start gap-4">
                <div className="flex-shrink-0"><ClipboardListIcon className="h-6 w-6 text-amber-500" /></div>
                <div>
                  <div className="font-600 text-gray-900 text-sm">Certificate Pending Review</div>
                  <div className="text-sm text-gray-500 mt-1">Full Stack Web Development — submitted for principal review.</div>
                  <Badge color="amber" >Awaiting Approval</Badge>
                </div>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">My Profile</h1>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-700" style={{ background: '#1A4095' }}>SN</div>
                  <div>
                    <div className="font-700 text-gray-900">Sarah Namutebi</div>
                    <div className="text-sm text-gray-400">Student · Joined March 2024</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: 'Sarah Namutebi', type: 'text' },
                    { label: 'Mobile Number', value: '+256 772 123 456', type: 'tel' },
                    { label: 'Email Address', value: 'sarah.namutebi@gmail.com', type: 'email' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">{f.label}</label>
                      <input type={f.type} defaultValue={f.value} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
                    <input type="password" placeholder="Leave blank to keep current" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
                  </div>
                  <button className="w-full py-3 rounded-xl text-white font-600 hover:opacity-90 transition-all mt-2" style={{ background: '#1A4095' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── TUTOR DASHBOARD ──────────────────────────────────────────────────────────
function TutorDashboard() {
  const [tab, setTab] = useState<'overview' | 'courses' | 'students' | 'earnings' | 'withdrawals'>('overview')
  const [showWithdraw, setShowWithdraw] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-5 border-b border-gray-100">
          <div className="font-700 text-lg" style={{ color: '#1A4095' }}>Digtech <span style={{ color: '#28C0F4' }}>Academy</span></div>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={TUTORS[0].avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-600 text-sm text-gray-900">{TUTORS[0].name}</div>
              <div className="text-xs text-gray-400">Tutor</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { key: 'overview', label: 'Overview', icon: <BarChartIcon className="h-4 w-4" /> },
            { key: 'courses', label: 'My Courses', icon: <BookOpenIcon className="h-4 w-4" /> },
            { key: 'students', label: 'Students', icon: <UsersIcon className="h-4 w-4" /> },
            { key: 'earnings', label: 'Earnings', icon: <DollarSignIcon className="h-4 w-4" /> },
            { key: 'withdrawals', label: 'Withdrawals', icon: <BanknoteIcon className="h-4 w-4" /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all text-left ${
                tab === item.key ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={tab === item.key ? { background: '#1A4095' } : undefined}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-gray-100 bg-white overflow-x-auto">
          {[
            { key: 'overview', icon: <BarChartIcon className="h-4 w-4" />, label: 'Overview' },
            { key: 'courses', icon: <BookOpenIcon className="h-4 w-4" />, label: 'Courses' },
            { key: 'students', icon: <UsersIcon className="h-4 w-4" />, label: 'Students' },
            { key: 'earnings', icon: <DollarSignIcon className="h-4 w-4" />, label: 'Earnings' },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key as typeof tab)} className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 ${tab === item.key ? 'font-600' : 'text-gray-400'}`} style={tab === item.key ? { color: '#1A4095' } : undefined}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {tab === 'overview' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Tutor Dashboard</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Courses', value: '4', icon: <BookOpenIcon className="h-5 w-5 text-gray-400" />, color: '#1A4095' },
                  { label: 'Total Students', value: '312', icon: <UsersIcon className="h-5 w-5 text-gray-400" />, color: '#28C0F4' },
                  { label: 'Total Revenue', value: 'UGX 21.8M', icon: <BanknoteIcon className="h-5 w-5 text-gray-400" />, color: '#10B981' },
                  { label: 'Withdrawable', value: 'UGX 4.2M', icon: <DollarSignIcon className="h-5 w-5 text-gray-400" />, color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="mb-2">{s.icon}</div>
                    <div className="text-xl font-800 leading-tight" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-1 font-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-700 text-gray-900 mb-4">Recent Enrollments</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Brian Odhiambo', course: COURSES[0].title, date: '2 hours ago', amount: 70000 },
                    { name: 'Patricia Auma', course: COURSES[0].title, date: '5 hours ago', amount: 70000 },
                    { name: 'Moses Kibirige', course: COURSES[1].title, date: 'Yesterday', amount: 66500 },
                    { name: 'Annet Nampijja', course: COURSES[0].title, date: '2 days ago', amount: 70000 },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 text-white flex-shrink-0" style={{ background: '#1A4095' }}>
                          {e.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-600 text-gray-900">{e.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">{e.course}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-700 text-emerald-600">+UGX {e.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">{e.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-800 text-gray-900">My Courses</h1>
                <button className="text-sm font-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90" style={{ background: '#28C0F4' }}>+ Create Course</button>
              </div>
              <div className="space-y-4">
                {COURSES.slice(0, 4).map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
                    <img src={c.image} alt="" className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-600 text-gray-900 text-sm">{c.title}</h3>
                      <div className="flex gap-3 mt-2">
                        <Badge color="gray">{c.level}</Badge>
                        <Badge color="cyan">{c.category}</Badge>
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><UserIcon className="h-3 w-3 text-gray-400" /> {c.students} students</span>
                        <span className="flex items-center gap-1"><StarIcon className="h-3 w-3 text-gray-400" /> {c.rating}</span>
                        <span className="flex items-center gap-1"><TimerIcon className="h-3 w-3 text-gray-400" /> {c.duration}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="text-xs font-600 px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: '#1A4095', color: '#1A4095' }}>Edit</button>
                      <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">Modules</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'students' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">My Students</h1>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#f8faff' }}>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">Course</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'Sarah Namutebi', course: 'Full Stack Web Dev', progress: 65, date: '12 Mar 2024' },
                      { name: 'Brian Odhiambo', course: 'Full Stack Web Dev', progress: 40, date: '15 Mar 2024' },
                      { name: 'Patricia Auma', course: 'Python for Data Science', progress: 80, date: '20 Mar 2024' },
                      { name: 'Moses Kibirige', course: 'Full Stack Web Dev', progress: 100, date: '1 Apr 2024' },
                      { name: 'Annet Nampijja', course: 'Python for Data Science', progress: 25, date: '5 Apr 2024' },
                    ].map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 text-white flex-shrink-0" style={{ background: '#1A4095' }}>
                              {s.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-500 text-gray-900">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-500">{s.course}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.progress === 100 ? '#10B981' : '#28C0F4' }} />
                            </div>
                            <span className="text-xs font-600 text-gray-500">{s.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">{s.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'earnings' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Earnings</h1>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm text-gray-500 mb-1">Total Earned (All Time)</div>
                  <div className="text-2xl font-800" style={{ color: '#1A4095' }}>UGX 21,840,000</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm text-gray-500 mb-1">Total Deductions (30%)</div>
                  <div className="text-2xl font-800 text-red-500">UGX 6,552,000</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm text-gray-500 mb-1">Withdrawable Balance</div>
                  <div className="text-2xl font-800 text-emerald-600">UGX 4,200,000</div>
                  <button onClick={() => setShowWithdraw(true)} className="mt-3 w-full text-xs font-600 text-white py-2 rounded-lg hover:opacity-90" style={{ background: '#28C0F4' }}>Request Withdrawal</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-700 text-gray-900 mb-1">Revenue Breakdown</h2>
                <p className="text-xs text-gray-400 mb-5">Per enrollment: Tutor gets 70%, Digtech Academy gets 30%</p>
                <div className="space-y-3">
                  {[
                    { course: 'Full Stack Web Development', enrollments: 312, fee: 120000, tutor: 84000 },
                    { course: 'Python for Data Science', enrollments: 87, fee: 95000, tutor: 66500 },
                    { course: 'UI/UX Design', enrollments: 45, fee: 75000, tutor: 52500 },
                  ].map(r => (
                    <div key={r.course} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                      <div>
                        <div className="text-sm font-600 text-gray-900">{r.course}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{r.enrollments} enrollments · UGX {r.fee.toLocaleString()} / student</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-700 text-emerald-600">UGX {r.tutor.toLocaleString()}/student</div>
                        <div className="text-xs text-gray-400">your share</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'withdrawals' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-800 text-gray-900">Withdrawal Requests</h1>
                <button onClick={() => setShowWithdraw(true)} className="text-sm font-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90" style={{ background: '#28C0F4' }}>
                  + Request Withdrawal
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#f8faff' }}>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { date: '28 Jul 2024', amount: 2000000, method: 'MTN Mobile Money', status: 'Paid' },
                      { date: '15 Jul 2024', amount: 1500000, method: 'Airtel Money', status: 'Paid' },
                      { date: '1 Aug 2024', amount: 1200000, method: 'Bank Transfer', status: 'Pending' },
                      { date: '5 Aug 2024', amount: 800000, method: 'MTN Mobile Money', status: 'Approved' },
                    ].map((w, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-sm text-gray-600">{w.date}</td>
                        <td className="px-5 py-4 text-sm font-700 text-gray-900">UGX {w.amount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{w.method}</td>
                        <td className="px-5 py-4">
                          <Badge color={w.status === 'Paid' ? 'green' : w.status === 'Approved' ? 'blue' : w.status === 'Pending' ? 'amber' : 'red'}>
                            {w.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {showWithdraw && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-700 text-gray-900">Request Withdrawal</h2>
               <button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="h-5 w-5" /></button>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 mb-5 text-center">
              <div className="text-xs text-gray-500 mb-1">Available Balance</div>
              <div className="text-2xl font-800 text-emerald-600">UGX 4,200,000</div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-600 text-gray-500 mb-2 uppercase tracking-wider">Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mobile Money', 'Bank Transfer'].map((m, i) => (
                    <label key={i} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                      <input type="radio" name="method" defaultChecked={i === 0} className="accent-blue-700" />
                      <span className="text-sm font-500">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" defaultValue="David Ssekandi" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input type="tel" defaultValue="+256 772 000 000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">Amount (UGX)</label>
                <input type="number" placeholder="Enter amount" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-400 my-4">Processing time: 2 working days</p>
            <button className="w-full py-3.5 rounded-xl text-white font-700 hover:opacity-90 transition-all" style={{ background: '#1A4095' }}>
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout, setFrame }: { onLogout?: () => void; setFrame?: (f: Frame) => void }) {
  const [tab, setTab] = useState<'overview' | 'users' | 'revenue' | 'withdrawals' | 'success-stories'>('overview')

  return (
    <div className="min-h-screen bg-gray-50 flex animate-fade-in">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex animate-fade-in-left">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="font-700 text-lg" style={{ color: '#1A4095' }}>Digtech <span style={{ color: '#28C0F4' }}>Academy</span></div>
            <div className="text-xs font-600 text-cyan-600 tracking-wide mt-0.5 uppercase">Admin Control Center</div>
          </div>
        </div>
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-800 text-sm shadow-md" style={{ background: 'linear-gradient(135deg, #1A4095, #28C0F4)' }}>
              AD
            </div>
            <div className="min-w-0">
              <div className="font-700 text-sm text-gray-900 truncate">System Admin</div>
              <div className="text-[11px] text-emerald-600 font-600 truncate">admin@digtechacademy.ug</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
            { key: 'overview', label: 'Overview', icon: <BarChartIcon className="h-4 w-4" /> },
            { key: 'users', label: 'Users', icon: <UsersIcon className="h-4 w-4" /> },
            { key: 'revenue', label: 'Revenue', icon: <DollarSignIcon className="h-4 w-4" /> },
            { key: 'withdrawals', label: 'Withdrawals', icon: <BanknoteIcon className="h-4 w-4" /> },
            { key: 'success-stories', label: 'Success Stories', icon: <StarIcon className="h-4 w-4" /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-600 transition-all text-left ${tab === item.key ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              style={tab === item.key ? { background: '#1A4095' } : undefined}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
            {['SMS Settings', 'Payment Settings', 'System Settings'].map(item => (
              <button key={item} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-500 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all text-left">
                <SettingsIcon className="h-4 w-4" /> {item}
              </button>
            ))}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-700 text-red-600 hover:bg-red-50 transition-all text-left mt-4 border border-red-100"
              >
                <LogOutIcon className="h-4 w-4" /> Sign Out
              </button>
            )}
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {tab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-800 text-gray-900">System Overview</h1>
                  <p className="text-gray-400 text-sm mt-1">Monday, 5 August 2024</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-500 text-emerald-700">All Systems Operational</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Students', value: '5,248', icon: <GraduationCapIcon className="h-5 w-5 text-gray-400" />, change: '+124 this month', color: '#1A4095' },
                  { label: 'Active Tutors', value: '48', icon: <UserCheckIcon className="h-5 w-5 text-gray-400" />, change: '+3 pending', color: '#28C0F4' },
                  { label: 'Total Revenue', value: 'UGX 186M', icon: <DollarSignIcon className="h-5 w-5 text-gray-400" />, change: '+12% vs last month', color: '#10B981' },
                  { label: 'Pending Withdrawals', value: '7', icon: <BanknoteIcon className="h-5 w-5 text-gray-400" />, change: 'UGX 8.4M total', color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="mb-2">{s.icon}</div>
                    <div className="text-2xl font-800" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                    <div className="text-xs font-500 mt-2" style={{ color: s.color }}>{s.change}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-700 text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {[
                      { icon: <SparklesIcon className="h-4 w-4 text-blue-500" />, text: 'New tutor registered: Josephine Aber', time: '2 min ago', type: 'blue' },
                      { icon: <DollarSignIcon className="h-4 w-4 text-green-500" />, text: 'Payment received: UGX 120,000 — Full Stack Web Dev', time: '15 min ago', type: 'green' },
                      { icon: <BanknoteIcon className="h-4 w-4 text-amber-500" />, text: 'Withdrawal request: David Ssekandi — UGX 1,200,000', time: '1 hr ago', type: 'amber' },
                      { icon: <GraduationCapIcon className="h-4 w-4 text-blue-500" />, text: 'Certificate approved: Sarah Namutebi', time: '3 hrs ago', type: 'blue' },
                      { icon: <ClipboardListIcon className="h-4 w-4 text-gray-400" />, text: 'Live class application: PMP Course', time: '5 hrs ago', type: 'gray' },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex-shrink-0 mt-0.5">{a.icon}</span>
                        <div className="flex-1">
                          <span className="text-gray-700">{a.text}</span>
                          <span className="block text-xs text-gray-400 mt-0.5">{a.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-700 text-gray-900 mb-4">Top Performing Courses</h2>
                  <div className="space-y-4">
                    {COURSES.slice(0, 4).map((c, i) => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-sm font-700 text-gray-300 w-5">{i + 1}</span>
                        <img src={c.image} alt="" className="w-10 h-8 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-600 text-gray-900 truncate">{c.title}</div>
                          <div className="text-xs text-gray-400">{c.students} enrolled</div>
                        </div>
                        <Badge color={i === 0 ? 'green' : 'gray'}>{i === 0 ? <span className="flex items-center gap-1"><FlameIcon className="h-3.5 w-3.5" /> Hot</span> : `#${i + 1}`}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">User Management</h1>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Students', count: 5248, action: 'Manage', color: '#1A4095' },
                  { label: 'Tutors', count: 48, action: 'Manage', color: '#28C0F4' },
                  { label: 'Principals', count: 3, action: 'Manage', color: '#10B981' },
                ].map(u => (
                  <div key={u.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="text-2xl font-800" style={{ color: u.color }}>{u.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-3">{u.label}</div>
                    <button className="text-xs font-600 px-4 py-1.5 rounded-lg text-white hover:opacity-90" style={{ background: u.color }}>{u.action}</button>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-700 text-gray-900">Pending Tutor Verifications</h2>
                  <Badge color="amber">3 Pending</Badge>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { name: 'Josephine Aber', specialty: 'Mobile Development', submitted: '2 Aug 2024', docs: true },
                    { name: 'Emmanuel Byaruhanga', specialty: 'Cloud Computing', submitted: '4 Aug 2024', docs: true },
                    { name: 'Flavia Namukasa', specialty: 'Data Analytics', submitted: '5 Aug 2024', docs: false },
                  ].map((t, i) => (
                    <div key={i} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-700 text-sm" style={{ background: '#1A4095' }}>
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-600 text-sm text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-400">{t.specialty} · Submitted {t.submitted}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.docs ? <Badge color="green">Docs <CheckIcon className="h-3.5 w-3.5 inline" /></Badge> : <Badge color="red">Docs Missing</Badge>}
                        <button className="text-xs font-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90" style={{ background: '#10B981' }}>Approve</button>
                        <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'revenue' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Revenue & Analytics</h1>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Revenue', value: 'UGX 186,240,000', sub: 'All time' },
                  { label: 'Platform Share (30%)', value: 'UGX 55,872,000', sub: 'After tutor payouts' },
                  { label: 'This Month', value: 'UGX 14,400,000', sub: '+12% vs July 2024' },
                ].map(r => (
                  <div key={r.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="text-xs text-gray-400 mb-1">{r.label}</div>
                    <div className="text-xl font-800" style={{ color: '#1A4095' }}>{r.value}</div>
                    <div className="text-xs text-emerald-600 font-500 mt-1">{r.sub}</div>
                  </div>
                ))}
              </div>
              {/* Monthly bars */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-700 text-gray-900 mb-6">Monthly Revenue (2024)</h2>
                <div className="flex items-end gap-3 h-40">
                  {[
                    { month: 'Mar', val: 45 }, { month: 'Apr', val: 60 }, { month: 'May', val: 55 },
                    { month: 'Jun', val: 72 }, { month: 'Jul', val: 68 }, { month: 'Aug', val: 85 },
                  ].map(d => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-600 text-gray-400">{Math.round(d.val * 14.4 / 10) / 10}M</div>
                      <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{ height: `${d.val}%`, background: 'linear-gradient(to top, #1A4095, #28C0F4)' }} />
                      <div className="text-xs text-gray-400">{d.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'withdrawals' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Withdrawal Requests</h1>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-600 text-gray-900">All Requests</h2>
                  <div className="flex gap-2">
                    {['All', 'Pending', 'Approved', 'Paid'].map(s => (
                      <button key={s} className="text-xs font-500 px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { tutor: 'David Ssekandi', amount: 1200000, method: 'Bank Transfer', status: 'Pending', date: '1 Aug 2024' },
                    { tutor: 'Grace Nakato', amount: 950000, method: 'MTN Mobile Money', status: 'Approved', date: '3 Aug 2024' },
                    { tutor: 'Amina Nalule', amount: 600000, method: 'Airtel Money', status: 'Pending', date: '4 Aug 2024' },
                    { tutor: 'Ronald Kato', amount: 750000, method: 'Bank Transfer', status: 'Paid', date: '28 Jul 2024' },
                  ].map((w, i) => (
                    <div key={i} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <div className="font-600 text-sm text-gray-900">{w.tutor}</div>
                        <div className="text-xs text-gray-400">{w.method} · {w.date}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-700 text-gray-900">UGX {w.amount.toLocaleString()}</div>
                        <Badge color={w.status === 'Paid' ? 'green' : w.status === 'Approved' ? 'blue' : 'amber'}>{w.status}</Badge>
                        {w.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button className="text-xs font-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90" style={{ background: '#10B981' }}>Approve</button>
                            <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === 'success-stories' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Manage Success Stories</h1>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-700 text-gray-900">Student Testimonials</h2>
                  <button className="text-sm font-600 text-white px-5 py-2 rounded-xl" style={{ background: '#28C0F4' }}>+ Add Story</button>
                </div>
                <div className="space-y-4">
                  {TESTIMONIALS.map(t => (
                    <div key={t.name} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-600 text-gray-900 text-sm">{t.name}</div>
                            <div className="text-xs text-gray-400">{t.role}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs font-600 text-blue-600 hover:underline">Edit</button>
                            <button className="text-xs font-600 text-red-600 hover:underline">Delete</button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">"{t.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── LIVE COURSES PAGE ────────────────────────────────────────────────────────
function LiveCoursesPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<typeof LIVE_COURSES[0] | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>Real-Time Learning</p>
        <h1 className="text-4xl font-800 text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Live Online Classes</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Interact directly with expert trainers in real time. Ask questions, get instant feedback, and learn alongside peers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {LIVE_COURSES.map(lc => (
          <div key={lc.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-1" style={{ background: 'linear-gradient(135deg, #1A4095, #28C0F4)' }}>
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge color="cyan">LIVE COURSE</Badge>
                  <div className="text-right">
                    <div className="text-xs text-red-500 font-600">{lc.spots} spots left</div>
                  </div>
                </div>
                <h2 className="font-700 text-gray-900 text-lg leading-snug mb-2">{lc.title}</h2>
                <p className="text-sm text-gray-500 mb-5">Trainer: <span className="font-600 text-gray-700">{lc.trainer}</span></p>
                <div className="space-y-2.5 text-sm">
                  {[
                    { icon: <CalendarIcon className="h-4 w-4 text-gray-400" />, label: 'Schedule', value: lc.schedule },
                    { icon: <ClockIcon className="h-4 w-4 text-gray-400" />, label: 'Time', value: lc.time },
                    { icon: <TimerIcon className="h-4 w-4 text-gray-400" />, label: 'Duration', value: lc.duration },
                  ].map(d => (
                    <div key={d.label} className="flex items-center gap-3">
                      {d.icon}
                      <span className="text-gray-400">{d.label}:</span>
                      <span className="text-gray-700 font-500">{d.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400">Course Fee</div>
                    <div className="text-xl font-800" style={{ color: '#1A4095' }}>UGX {lc.fee.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => { setSelectedCourse(lc); setShowForm(true) }}
                    className="text-sm font-700 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
                    style={{ background: '#28C0F4' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {showForm && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-700 text-gray-900">Apply for Live Class</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="h-5 w-5" /></button>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <div className="font-600 text-gray-900 text-sm">{selectedCourse.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{selectedCourse.schedule} · {selectedCourse.time}</div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Full Name', placeholder: 'Your full name', type: 'text' },
                { label: 'Mobile Number', placeholder: '+256 (0) 770 613 201', type: 'tel' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">Preferred Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <label key={day} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm cursor-pointer hover:border-blue-300 transition-colors">
                      <input type="checkbox" className="accent-blue-700 w-3 h-3" />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">Preferred Study Time</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors">
                  <option>Morning (6AM – 12PM)</option>
                  <option>Afternoon (12PM – 5PM)</option>
                  <option>Evening (5PM – 9PM)</option>
                </select>
              </div>
            </div>
            <button className="w-full py-3.5 rounded-xl text-white font-700 text-base mt-5 hover:opacity-90 transition-all" style={{ background: '#1A4095' }}>
              Submit Application
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">Your application will be reviewed within 24 hours</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  const team = [
    { name: 'Dr. Robert Mugisha', role: 'Founder & CEO', bio: 'Former lecturer at Makerere University with 15 years in tech education.', avatar: '/images/pexels-photo-16776842.jpeg' },
    { name: 'Christine Nakazibwe', role: 'Head of Curriculum', bio: 'Certified instructional designer specializing in digital skills development for East Africa.', avatar: '/images/pexels-photo-34786947.jpeg' },
    { name: 'Samuel Ochieng', role: 'CTO', bio: 'Full-stack engineer with expertise in scalable EdTech platforms and mobile-first design.', avatar: '/images/pexels-photo-12293164.jpeg' },
    { name: 'Harriet Kyomuhendo', role: 'Student Success Lead', bio: 'Passionate about ensuring every learner reaches their potential through mentorship and support.', avatar: '/images/pexels-photo-36338866.jpeg' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: '#28C0F4' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-600 uppercase tracking-widest mb-4" style={{ color: '#28C0F4' }}>Our Story</p>
          <h1 className="text-4xl md:text-5xl font-800 text-white leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Building Africa's Digital Future,<br />One Learner at a Time
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Digtech Academy was founded in Kampala in 2021 with a clear mission: make world-class digital skills education accessible to every Ugandan, regardless of background or location.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-600 uppercase tracking-wider mb-3" style={{ color: '#28C0F4' }}>How It Started</p>
          <h2 className="text-3xl font-800 text-gray-900 mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>From a Kampala Classroom to a National Platform</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            It started with a simple observation: Uganda has a massive youth population hungry for digital skills, but quality training was either too expensive, too far away, or simply not available in local languages and contexts.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Dr. Robert Mugisha, alongside a small team of passionate educators and engineers, built Digtech Academy as a platform that puts the Ugandan learner first — mobile-optimized, affordable, and taught by instructors who understand the local market.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, over 5,200 students across Uganda have learned and grown with us, with alumni working at MTN, Airtel, Stanbic Bank, and leading startups across East Africa.
          </p>
        </div>
        <div className="relative">
          <img
            src="/images/pexels-photo-3184339.jpeg"
            alt="Students learning in Kampala"
            className="rounded-3xl w-full object-cover shadow-xl"
          />
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#e8f0fb' }}><MapPinIcon className="h-5 w-5 text-gray-600" /></div>
            <div>
              <div className="font-700 text-gray-900 text-sm">Based in Kampala</div>
              <div className="text-xs text-gray-400">Serving all of Uganda</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ background: '#f8faff' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <TargetIcon className="h-10 w-10" style={{ color: '#1A4095' }} />,
              label: 'Our Mission',
              title: 'Democratize Digital Education',
              text: 'To provide affordable, high-quality digital skills training that empowers Ugandans to participate fully in the modern economy — on any device, from anywhere in the country.',
              color: '#1A4095',
            },
            {
              icon: <TelescopeIcon className="h-10 w-10" style={{ color: '#28C0F4' }} />,
              label: 'Our Vision',
              title: 'Africa\'s Most Trusted EdTech Platform',
              text: 'To be the leading online learning platform in East Africa, known for producing job-ready graduates, trusted by employers, and celebrated by our alumni.',
              color: '#28C0F4',
            },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="mb-4">{item.icon}</div>
              <p className="text-xs font-700 uppercase tracking-widest mb-2" style={{ color: item.color }}>{item.label}</p>
              <h3 className="text-2xl font-800 text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>What Guides Us</p>
          <h2 className="text-3xl font-800 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Our Core Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <GlobeIcon className="h-6 w-6 text-gray-400" />, title: 'Accessibility', text: 'Learning should be available to everyone, regardless of location or income.' },
            { icon: <CheckCircleIcon className="h-6 w-6 text-gray-400" />, title: 'Quality', text: 'Every course is reviewed for practical, real-world relevance before publishing.' },
            { icon: <HandshakeIcon className="h-6 w-6 text-gray-400" />, title: 'Community', text: 'We grow together — students, tutors, and staff support each other.' },
            { icon: <TrendingUpIcon className="h-6 w-6 text-gray-400" />, title: 'Impact', text: 'We measure success by the careers changed and businesses launched by our alumni.' },
          ].map(v => (
            <div key={v.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="mb-4 flex justify-center">{v.icon}</div>
              <h3 className="font-700 text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-600 uppercase tracking-wider mb-2" style={{ color: '#28C0F4' }}>The People Behind It</p>
            <h2 className="text-3xl font-800 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/20" />
                <h3 className="font-700 text-white">{member.name}</h3>
                <p className="text-xs font-600 mt-1 mb-3" style={{ color: '#28C0F4' }}>{member.role}</p>
                <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100">
        <h2 className="text-3xl font-800 text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ready to Start Learning?</h2>
        <p className="text-gray-500 mb-8">Join 5,200+ students already building their digital careers with Digtech Academy.</p>
        <button className="text-white font-700 px-8 py-4 rounded-2xl text-base hover:opacity-90 transition-all shadow-lg" style={{ background: '#1A4095' }}>
          Browse All Courses
        </button>
      </section>
    </div>
  )
}

// ─── CONTACT PAGE ──────────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <div>
      {/* Header */}
      <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1A4095 0%, #0f2660 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-600 uppercase tracking-widest mb-3" style={{ color: '#28C0F4' }}>Get In Touch</p>
          <h1 className="text-4xl font-800 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>We'd Love to Hear From You</h1>
          <p className="text-white/60 mt-4">Have a question, partnership idea, or just want to say hello? Reach out — we respond within 24 hours.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-3 gap-10">
        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: <LocationIcon className="h-5 w-5 text-action" />, label: 'Address', value: 'Level 2 Grand West Arcade, High Street Mbarara City - Uganda' },
            { icon: <PhoneIcon className="h-5 w-5 text-action" />, label: 'Phone', value: '+256 (0) 770 613 201' },
            { icon: <EmailIcon className="h-5 w-5 text-action" />, label: 'Email', value: 'info@digtechsolutionshub.com' },
            { icon: <ClockIcon className="h-5 w-5 text-action" />, label: 'Working Hours', value: 'Mon – Fri: 8AM – 6PM\nSat: 9AM – 1PM' },
          ].map(item => (
            <div key={item.label} className="flex gap-4 items-start p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8f0fb' }}>
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-700 uppercase tracking-wider text-gray-400 mb-1">{item.label}</div>
                <div className="text-sm text-gray-700 font-500 whitespace-pre-line">{item.value}</div>
              </div>
            </div>
          ))}

           {/* Social */}
           <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <div className="text-xs font-700 uppercase tracking-wider text-gray-400 mb-3">Follow Us</div>
             <div className="flex gap-3">
               {[
                 { icon: <FacebookIcon className="h-4 w-4" />, label: 'Facebook', color: '#1877F2' },
                 { icon: <InstagramIcon className="h-4 w-4" />, label: 'Instagram', color: '#E4405F' },
                 { icon: <TwitterIcon className="h-4 w-4" />, label: 'Twitter/X', color: '#000' },
                 { icon: <YoutubeIcon className="h-4 w-4" />, label: 'YouTube', color: '#FF0000' },
               ].map(s => (
                 <button
                   key={s.label}
                   title={s.label}
                   className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                   style={{ background: '#f0f4ff' }}
                 >
                   {s.icon}
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
           {sent ? (
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
               <div className="text-6xl mb-4"><CheckIcon className="h-16 w-16 text-green-500 mx-auto" /></div>
               <h2 className="text-2xl font-800 text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Message Sent!</h2>
              <p className="text-gray-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm font-600 hover:opacity-70 transition-opacity" style={{ color: '#1A4095' }}>Send another message</button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-700 text-gray-900 mb-6">Send Us a Message</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', placeholder: 'Your full name', type: 'text', span: false },
                  { label: 'Email Address', placeholder: 'your@email.com', type: 'email', span: false },
                  { label: 'Phone Number', placeholder: '+256 (0) 770 613 201', type: 'tel', span: false },
                  { label: 'Subject', placeholder: 'How can we help?', type: 'text', span: false },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea rows={5} placeholder="Tell us more about your enquiry..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-600 text-gray-500 mb-2 uppercase tracking-wider">I am a...</label>
                  <div className="flex flex-wrap gap-3">
                    {['Student', 'Tutor', 'School / Organization', 'Employer', 'Other'].map(role => (
                      <label key={role} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="radio" name="role" className="accent-blue-700" />
                        {role}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSent(true)}
                className="mt-6 w-full py-3.5 rounded-xl text-white font-700 text-base hover:opacity-90 transition-all"
                style={{ background: '#1A4095' }}
              >
                Send Message
              </button>
            </div>
          )}

          {/* Map */}
          <div className="mt-6 rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-52">
            <iframe
              src="https://www.google.com/maps?ll=-0.606781,30.661901&z=10&t=m&hl=en-US&gl=US&mapclient=embed&cid=8763999400868403491"
              className="h-full w-full"
              loading="lazy"
              title="Digtech Academy location"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PRINCIPAL DASHBOARD ──────────────────────────────────────────────────────
function PrincipalDashboard() {
  const [tab, setTab] = useState<'overview' | 'tutors' | 'students' | 'certificates' | 'applications'>('overview')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-5 border-b border-gray-100">
          <div className="font-700 text-lg" style={{ color: '#1A4095' }}>Digtech <span style={{ color: '#28C0F4' }}>Academy</span></div>
          <div className="text-xs text-gray-400 mt-0.5">Principal Panel</div>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-700" style={{ background: '#28C0F4' }}>JK</div>
            <div>
              <div className="font-600 text-sm text-gray-900">James Kakembo</div>
              <div className="text-xs text-gray-400">Principal</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { key: 'overview', label: 'Overview', icon: <BarChartIcon className="h-4 w-4" /> },
            { key: 'tutors', label: 'Tutors', icon: <UserCheckIcon className="h-4 w-4" /> },
            { key: 'students', label: 'Students', icon: <GraduationCapIcon className="h-4 w-4" /> },
            { key: 'certificates', label: 'Certificates', icon: <TrophyIcon className="h-4 w-4" /> },
            { key: 'applications', label: 'Live Applications', icon: <ClipboardListIcon className="h-4 w-4" /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all text-left ${tab === item.key ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              style={tab === item.key ? { background: '#1A4095' } : undefined}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <div className="text-xs font-600 text-amber-700">Note</div>
            <div className="text-xs text-amber-600 mt-0.5">You cannot modify system settings or create admins.</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {tab === 'overview' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Principal Overview</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Active Tutors', value: '48', icon: <UserCheckIcon className="h-5 w-5 text-gray-400" />, color: '#1A4095' },
                  { label: 'Total Students', value: '5,248', icon: <GraduationCapIcon className="h-5 w-5 text-gray-400" />, color: '#28C0F4' },
                  { label: 'Pending Certs', value: '12', icon: <TrophyIcon className="h-5 w-5 text-gray-400" />, color: '#F59E0B' },
                  { label: 'Live Applications', value: '7', icon: <ClipboardListIcon className="h-5 w-5 text-gray-400" />, color: '#10B981' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="mb-2">{s.icon}</div>
                    <div className="text-2xl font-800" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-1 font-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Notifications */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="font-700 text-gray-900 mb-4">Recent Notifications</h2>
                <div className="space-y-4">
                  {[
                    { icon: <SparklesIcon className="h-4 w-4 text-blue-500" />, text: 'New tutor registered: Josephine Aber (Mobile Dev)', time: '2 hours ago', type: 'blue' },
                    { icon: <ClipboardListIcon className="h-4 w-4 text-green-500" />, text: 'New live class application: PMP Course — Patricia Auma', time: '4 hours ago', type: 'green' },
                    { icon: <DollarSignIcon className="h-4 w-4 text-blue-500" />, text: 'New enrollment: Full Stack Web Dev — Brian Odhiambo', time: '6 hours ago', type: 'blue' },
                    { icon: <TrophyIcon className="h-4 w-4 text-amber-500" />, text: 'Certificate pending review: Sarah Namutebi — UI/UX Design', time: '1 day ago', type: 'amber' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                      <span className="flex-shrink-0">{n.icon}</span>
                      <div className="flex-1">
                        <div className="text-gray-700">{n.text}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tutor Performance */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-700 text-gray-900 mb-4">Top Tutor Performance</h2>
                <div className="space-y-4">
                  {TUTORS.map((t, i) => (
                    <div key={t.name} className="flex items-center gap-4">
                      <span className="text-sm font-700 text-gray-200 w-5">{i + 1}</span>
                      <img src={t.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-600 text-gray-900">{t.name}</span>
                          <span className="text-xs text-gray-400">{t.students} students</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(t.students / 600) * 100}%`, background: 'linear-gradient(to right, #1A4095, #28C0F4)' }} />
                        </div>
                      </div>
                      <StarRating rating={t.rating} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'tutors' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Manage Tutors</h1>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    {['All', 'Active', 'Suspended', 'Pending'].map(s => (
                      <button key={s} className={`text-xs font-600 px-3 py-1.5 rounded-full border transition-all ${s === 'All' ? 'text-white border-transparent' : 'border-gray-200 text-gray-500'}`} style={s === 'All' ? { background: '#1A4095' } : undefined}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { ...TUTORS[0], status: 'Active', courses: 4, joined: 'Jan 2024' },
                    { ...TUTORS[1], status: 'Active', courses: 3, joined: 'Feb 2024' },
                    { ...TUTORS[2], status: 'Suspended', courses: 2, joined: 'Mar 2024' },
                    { ...TUTORS[3], status: 'Pending', courses: 0, joined: 'Aug 2024' },
                  ].map((tutor, i) => (
                    <div key={i} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={tutor.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-600 text-sm text-gray-900">{tutor.name}</div>
                          <div className="text-xs text-gray-400">{tutor.specialty} · {tutor.courses} courses · Joined {tutor.joined}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge color={tutor.status === 'Active' ? 'green' : tutor.status === 'Suspended' ? 'red' : 'amber'}>{tutor.status}</Badge>
                        <div className="flex gap-2">
                          {tutor.status === 'Pending' && <button className="text-xs font-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90" style={{ background: '#10B981' }}>Activate</button>}
                          {tutor.status === 'Active' && <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">Suspend</button>}
                          {tutor.status === 'Suspended' && <button className="text-xs font-600 text-white px-3 py-1.5 rounded-lg" style={{ background: '#28C0F4' }}>Reactivate</button>}
                          <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'students' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Manage Students</h1>
              <div className="flex gap-3 mb-5">
                <input type="text" placeholder="Search students..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors" />
                <button className="text-sm font-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90" style={{ background: '#28C0F4' }}>+ Enroll Student</button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#f8faff' }}>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">Courses</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3.5 text-xs font-600 text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'Sarah Namutebi', phone: '+256 772 123 456', courses: 3, status: 'Active' },
                      { name: 'Brian Odhiambo', phone: '+256 701 234 567', courses: 1, status: 'Active' },
                      { name: 'Patricia Auma', phone: '+256 756 345 678', courses: 2, status: 'Active' },
                      { name: 'Moses Kibirige', phone: '+256 712 456 789', courses: 1, status: 'Suspended' },
                    ].map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-600 text-sm text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-400">{s.phone}</div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-500">{s.courses} enrolled</td>
                        <td className="px-5 py-4"><Badge color={s.status === 'Active' ? 'green' : 'red'}>{s.status}</Badge></td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">View</button>
                            <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'certificates' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Certificate Approvals</h1>
              <div className="space-y-4">
                {[
                  { student: 'Sarah Namutebi', course: 'UI/UX Design Fundamentals with Figma', completion: 100, submitted: '3 Aug 2024', status: 'Pending' },
                  { student: 'Moses Kibirige', course: 'Full Stack Web Development', completion: 100, submitted: '1 Aug 2024', status: 'Pending' },
                  { student: 'Patricia Auma', course: 'Digital Marketing Strategy', completion: 100, submitted: '28 Jul 2024', status: 'Approved' },
                ].map((cert, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fef3c7' }}><TrophyIcon className="h-6 w-6 text-amber-500" /></div>
                      <div>
                        <div className="font-700 text-gray-900">{cert.student}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{cert.course}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span><CheckCircleIcon className="h-4 w-4 text-green-500 inline mr-1" /> {cert.completion}% complete</span>
                          <span>Submitted {cert.submitted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge color={cert.status === 'Approved' ? 'green' : 'amber'}>{cert.status}</Badge>
                      {cert.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button className="text-xs font-600 text-white px-4 py-2 rounded-lg hover:opacity-90" style={{ background: '#10B981' }}>Approve</button>
                          <button className="text-xs font-600 px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'applications' && (
            <div>
              <h1 className="text-2xl font-800 text-gray-900 mb-6">Live Class Applications</h1>
              <div className="space-y-4">
                {[
                  { name: 'Brian Odhiambo', course: 'Certified Cloud Practitioner', phone: '+256 701 234 567', days: 'Mon, Wed, Fri', time: 'Evening (5PM – 9PM)', submitted: '4 Aug 2024', status: 'New' },
                  { name: 'Patricia Auma', course: 'Project Management Professional', phone: '+256 756 345 678', days: 'Sat, Sun', time: 'Morning (6AM – 12PM)', submitted: '3 Aug 2024', status: 'Contacted' },
                  { name: 'Annet Nampijja', course: 'Advanced Excel & Data Analysis', phone: '+256 745 456 789', days: 'Tue, Thu', time: 'Evening (5PM – 9PM)', submitted: '2 Aug 2024', status: 'Enrolled' },
                ].map((app, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-700 text-gray-900">{app.name}</div>
                        <div className="text-sm font-600 mt-0.5" style={{ color: '#28C0F4' }}>{app.course}</div>
                        <div className="text-sm text-gray-400 mt-0.5">{app.phone}</div>
                      </div>
                      <Badge color={app.status === 'New' ? 'amber' : app.status === 'Contacted' ? 'blue' : 'green'}>{app.status}</Badge>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm bg-gray-50 rounded-xl p-4">
                      <div><span className="text-gray-400">Preferred days: </span><span className="font-500 text-gray-700">{app.days}</span></div>
                      <div><span className="text-gray-400">Study time: </span><span className="font-500 text-gray-700">{app.time}</span></div>
                      <div><span className="text-gray-400">Applied: </span><span className="font-500 text-gray-700">{app.submitted}</span></div>
                    </div>
                    {app.status !== 'Enrolled' && (
                      <div className="flex gap-2 mt-4">
                        <button className="text-xs font-600 text-white px-4 py-2 rounded-lg hover:opacity-90" style={{ background: '#28C0F4' }}>Contact via SMS</button>
                        <button className="text-xs font-600 text-white px-4 py-2 rounded-lg hover:opacity-90" style={{ background: '#10B981' }}>Mark as Enrolled</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── LESSON PLAYER ─────────────────────────────────────────────────────────────
function LessonPlayerPage() {
  const [activeLesson, setActiveLesson] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set([0, 1]))
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'resources'>('overview')
  const [question, setQuestion] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)

  const lessons = [
    { title: 'Introduction & Course Setup', duration: '12:34', module: 'Module 1: Getting Started' },
    { title: 'Setting Up Your Development Environment', duration: '18:20', module: 'Module 1: Getting Started' },
    { title: 'Understanding HTML Structure', duration: '22:10', module: 'Module 2: HTML5' },
    { title: 'Semantic HTML5 Tags', duration: '15:45', module: 'Module 2: HTML5' },
    { title: 'Building a Complete Web Page', duration: '31:02', module: 'Module 2: HTML5' },
    { title: 'CSS Selectors & Specificity', duration: '19:30', module: 'Module 3: CSS3' },
    { title: 'Flexbox Layout System', duration: '25:14', module: 'Module 3: CSS3' },
    { title: 'CSS Grid Layout', duration: '28:40', module: 'Module 3: CSS3' },
  ]

  const questions = [
    {
      id: 0,
      student: 'Sarah Namutebi',
      avatar: '/images/pexels-photo-8384894.jpeg',
      text: 'How do I connect React to Supabase for authentication?',
      time: '2 hours ago',
      isBest: false,
      replies: [
        { author: 'David Ssekandi', istutor: true, text: 'Great question! You install the @supabase/supabase-js package and initialize the client with your project URL and anon key. Then wrap your app with a context provider. I\'ll cover this in detail in Module 7!', time: '1 hour ago' },
        { author: 'Brian Odhiambo', istutor: false, text: 'Also check out the Supabase docs at supabase.com/docs — they have a Next.js quickstart guide.', time: '45 min ago' },
      ],
    },
    {
      id: 1,
      student: 'Moses Kibirige',
      avatar: '/images/pexels-photo-35638373.jpeg',
      text: 'What\'s the difference between flexbox and CSS grid? When should I use which?',
      time: '5 hours ago',
      isBest: true,
      replies: [
        { author: 'David Ssekandi', istutor: true, text: 'Use Flexbox for one-dimensional layouts (row OR column). Use Grid for two-dimensional layouts (rows AND columns simultaneously). As a rule: components use Flexbox, page layouts use Grid.', time: '4 hours ago' },
      ],
    },
  ]

  const currentLesson = lessons[activeLesson]
  const progress = Math.round((completed.size / lessons.length) * 100)

  const modules = [...new Set(lessons.map(l => l.module))]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4">
        <div className="font-700 text-white text-sm" style={{ color: '#28C0F4' }}>Digtech Academy</div>
        <div className="h-4 w-px bg-gray-700" />
        <div className="text-white/60 text-sm truncate flex-1">Full Stack Web Development with React & Node.js</div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#28C0F4' }} />
          </div>
          <span className="text-xs text-gray-400">{progress}% complete</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto hidden lg:flex">
          <div className="p-4 border-b border-gray-800">
            <div className="text-xs font-600 text-gray-400 uppercase tracking-wider">Course Content</div>
            <div className="text-xs text-gray-500 mt-1">{lessons.length} lessons · 24 hours total</div>
          </div>
          {modules.map(mod => (
            <div key={mod}>
              <div className="px-4 py-3 text-xs font-700 text-gray-400 bg-gray-850 border-b border-gray-800 sticky top-0 bg-gray-900">
                {mod}
              </div>
              {lessons.filter(l => l.module === mod).map((lesson, idx) => {
                const globalIdx = lessons.indexOf(lesson)
                const isDone = completed.has(globalIdx)
                const isActive = globalIdx === activeLesson
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveLesson(globalIdx)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 text-sm transition-colors border-b border-gray-800/50 ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${isDone ? 'bg-emerald-500' : isActive ? 'border-2' : 'border border-gray-600'}`} style={isActive && !isDone ? { borderColor: '#28C0F4' } : undefined}>
                      {isDone ? <span className="text-emerald-500"><CheckIcon className="h-4 w-4 inline" /></span> : isActive ? <div className="w-2 h-2 rounded-full" style={{ background: '#28C0F4' }} /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`leading-snug ${isActive ? 'text-white font-600' : isDone ? 'text-gray-400' : 'text-gray-300'}`}>{lesson.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5"><TimerIcon className="h-3.5 w-3.5 text-gray-400 inline mr-1" /> {lesson.duration}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video */}
          <div className="relative bg-black" style={{ aspectRatio: '16/9', maxHeight: '55vh' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(40,192,244,0.2)', border: '2px solid #28C0F4' }}>
                  <PlayIcon className="h-10 w-10 text-white ml-1" />
                </div>
                <div className="text-white/60 text-sm">YouTube Privacy Enhanced Mode</div>
                <div className="text-white/40 text-xs mt-1">youtu.be/embed — no tracking, no suggested videos</div>
              </div>
            </div>
            {/* Fake video bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
              <div className="h-1 bg-white/20 rounded-full mb-2 cursor-pointer">
                <div className="h-full bg-red-500 rounded-full w-1/3" />
              </div>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <button className="hover:text-white"><PlayIcon className="h-4 w-4" /></button>
                <span className="text-xs">7:24 / {currentLesson.duration}</span>
                <div className="flex-1" />
                <button className="text-xs hover:text-white">0.75×</button>
                <button className="text-xs hover:text-white">1×</button>
                <button className="text-xs hover:text-white">1.5×</button>
                <button className="hover:text-white text-xs"><MaximizeIcon className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {/* Lesson info & tabs */}
          <div className="bg-white flex-1 p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-xs text-gray-400 mb-1">{currentLesson.module}</div>
                <h2 className="text-xl font-800 text-gray-900">{currentLesson.title}</h2>
              </div>
              <button
                onClick={() => {
                  const next = new Set(completed)
                  next.add(activeLesson)
                  setCompleted(next)
                  if (activeLesson < lessons.length - 1) setActiveLesson(activeLesson + 1)
                }}
                className="flex-shrink-0 text-sm font-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
                style={{ background: completed.has(activeLesson) ? '#10B981' : '#28C0F4' }}
              >
                {completed.has(activeLesson) ? <span className="flex items-center gap-1"><CheckCircleIcon className="h-4 w-4 text-emerald-500" /> Completed</span> : 'Mark Complete →'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 mb-6">
              {(['overview', 'questions', 'resources'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 text-sm font-600 capitalize border-b-2 transition-all ${activeTab === t ? 'border-b-2' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  style={activeTab === t ? { borderColor: '#1A4095', color: '#1A4095' } : undefined}
                >
                  {t} {t === 'questions' && `(${questions.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="max-w-2xl">
                <p className="text-gray-600 leading-relaxed mb-4">
                  In this lesson, you'll learn the core concepts of {currentLesson.title.toLowerCase()}. By the end, you'll have a solid understanding that will carry you through the rest of the course.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We cover practical examples using real-world scenarios relevant to the Ugandan and East African market, so the skills you learn here are immediately applicable.
                </p>
                <h3 className="font-700 text-gray-900 mb-3">What you'll learn in this lesson</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Core concepts and terminology', 'Hands-on implementation', 'Common mistakes to avoid', 'Best practices from industry'].map(item => (
                    <li key={item} className="flex items-center gap-2"><span className="text-emerald-500"><CheckIcon className="h-4 w-4 inline" /></span> {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask a question about this lesson..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                  <button
                    disabled={!question.trim()}
                    className="mt-2 text-sm font-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 transition-all"
                    style={{ background: '#1A4095' }}
                  >
                    Post Question
                  </button>
                </div>

                <div className="space-y-6">
                  {questions.map(q => (
                    <div key={q.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start gap-3">
                          <img src={q.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-600 text-sm text-gray-900">{q.student}</span>
                              {q.isBest && <span className="text-xs font-700 bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full flex items-center gap-1"><StarIconAlt className="h-3.5 w-3.5" /> Best Answer</span>}
                              <span className="text-xs text-gray-400">{q.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1.5">{q.text}</p>
                          </div>
                        </div>
                      </div>

                      {q.replies.length > 0 && (
                        <div className="border-t border-gray-50">
                          {q.replies.map((r, i) => (
                            <div key={i} className={`px-5 py-4 flex gap-3 ${r.istutor ? 'bg-blue-50/40' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0 ${r.istutor ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={r.istutor ? { background: '#1A4095' } : undefined}>
                                {r.author.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-600 text-sm">{r.author}</span>
                                  {r.istutor && <Badge color="blue">Tutor</Badge>}
                                  <span className="text-xs text-gray-400">{r.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{r.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                        <button onClick={() => setReplyTo(replyTo === q.id ? null : q.id)} className="text-xs font-600 hover:opacity-70" style={{ color: '#1A4095' }}>
                          ↩ Reply
                        </button>
                        {replyTo === q.id && (
                          <div className="mt-3 flex gap-2">
                            <input type="text" placeholder="Write a reply..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 transition-colors" />
                            <button className="text-xs font-600 text-white px-3 py-2 rounded-xl hover:opacity-90" style={{ background: '#28C0F4' }}>Send</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="max-w-lg">
                <p className="text-sm text-gray-500 mb-4">Downloadable materials for this lesson:</p>
                {[
                  { name: 'Lesson 3 — Slides.pdf', size: '2.4 MB', type: 'PDF' },
                  { name: 'Starter Code — HTML Templates.zip', size: '18 KB', type: 'ZIP' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 mb-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: r.type === 'PDF' ? '#fee2e2' : '#e8f0fb' }}>
                        {r.type === 'PDF' ? <FileTypeIcon className="h-5 w-5 text-red-500" /> : <FileArchiveIcon className="h-5 w-5 text-action" />}
                      </div>
                      <div>
                        <div className="text-sm font-600 text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.size}</div>
                      </div>
                    </div>
                    <button className="text-xs font-600 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5"><DownloadIcon className="h-3.5 w-3.5" /> Download</button>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-4">No additional resources for this lesson? Ask the tutor in the Questions tab.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LOGIN PAGE ─────────────────────────────────────────────────────────────
function LoginPage({ onLoginSuccess, setFrame }: { onLoginSuccess: (email: string, role: string) => void; setFrame: (f: Frame) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'tutor' | 'student'>('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')

  const handleQuickFill = () => {
    setEmail('admin@digtechacademy.ug')
    setPassword('Digtech@2024')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!email || !password || (mode === 'register' && !name)) {
      setError(mode === 'register' ? 'Please fill in all fields.' : 'Please enter both email and password.')
      triggerShake()
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      
      if (mode === 'register') {
        setSuccessMsg(`Account created successfully! Welcome to Digtech Academy, ${name.split(' ')[0]}.`)
        setTimeout(() => {
          onLoginSuccess(email, role)
        }, 1500)
        return
      }

      // Check admin credentials
      if (role === 'admin' && email.trim().toLowerCase() === 'admin@digtechacademy.ug' && password === 'Digtech@2024') {
        setSuccessMsg('Authentication successful! Redirecting to Admin Portal...')
        setTimeout(() => {
          onLoginSuccess(email, role)
        }, 1000)
      } else if (role !== 'admin') {
         setSuccessMsg(`Authentication successful! Redirecting to ${role} portal...`)
         setTimeout(() => {
           onLoginSuccess(email, role)
         }, 1000)
      } else {
        setError('Invalid credentials! Hint: Use admin@digtechacademy.ug / Digtech@2024')
        triggerShake()
      }
    }, 700)
  }

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2660 0%, #1A4095 50%, #0a1940 100%)' }}>
      {/* Background Animated Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl floating-orb pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl floating-orb-reverse pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#28C0F4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Main Login Card */}
      <div className={`relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in ${isShaking ? 'animate-shake' : ''}`}>
        {/* Top Header Accent */}
        <div className="p-1.5" style={{ background: 'linear-gradient(90deg, #1A4095, #28C0F4, #1A4095)' }} />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button onClick={() => setFrame('home')} className="inline-flex items-center gap-2.5 mb-4 group hover:scale-105 transition-transform">
              <img src="/digitechlogo.png" alt="Digtech Academy Logo" className="h-10 w-auto object-contain shadow-sm rounded-lg" />
            </button>
            <h1 className="text-2xl font-800 text-gray-900 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Portal {mode === 'login' ? 'Sign In' : 'Register'}</h1>
            <p className="text-xs text-gray-500 mt-1 font-500">Access your Digtech Academy admin control center</p>
          </div>

          {/* Quick Admin Auto-fill Pill */}
          {mode === 'login' && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100/80 rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-sm">
              <div>
                <span className="font-700 text-blue-900 block flex items-center gap-1.5"><SparklesIcon className="h-3.5 w-3.5" /> Demo Admin Account</span>
                <span className="text-blue-700/80 text-[11px]">admin@digtechacademy.ug</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="px-3 py-1.5 rounded-xl font-700 text-white shadow-sm hover:scale-105 transition-all text-xs"
                style={{ background: '#28C0F4' }}
              >
                Fill Credentials
              </button>
            </div>
          )}

          {/* Role selector tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            {(['admin', 'tutor', 'student'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-1.5 text-xs font-600 capitalize rounded-lg transition-all flex items-center justify-center gap-1 ${role === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${mode === 'register' && r === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={mode === 'register' && r === 'admin'}
              >
                {r === 'admin' ? <><ShieldIcon className="h-3.5 w-3.5" /> Admin</> : r === 'tutor' ? <><UserCheckIcon className="h-3.5 w-3.5" /> Tutor</> : <><GraduationCapIcon className="h-3.5 w-3.5" /> Student</>}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-500 flex items-start gap-2 animate-bounce-in">
              <AlertCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-600 flex items-center gap-2 animate-scale-in">
              <CheckIcon className="h-4 w-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-700 text-gray-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all input-glow focus:border-blue-500 bg-gray-50/50 focus:bg-white"
                  />
                  <span className="absolute left-3.5 top-3.5 text-gray-400"><UserIcon className="h-4 w-4" /></span>
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-700 text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@digtechacademy.ug"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all input-glow focus:border-blue-500 bg-gray-50/50 focus:bg-white"
                />
                <span className="absolute left-3.5 top-3.5 text-gray-400"><MailIcon className="h-4 w-4" /></span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-700 text-gray-700 uppercase tracking-wider">Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password hint: Digtech@2024') }} className="text-xs font-600 text-blue-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none transition-all input-glow focus:border-blue-500 bg-gray-50/50 focus:bg-white"
                />
                <span className="absolute left-3.5 top-3.5 text-gray-400"><LockIcon className="h-4 w-4" /></span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-500">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 accent-blue-600" />
                Remember this browser
              </label>
              <button type="button" onClick={() => {setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); if(role === 'admin') setRole('student')}} className="text-blue-600 font-600 hover:underline">
                {mode === 'login' ? 'Create an account' : 'Already have an account?'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-700 text-sm transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1A4095 0%, #28C0F4 100%)' }}
            >
              {isLoading ? (
                <>
                  <RefreshCwIcon className="animate-spin h-4 w-4 text-white" />
                  Authenticating...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In to Portal →' : 'Register Account →'}
                </>
              )}
            </button>
          </form>

          {/* Footer Back */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => setFrame('home')}
              className="text-xs font-600 text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1"
            >
              ← Return to Academy Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FRAME NAV (Demo switcher) ─────────────────────────────────────────────────
function FrameNav({ frame, setFrame }: { frame: Frame; setFrame: (f: Frame) => void }) {
  const frames: { key: Frame; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: 'lucide:home' },
    { key: 'courses', label: 'Courses', icon: 'lucide:book-open' },
    { key: 'live-courses', label: 'Live Classes', icon: 'lucide:video' },
    { key: 'about', label: 'About', icon: 'lucide:info' },
    { key: 'contact', label: 'Contact', icon: 'lucide:mail' },
    { key: 'login', label: 'Login', icon: 'lucide:lock' },
    { key: 'admin-dashboard', label: 'Admin', icon: 'lucide:settings' },
  ]
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex gap-1 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-xl p-1.5 max-w-[calc(100vw-32px)] overflow-x-auto">
      {frames.map(f => (
        <button
          key={f.key}
          onClick={() => setFrame(f.key)}
          className={`whitespace-nowrap text-xs font-600 px-3 py-2 rounded-xl transition-all flex-shrink-0 flex items-center gap-1.5 ${
            frame === f.key ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          style={frame === f.key ? { background: '#1A4095' } : undefined}
        >
          <Icon icon={f.icon} className="w-3.5 h-3.5" />
          {f.label}
        </button>
      ))}
    </div>
  )
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [frame, setFrame] = useState<Frame>('home')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const handleAdminLogin = (email: string, role: string) => {
    setIsAdminLoggedIn(true) // We will treat any logged in user as having admin rights for the demo
    if (role === 'admin') setFrame('admin-dashboard')
    else if (role === 'tutor') setFrame('tutor-dashboard')
    else if (role === 'student') setFrame('student-dashboard')
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    setFrame('home')
  }

  const handleFrameChange = (targetFrame: Frame) => {
    if (targetFrame === 'admin-dashboard' && !isAdminLoggedIn) {
      setFrame('login')
      return
    }
    setFrame(targetFrame)
  }

  const isDashboard = ['student-dashboard', 'tutor-dashboard', 'admin-dashboard', 'principal-dashboard', 'lesson-player', 'login'].includes(frame)

  return (
    <div className="min-h-screen bg-white">
      {!isDashboard && (
        <PublicNav frame={frame} setFrame={handleFrameChange} isAdminLoggedIn={isAdminLoggedIn} onLogout={handleAdminLogout} />
      )}

      <div key={frame} className="page-enter">
        {frame === 'home' && <HomePage setFrame={handleFrameChange} />}
        {frame === 'courses' && <CoursesPage setFrame={handleFrameChange} />}
        {frame === 'course-detail' && <CourseDetailPage />}
        {frame === 'live-courses' && <LiveCoursesPage />}
        {frame === 'about' && <AboutPage />}
        {frame === 'contact' && <ContactPage />}
        {frame === 'lesson-player' && <LessonPlayerPage />}
        {frame === 'student-dashboard' && <StudentDashboard />}
        {frame === 'tutor-dashboard' && <TutorDashboard />}
        {frame === 'principal-dashboard' && <PrincipalDashboard />}
        {frame === 'login' && <LoginPage onLoginSuccess={handleAdminLogin} setFrame={handleFrameChange} />}
        {frame === 'admin-dashboard' && <AdminDashboard onLogout={handleAdminLogout} setFrame={handleFrameChange} />}
      </div>

      {/* Demo frame switcher */}
      <div className="pb-20">
        <FrameNav frame={frame} setFrame={handleFrameChange} />
      </div>
    </div>
  )
}

