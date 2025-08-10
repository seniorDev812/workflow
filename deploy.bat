@echo off
echo ========================================
echo    Asir Group Website Deployment
echo ========================================
echo.

echo Checking if Vercel CLI is installed...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI. Please install manually:
        echo npm install -g vercel
        pause
        exit /b 1
    )
)

echo.
echo Starting deployment to Vercel...
echo.
vercel --prod

echo.
echo Deployment completed!
echo.
pause
