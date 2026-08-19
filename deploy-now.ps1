# Force deployment script
Write-Host "=== Digtech Academy Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "1. Checking git status..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "   Uncommitted changes found!" -ForegroundColor Red
    git status
    exit 1
} else {
    Write-Host "   ✓ Working tree clean" -ForegroundColor Green
}

# Get current commit
Write-Host ""
Write-Host "2. Current local commit:" -ForegroundColor Yellow
$localCommit = git rev-parse HEAD
Write-Host "   $localCommit" -ForegroundColor Cyan

# Check remote commit
Write-Host ""
Write-Host "3. Checking remote commit..." -ForegroundColor Yellow
$remoteCommit = git rev-parse origin/main
Write-Host "   $remoteCommit" -ForegroundColor Cyan

# Compare
Write-Host ""
if ($localCommit -eq $remoteCommit) {
    Write-Host "✓ Local and remote are in sync!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your changes ARE pushed to GitHub." -ForegroundColor Green
    Write-Host ""
    Write-Host "If Vercel isn't updating, try these:" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Find 'digtech-academy' project" -ForegroundColor White
    Write-Host "3. Click 'Redeploy' on the latest deployment" -ForegroundColor White
    Write-Host "4. Or make an empty commit:" -ForegroundColor White
    Write-Host "   git commit --allow-empty -m 'trigger deploy'" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor Cyan
} else {
    Write-Host "✗ Local and remote are OUT OF SYNC!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Attempting to push now..." -ForegroundColor Yellow
    
    # Try pushing
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Push successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Vercel should auto-deploy in 2-5 minutes." -ForegroundColor Green
        Write-Host "Check: https://vercel.com/dashboard" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Push failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error details above. Common fixes:" -ForegroundColor Yellow
        Write-Host "1. Check internet connection" -ForegroundColor White
        Write-Host "2. Verify GitHub credentials" -ForegroundColor White
        Write-Host "3. Try: git push origin main --force" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=== Script Complete ===" -ForegroundColor Cyan
