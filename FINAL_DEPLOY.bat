@echo off
cls
color 0A
echo.
echo ========================================================
echo           DIGTECH ACADEMY - FINAL DEPLOYMENT
echo ========================================================
echo.
echo This script will deploy your site to Vercel
echo.
echo IMPORTANT: Keep this window open and follow prompts!
echo.
pause

echo.
echo ========================================================
echo   STEP 1: Installing Vercel CLI
echo ========================================================
echo.
call npm install -g vercel
if errorlevel 1 (
    echo.
    echo ERROR: Could not install Vercel CLI
    echo Please run PowerShell as Administrator and type:
    echo Set-ExecutionPolicy RemoteSigned
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   STEP 2: Login to Vercel
echo ========================================================
echo.
echo A browser window will open...
echo Login with your Vercel account
echo Then come back to this window
echo.
pause
call vercel login

echo.
echo ========================================================
echo   STEP 3: Deploy to Production
echo ========================================================
echo.
echo Answer the questions:
echo - "Set up and deploy?" Type: Y
echo - "Which scope?" Choose your team/account
echo - "Link to existing project?" Type: N
echo - "Project name?" Type: digtech-academy
echo - "Directory?" Just press ENTER
echo - "Override settings?" Type: N
echo.
pause

call vercel --prod

echo.
echo ========================================================
echo   DEPLOYMENT COMPLETE!
echo ========================================================
echo.
echo Your site is now live!
echo Copy the URL shown above and open it in your browser.
echo.
echo All your improvements are now deployed:
echo   - Poppins and Montserrat fonts
echo   - Search functionality
echo   - Dark footer with white logo
echo   - Whitepapers section
echo   - Payment success toast
echo   - Expandable testimonials
echo   - Live course promotion
echo   - And more!
echo.
pause
