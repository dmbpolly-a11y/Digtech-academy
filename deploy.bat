@echo off
cls
echo ========================================================
echo        DIGTECH ACADEMY - PRODUCTION DEPLOYMENT
echo ========================================================
echo.
echo [1/2] Connecting to Vercel...
echo If a browser opens, click 'Authorize' to log in.
echo.
call npx vercel login
if errorlevel 1 (
    echo.
    echo Login failed or cancelled.
    pause
    exit /b 1
)

echo.
echo [2/2] Building and deploying to production...
echo.
call npx vercel --prod --yes

echo.
echo ========================================================
echo   DEPLOYMENT COMPLETE!
echo   Check your site at: https://digtech-academy.vercel.app
echo ========================================================
echo.
pause
