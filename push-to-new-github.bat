@echo off
echo ============================================
echo   PUSH TO NEW GITHUB REPOSITORY
echo ============================================
echo.
echo IMPORTANT: First create the repository on GitHub!
echo Go to: https://github.com/new
echo Repository name: digtech-academy
echo Then come back and press any key...
echo.
pause

echo.
echo Enter your GitHub username (e.g., dmbpolly-a11y):
set /p GITHUB_USER=Username: 

echo.
echo Enter your repository name (e.g., digtech-academy):
set /p REPO_NAME=Repository name: 

echo.
echo [1/4] Removing old remote...
git remote remove origin 2>nul

echo.
echo [2/4] Adding new remote...
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo [3/4] Renaming branch to main (if needed)...
git branch -M main

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main

echo.
echo ============================================
echo   DONE!
echo ============================================
echo.
echo Your code is now on GitHub at:
echo https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
echo Now you can import it to Vercel!
echo.
pause
