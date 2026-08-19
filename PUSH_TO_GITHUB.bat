@echo off
cls
echo ============================================
echo   PUSH TO GITHUB - DIGTECH ACADEMY
echo ============================================
echo.
echo STEP 1: Create repository on GitHub first!
echo.
echo Go to: https://github.com/new
echo Repository name: digtech-academy
echo Make it PUBLIC
echo DO NOT check any boxes
echo Click "Create repository"
echo.
echo Once created, press any key to continue...
pause
echo.
echo ============================================
echo.

echo Removing old remote...
git remote remove origin 2>nul

echo Adding new remote...
git remote add origin https://github.com/dmbpolly-a11y/digtech-academy.git

echo Setting branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo.
echo ============================================
echo   SUCCESS!
echo ============================================
echo.
echo Your code is now on GitHub at:
echo https://github.com/dmbpolly-a11y/digtech-academy
echo.
echo Next: Import this repository to Vercel
echo 1. Go to https://vercel.com/new
echo 2. Find "digtech-academy" in the list
echo 3. Click "Import"
echo 4. Click "Deploy"
echo.
pause
