import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { db } from '../lib/supabase'

interface EnrollmentFormProps {
  onClose: () => void
  onSuccess: () => void
  preSelectedCourse?: { id: number; title: string }
}

export function EnrollmentForm({ onClose, onSuccess, preSelectedCourse }: EnrollmentFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [error, setError] = useState('')

  // Personal Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('Uganda')

  // Address Information
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [country, setCountry] = useState('Uganda')

  // Educational Background
  const [educationLevel, setEducationLevel] = useState('')
  const [institution, setInstitution] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')

  // Course Selection
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
    preSelectedCourse?.id || null
  )
  const [studyMode, setStudyMode] = useState('online')
  const [preferredSchedule, setPreferredSchedule] = useState('')

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Additional Info
  const [priorExperience, setPriorExperience] = useState('')
  const [motivation, setMotivation] = useState('')
  const [howDidYouHear, setHowDidYouHear] = useState('')

  // Load available courses
  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const { data, error } = await db.courses.getAll()
      if (error) {
        console.error('Error loading courses:', error)
        return
      }
      // Only show published courses
      const publishedCourses = data?.filter((c: any) => c.status === 'published') || []
      setCourses(publishedCourses)
    } catch (err) {
      console.error('Error loading courses:', err)
    }
  }

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required')
      return false
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!phone.trim() || !/^(\+?256|0)?[7][0-9]{8}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number (e.g., 0770123456)')
      return false
    }
    if (!dateOfBirth) {
      setError('Date of birth is required')
      return false
    }
    if (!gender) {
      setError('Please select your gender')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!address.trim() || !city.trim() || !district.trim()) {
      setError('Please complete all address fields')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!educationLevel) {
      setError('Please select your education level')
      return false
    }
    return true
  }

  const validateStep4 = () => {
    if (!selectedCourseId) {
      setError('Please select a course to enroll in')
      return false
    }
    if (!preferredSchedule) {
      setError('Please select your preferred schedule')
      return false
    }
    return true
  }

  const validateStep5 = () => {
    if (!emergencyName.trim() || !emergencyPhone.trim() || !emergencyRelation.trim()) {
      setError('All emergency contact fields are required')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    if (step === 4 && !validateStep4()) return
    if (step === 5 && !validateStep5()) return

    setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create enrollment application
      const { data, error: enrollError } = await db.enrollments.create({
        course_id: selectedCourseId,
        student_email: email,
        student_name: `${firstName} ${lastName}`,
        student_phone: phone,
        status: 'pending',
        application_data: {
          personal: { firstName, lastName, email, phone, dateOfBirth, gender, nationality },
          address: { address, city, district, country },
          education: { educationLevel, institution, fieldOfStudy },
          course: { courseId: selectedCourseId, studyMode, preferredSchedule },
          emergency: { name: emergencyName, phone: emergencyPhone, relation: emergencyRelation },
          additional: { priorExperience, motivation, howDidYouHear },
          submittedAt: new Date().toISOString()
        }
      })

      if (enrollError) {
        setError('Failed to submit application. Please try again.')
        setLoading(false)
        return
      }

      setLoading(false)
      onSuccess()
    } catch (err) {
      console.error('Enrollment error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Course Enrollment Application
              </h2>
              <p className="text-xs text-blue-100 mt-1">Step {step} of 6 - {
                step === 1 ? 'Personal Information' :
                step === 2 ? 'Address Details' :
                step === 3 ? 'Educational Background' :
                step === 4 ? 'Course Selection' :
                step === 5 ? 'Emergency Contact' :
                'Review & Submit'
              }</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0770123456"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Gender *
                    </label>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Uganda"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Plot 123 Main Street"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Kampala"
                      className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g., Kampala"
                      className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Uganda"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Educational Background */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Highest Education Level *
                  </label>
                  <select
                    required
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Select your education level</option>
                    <option value="secondary">Secondary School (O-Level)</option>
                    <option value="alevel">Advanced Level (A-Level)</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Institution/School Name
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g., Makerere University"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Field of Study/Major
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g., Computer Science, Business, etc."
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Course Selection */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Select Course *
                  </label>
                  <select
                    required
                    value={selectedCourseId || ''}
                    onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                    disabled={!!preSelectedCourse}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-100"
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} - UGX {(course.price || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {preSelectedCourse && (
                    <p className="text-xs text-gray-500 mt-1">Course pre-selected from course page</p>
                  )}
                </div>

                {selectedCourse && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <h4 className="font-bold text-sm text-gray-900 mb-2">{selectedCourse.title}</h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{selectedCourse.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600">UGX {(selectedCourse.price || 0).toLocaleString()}</span>
                      <span className="text-gray-500">{selectedCourse.duration || 'Flexible duration'}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Study Mode *
                  </label>
                  <select
                    required
                    value={studyMode}
                    onChange={(e) => setStudyMode(e.target.value)}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="online">Online Only</option>
                    <option value="physical">Physical Classes</option>
                    <option value="hybrid">Hybrid (Online + Physical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Preferred Schedule *
                  </label>
                  <select
                    required
                    value={preferredSchedule}
                    onChange={(e) => setPreferredSchedule(e.target.value)}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Select your preferred time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (1PM - 5PM)</option>
                    <option value="evening">Evening (6PM - 9PM)</option>
                    <option value="weekend">Weekend Only</option>
                    <option value="flexible">Flexible/Self-Paced</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 5: Emergency Contact */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-gray-600 mb-4">
                  Please provide emergency contact information (parent, guardian, or next of kin)
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="0770123456"
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Relationship *
                  </label>
                  <select
                    required
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Select relationship</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="sibling">Sibling</option>
                    <option value="spouse">Spouse</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 6: Additional Information */}
            {step === 6 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Prior Experience or Skills (Optional)
                  </label>
                  <textarea
                    value={priorExperience}
                    onChange={(e) => setPriorExperience(e.target.value)}
                    placeholder="Tell us about any relevant experience or skills you have..."
                    rows={3}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Why do you want to take this course? (Optional)
                  </label>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Share your motivation and career goals..."
                    rows={3}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    How did you hear about us? (Optional)
                  </label>
                  <select
                    value={howDidYouHear}
                    onChange={(e) => setHowDidYouHear(e.target.value)}
                    className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Select an option</option>
                    <option value="google">Google Search</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="friend">Friend/Referral</option>
                    <option value="poster">Poster/Flyer</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <h4 className="font-bold text-sm text-green-900 mb-2 flex items-center gap-2">
                    <Icon icon="lucide:check-circle" className="w-5 h-5" />
                    Ready to Submit
                  </h4>
                  <p className="text-xs text-green-700">
                    Your application will be reviewed within 24-48 hours. You'll receive a confirmation email with next steps.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2"
            >
              Next Step
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon icon="lucide:send" className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
