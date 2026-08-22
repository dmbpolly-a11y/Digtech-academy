import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { db } from '../lib/supabase'
import { uploadImage } from '../lib/imageUpload'

interface CourseFormProps {
  onClose: () => void
  onSuccess: () => void
  editingCourse?: any
  tutorId: string
}

export function CourseForm({ onClose, onSuccess, editingCourse, tutorId }: CourseFormProps) {
  const [title, setTitle] = useState(editingCourse?.title || '')
  const [description, setDescription] = useState(editingCourse?.description || '')
  const [category, setCategory] = useState(editingCourse?.category || 'Web Development')
  const [level, setLevel] = useState(editingCourse?.level || 'beginner')
  const [price, setPrice] = useState(editingCourse?.price || 0)
  const [duration, setDuration] = useState(editingCourse?.duration || '')
  const [isFree, setIsFree] = useState(editingCourse?.is_free || false)
  const [isLive, setIsLive] = useState(editingCourse?.is_live || false)
  const [videoUrl, setVideoUrl] = useState(editingCourse?.video_url || '')
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(editingCourse?.image_url || null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    'Web Development',
    'Data Science',
    'Design',
    'Marketing',
    'Security',
    'Mobile Dev',
    'Business',
    'Finance',
    'Photography',
    'Writing',
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please upload JPG, PNG, GIF, or WebP images')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setImageFile(file)
    
    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate required fields
      if (!title.trim()) {
        setError('Course title is required')
        setLoading(false)
        return
      }

      if (!description.trim()) {
        setError('Course description is required')
        setLoading(false)
        return
      }

      if (!duration.trim()) {
        setError('Course duration is required')
        setLoading(false)
        return
      }

      // Upload image if new file selected
      let imageUrl = editingCourse?.image_url || null
      if (imageFile) {
        const { url, error: uploadError } = await uploadImage(imageFile, 'course-images', tutorId)
        
        if (uploadError || !url) {
          setError(uploadError || 'Failed to upload image')
          setLoading(false)
          return
        }
        
        imageUrl = url
      }

      // Prepare course data
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        tutor_id: tutorId,
        price: isFree ? 0 : Number(price),
        category,
        level,
        duration: duration.trim(),
        image_url: imageUrl,
        video_url: videoUrl.trim() || null,
        is_free: isFree,
        is_live: isLive,
        status: 'draft', // Pending admin approval
      }

      if (editingCourse) {
        // Update existing course
        const { data, error: updateError } = await db.courses.update(editingCourse.id, courseData)
        
        if (updateError) {
          setError(updateError.message || 'Failed to update course')
          setLoading(false)
          return
        }
      } else {
        // Create new course
        const { data, error: createError } = await db.courses.create(courseData)
        
        if (createError) {
          setError(createError.message || 'Failed to create course')
          setLoading(false)
          return
        }
      }

      // Success!
      setLoading(false)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Course submission error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              {editingCourse ? 'Update course details' : 'Add a new course to your catalog'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <Icon icon="lucide:x" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <Icon icon="lucide:alert-circle" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Course Image Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Course Image *
            </label>
            
            {imagePreview ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border-2 border-blue-100 group">
                <img 
                  src={imagePreview} 
                  alt="Course preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-all"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <label className="block w-full h-56 border-2 border-dashed border-blue-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Icon icon="lucide:image-plus" className="w-16 h-16 text-blue-400 mb-4" />
                  <div className="text-sm font-bold text-gray-700 mb-2">
                    Click to upload course image
                  </div>
                  <div className="text-xs text-gray-500">
                    Upload from computer or phone • JPG, PNG, GIF, WebP (max 5MB)
                  </div>
                </div>
              </label>
            )}
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Course Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Web Development Bootcamp"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
              required
            />
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Course Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm resize-none"
              required
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Duration *
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 12 hours, 6 weeks"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Price (UGX) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="95000"
                min="0"
                disabled={isFree}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm disabled:bg-gray-100"
                required={!isFree}
              />
            </div>
          </div>

          {/* Video URL (optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Intro Video URL (Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/@DigiTechFX/watch?v=..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => {
                  setIsFree(e.target.checked)
                  if (e.target.checked) setPrice(0)
                }}
                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-gray-700">Free Course</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-gray-700">Live Course</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1A4095] to-[#28C0F4] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  {editingCourse ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Icon icon="lucide:check" className="w-4 h-4" />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>

          {!editingCourse && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-xs text-blue-800">
              <Icon icon="lucide:info" className="w-4 h-4 inline mr-2" />
              <strong>Note:</strong> Your course will be in "Draft" status and pending admin approval before going live.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
