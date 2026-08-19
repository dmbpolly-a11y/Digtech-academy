@echo off
cls
echo ============================================
echo   DEPLOY DIRECTLY TO VERCEL
echo ============================================
echo.
echo This will deploy your site directly from your computer
echo No GitHub needed!
echo.
pause

echo.
echo Step 1: Installing Vercel CLI...
echo.
call npm install -g vercel
echo.

echo Step 2: Logging into Vercel...
echo.
echo A browser window will open for login
echo.
call vercel login
echo.

echo Step 3: Deploying to production...
echo.
call vercel --prod
echo.

echo ============================================
echo   DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo Your site should now be live!
echo Check the URL shown above.
echo.
pause
