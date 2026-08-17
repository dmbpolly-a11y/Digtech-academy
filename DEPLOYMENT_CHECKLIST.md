# Deployment Checklist for Digtech Academy

## 🔍 Pre-Deployment Checklist

### 1. Test Build Locally
```bash
npm run build
```
- ✅ Should complete without errors
- ✅ Check the `dist` folder is created
- ✅ No TypeScript errors

### 2. Test Production Build Locally
```bash
npm run preview
```
- ✅ Open http://localhost:4173 (or the port shown)
- ✅ Test all new features work correctly
- ✅ Check responsive design on mobile view

### 3. Verify Environment Variables
Make sure these are set in Vercel Dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_SITE_URL` (if using Next.js features)
- Any Supabase or API keys
- Payment gateway credentials

### 4. Check Asset Files
Verify these logo files exist in `public/images/`:
- ✅ `Digtech Academy Logo.png`
- ✅ `Digtech Academy Logo White.png`
- ✅ `Digtech Academy Logo Icon.png`
- ✅ `Digtech Academy Logo Icon White.png`

### 5. Git Commit Status
```bash
git status
git add .
git commit -m "feat: site improvements - fonts, search, payment toast, testimonials"
git push origin main
```

---

## 🚀 Deployment Options

### Option A: Automatic Deployment (If Connected to Git)

1. **Push to GitHub/GitLab/Bitbucket:**
   ```bash
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Vercel will detect the push
   - Build starts automatically
   - Check deployment progress at: https://vercel.com/dashboard

3. **Monitor Deployment:**
   - Go to https://vercel.com/your-username/digtech-academy
   - Click on the deployment in progress
   - Check build logs for any errors

### Option B: Manual Deployment via CLI

```bash
# Install Vercel CLI globally (one-time)
npm install -g vercel

# Login to Vercel (one-time)
vercel login

# Deploy to production
vercel --prod
```

### Option C: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your "digtech-academy" project
3. Click "Deployments" tab
4. Click "Deploy" button
5. Select the branch (usually `main`)
6. Click "Deploy"

---

## ✅ Post-Deployment Verification

### Test These Features on https://digtechacademy.vercel.app:

#### 1. **Fonts**
- [ ] Headers should use Montserrat (bold, strong)
- [ ] Body text should use Poppins (clean, readable)
- [ ] Inspect in DevTools: Check computed font-family

#### 2. **Search Functionality**
- [ ] Click search icon in navbar
- [ ] Search bar should expand smoothly
- [ ] Type "web development" and press Enter
- [ ] Should redirect to `/courses?search=web+development`
- [ ] Clear button (X) should work

#### 3. **Course Features**
- [ ] Go to `/courses`
- [ ] Courses with emojis in titles should appear first (if any)
- [ ] Each course card should show location icon with "Online • Self-paced"
- [ ] Click on a course
- [ ] Should see "Want Live Instruction?" card
- [ ] "View Live Classes" button should work

#### 4. **Payment Success Toast**
- [ ] Visit: `/?payment=success&amount=95000&course=Python`
- [ ] Green toast should appear in top-right corner
- [ ] Should show: "Payment successful! You're now enrolled in Python."
- [ ] Should auto-dismiss after 8 seconds
- [ ] Close button should work

#### 5. **Footer**
- [ ] Footer should have dark background (#04263A)
- [ ] White logo should be visible
- [ ] Should have 5 columns (on desktop)
- [ ] Whitepapers section should exist with 3 links
- [ ] Support & Contact section should have:
   - Location (Level 2 Grand West Arcade...)
   - Phone link (clickable, opens phone app)
   - Email link (clickable, opens email)
   - Admin Portal link
- [ ] Social media icons should hover to cyan color
- [ ] Copyright year should be current year (2024)
- [ ] Payment partner: "PesaPal Uganda"

#### 6. **Testimonials**
- [ ] Go to homepage
- [ ] Scroll to "What students say" section
- [ ] Each testimonial should have:
   - Student avatar with initial
   - 5 gold stars
   - Truncated text with "Read more" button
- [ ] Click "Read more" - should expand
- [ ] Click "Show less" - should collapse

#### 7. **Mobile Responsiveness**
- [ ] Test on mobile viewport (DevTools)
- [ ] Navbar hamburger menu should work
- [ ] Search should work on mobile
- [ ] Footer should stack vertically
- [ ] All buttons should be tappable

#### 8. **Performance**
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify images load properly
- [ ] No console errors

---

## 🐛 Common Deployment Issues & Fixes

### Issue 1: Build Fails with Font Errors
**Fix:**
- Google Fonts should load automatically
- Check `src/app/layout.tsx` has correct imports
- Verify internet connection during build (fonts load from CDN)

### Issue 2: Images Not Loading
**Fix:**
```bash
# Verify images exist
ls public/images/Digtech*.png

# Should show 4 files:
# Digtech Academy Logo.png
# Digtech Academy Logo White.png
# Digtech Academy Logo Icon.png
# Digtech Academy Logo Icon White.png
```

### Issue 3: Search Not Working
**Fix:**
- Check if Next.js router is properly configured
- Verify `useRouter` import from 'next/navigation'
- Check browser console for errors

### Issue 4: Payment Toast Not Showing
**Fix:**
- Verify `Suspense` wrapper in `src/app/(site)/layout.tsx`
- Check if `useSearchParams` is working
- Try adding `use client` directive if missing

### Issue 5: TypeScript Errors
**Fix:**
```bash
# Check for type errors
npx tsc --noEmit

# Fix missing types
npm install -D @types/node @types/react @types/react-dom
```

---

## 📊 Deployment Timeline

Typical deployment takes:
- **Build Time:** 2-5 minutes
- **Propagation:** Instant (Vercel Edge Network)
- **Total:** ~5 minutes from push to live

---

## 🔗 Important Links

- **Production Site:** https://digtechacademy.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Logs:** https://vercel.com/your-username/digtech-academy/deployments
- **Analytics:** https://vercel.com/your-username/digtech-academy/analytics

---

## 📞 If Deployment Fails

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments → Click failed deployment
   - Read error messages carefully

2. **Common Fixes:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Try building again
   npm run build
   ```

3. **Rollback if Needed:**
   - Go to Vercel Dashboard → Deployments
   - Find the last successful deployment
   - Click "Promote to Production"

4. **Contact Support:**
   - Vercel Support: https://vercel.com/support
   - Check Vercel Status: https://vercel-status.com

---

## ✨ Success Indicators

You'll know deployment succeeded when:
- ✅ Vercel shows "Deployment Complete" with green checkmark
- ✅ Site URL loads without errors
- ✅ All 11 new features work as expected
- ✅ No console errors in browser DevTools
- ✅ Lighthouse score is good (>90)

---

**Ready to Deploy?** Follow the steps above and your improvements will be live! 🚀
