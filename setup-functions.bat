@echo off
REM Firebase Functions Setup Script for Windows
REM Run this in Command Prompt (cmd.exe)

echo ======================================
echo Setting up Firebase Functions
echo ======================================

REM Check if Firebase CLI is installed
where firebase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing Firebase CLI...
    npm install -g firebase-tools
)

REM Login to Firebase
echo Please login to Firebase...
firebase login

REM Initialize functions
echo Initializing Firebase Functions...
firebase init functions

REM Ask for Paystack secret key
echo.
echo Enter your Paystack Secret Key (sk_live_...):
set /p PAYSTACK_SECRET=

REM Set the Paystack secret key
echo Setting Paystack secret key...
firebase functions:config:set paystack.secret_key=%PAYSTACK_SECRET%

REM Deploy functions
echo Deploying Firebase Functions...
firebase deploy --only functions

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. The payment verification function is now active
echo 2. Update your frontend to use server verification (optional)
echo.
pause
