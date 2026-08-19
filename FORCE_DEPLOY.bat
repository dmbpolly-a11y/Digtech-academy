@echo off
echo ============================================
echo   FORCE VERCEL DEPLOYMENT SCRIPT
echo ============================================
echo.
echo This will create a new commit and push to trigger deployment...
echo.
pause

echo.
echo [1/3] Creating deployment commit...
git commit --allow-empty -m "deploy: force vercel deployment with all improvements"

echo.
echo [2/3] Pushing to GitHub...
git push origin main

echo.
echo [3/3] Done!
echo.
echo ============================================
echo   NEXT STEPS:
echo ============================================
echo.
echo 1. Check Vercel dashboard: https://vercel.com/dashboard
echo 2. You should see a new deployment starting
echo 3. Wait 3-5 minutes for build to complete
echo 4. Visit: https://digtech-academy.vercel.app
echo.
echo Your changes include:
echo   - New fonts (Poppins and Montserrat)
echo   - Search functionality in navbar
echo   - Dark footer with white logo
echo   - Whitepapers section
echo   - Payment success toast
echo   - Expandable testimonials
echo   - Live course promotion cards
echo   - Course ordering with emoji priority
echo   - Location icons on courses
echo.
echo ============================================
pause
