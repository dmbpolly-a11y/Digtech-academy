@echo off
echo ============================================
echo   DEPLOY VIA VERCEL CLI
echo ============================================
echo.
echo This will deploy your project directly from your computer
echo.
pause

echo.
echo [1/3] Installing Vercel CLI (if not installed)...
call npm install -g vercel

echo.
echo [2/3] Logging in to Vercel...
call vercel login

echo.
echo [3/3] Deploying to production...
call vercel --prod

echo.
echo ============================================
echo   DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo Your site should now be live on Vercel
echo Check the URL shown above
echo.
pause
