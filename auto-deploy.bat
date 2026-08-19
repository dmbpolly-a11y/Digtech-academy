@echo off
echo Creating deployment commit...
git commit --allow-empty -m "deploy: trigger vercel with all improvements"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo Done! Check https://vercel.com/dashboard for deployment status
echo Visit https://digtech-academy.vercel.app in 3-5 minutes
