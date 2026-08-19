@echo off
echo ========================================
echo   Deploying to GitHub Pages
echo ========================================
echo.

REM Build the project
echo Building project...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

REM Create gh-pages branch if it doesn't exist
echo.
echo Setting up gh-pages branch...
git branch gh-pages 2>nul
git checkout gh-pages
if errorlevel 1 (
    echo Creating new gh-pages branch...
    git checkout --orphan gh-pages
)

REM Copy dist contents to root
echo.
echo Copying build files...
xcopy /E /I /Y dist\* .

REM Add and commit
echo.
echo Committing changes...
git add -A
git commit -m "Deploy to GitHub Pages"

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push origin gh-pages --force

REM Switch back to main
echo.
echo Switching back to main branch...
git checkout main

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your site will be available at:
echo https://dmbpolly-a11y.github.io/digtech-academy/
echo.
echo Note: It may take 2-3 minutes for GitHub Pages to update.
echo.
pause
