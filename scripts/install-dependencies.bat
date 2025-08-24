@echo off
setlocal enabledelayedexpansion

REM Loopay - Complete Development Environment Setup Script for Windows
REM This script installs all required software for running and building the Loopay project

echo ================================
echo Loopay Development Environment Setup
echo ================================
echo This script will install all required software for running and building the Loopay project.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Node.js...
    echo Please download and install Node.js 18.x LTS from: https://nodejs.org/
    echo After installation, restart this script.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Node.js already installed
    node --version
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please reinstall Node.js.
    pause
    exit /b 1
) else (
    echo [SUCCESS] npm already installed
    npm --version
)

REM Check if Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Git...
    echo Please download and install Git from: https://git-scm.com/
    echo After installation, restart this script.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Git already installed
    git --version
)

REM Install Expo CLI
echo [INFO] Installing Expo CLI...
call npm install -g @expo/cli
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Expo CLI
    pause
    exit /b 1
) else (
    echo [SUCCESS] Expo CLI installed successfully
)

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating template...
    (
        echo # Supabase Configuration
        echo # Get these values from your Supabase project dashboard
        echo EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
        echo EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo.
        echo # Example:
        echo # EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
        echo # EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ) > .env
    echo [WARNING] Please update .env with your Supabase credentials
    echo [WARNING] Get them from: https://supabase.com/dashboard
) else (
    echo [SUCCESS] .env file already exists
)

REM Install project dependencies
echo [INFO] Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install project dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] Project dependencies installed
)

echo.
echo ================================
echo Installation Complete!
echo ================================
echo.
echo [INFO] Next Steps:
echo.
echo 1. Environment Setup:
echo    - Update .env file with your Supabase credentials
echo    - Get them from: https://supabase.com/dashboard
echo.
echo 2. Database Setup:
echo    - Follow the instructions in ENVIRONMENT_SETUP.md
echo    - Create the subscriptions table in Supabase
echo.
echo 3. Test the App:
echo    - Run: npm start
echo    - Scan QR code with Expo Go app
echo    - Test sign-up and subscription creation
echo.
echo 4. Development:
echo    - Run: npm run lint (code quality)
echo    - Run: npm run typecheck (TypeScript)
echo    - Run: npm test (run tests)
echo.
echo 5. Building:
echo    - Web: npm run web
echo    - Android: npm run android (requires Android Studio)
echo.
echo 6. Useful Commands:
echo    - npm start: Start development server
echo    - npm run lint: Check code quality
echo    - npm run format: Format code with Prettier
echo    - npm run typecheck: Check TypeScript types
echo    - npm test: Run test suite
echo.
echo [SUCCESS] Your development environment is ready!
echo Follow the next steps above to get started with Loopay development.
echo.
pause
