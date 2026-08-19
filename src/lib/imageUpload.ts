import { supabase } from './supabase'

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (e.g., 'courses', 'profiles', 'testimonials')
 * @param folder - Optional subfolder within the bucket
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'course-images',
  folder?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return { url: null, error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images.' }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { url: null, error: 'File too large. Maximum size is 5MB.' }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { url: null, error: 'Failed to upload image' }
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image
 * @param bucket - The storage bucket name
 */
export async function deleteImage(
  url: string,
  bucket: string = 'course-images'
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`${bucket}/`)
    if (urlParts.length < 2) {
      return { success: false, error: 'Invalid image URL' }
    }
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: 'Failed to delete image' }
  }
}

/**
 * Update an image (delete old, upload new)
 * @param oldUrl - URL of the image to replace
 * @param newFile - New image file
 * @param bucket - The storage bucket name
 * @param folder - Optional subfolder
 */
export async function updateImage(
  oldUrl: string | null,
  newFile: File,
  bucket: string = 'course-images',
  folder?: string
): Promise<{ url: string | null; error: string | null }> {
  // Delete old image if exists
  if (oldUrl) {
    await deleteImage(oldUrl, bucket)
  }

  // Upload new image
  return uploadImage(newFile, bucket, folder)
}
