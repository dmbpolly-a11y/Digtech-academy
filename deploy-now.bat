@echo off
echo === Digtech Academy Deployment ===
echo.

echo Checking current commit...
git log -1 --oneline

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo If push succeeded, check Vercel in 3-5 minutes:
echo https://vercel.com/dashboard
echo.
echo If nothing happens, try:
echo git commit --allow-empty -m "trigger deploy"
echo git push origin main
echo.
pause
