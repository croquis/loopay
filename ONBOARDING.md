# 🚀 Loopay - Developer Onboarding Guide

Welcome to the Loopay project! This guide will help you get up and running quickly on any new device.

## 📋 Prerequisites

- **Git** - for version control
- **Internet connection** - for downloading dependencies
- **Basic terminal knowledge** - for running commands

## 🚀 Quick Start (Recommended)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd loopay
```

### 2. Run the Auto-Setup Script

**macOS/Linux:**
```bash
./scripts/quick-setup.sh
```

**Windows:**
```cmd
scripts\install-dependencies.bat
```

**Manual (if scripts don't work):**
```bash
chmod +x scripts/install-dependencies.sh
./scripts/install-dependencies.sh
```

## 🔧 Manual Setup (Alternative)

If the auto-setup doesn't work, follow these steps manually:

### 1. Install Node.js
- **macOS**: `brew install node` (requires Homebrew)
- **Linux**: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- **Windows**: Download from [nodejs.org](https://nodejs.org/) (LTS version)

### 2. Install Expo CLI
```bash
npm install -g @expo/cli
```

### 3. Install Project Dependencies
```bash
npm install
```

### 4. Create Environment File
Create a `.env` file in the project root:
```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🗄️ Database Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Get your project URL and anon key

### 2. Update Environment Variables
Replace the placeholders in your `.env` file with actual values.

### 3. Create Database Table
Run this SQL in your Supabase SQL Editor:
```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly', 'custom')),
  renewal_date DATE NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for user access
CREATE POLICY "Users can only access their own subscriptions"
ON subscriptions FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_renewal_date ON subscriptions(renewal_date);
```

## 🧪 Testing Your Setup

### 1. Start the Development Server
```bash
npm start
```

### 2. Test on Device
- Install **Expo Go** app on your phone
- Scan the QR code that appears in the terminal
- The app should load and show "Hello, Loopay 👋"

### 3. Test Authentication
- Try to sign up with a test email
- Check your Supabase dashboard to see if the user was created

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run typecheck

# Run tests
npm test

# Build for different platforms
npm run ios      # iOS (requires Xcode on macOS)
npm run android  # Android (requires Android Studio)
npm run web      # Web browser
```

## 📱 Platform-Specific Setup

### iOS Development (macOS only)
1. Install Xcode from Mac App Store
2. Install Xcode command line tools: `sudo xcode-select --install`
3. Install CocoaPods: `sudo gem install cocoapods`

### Android Development
1. Install [Android Studio](https://developer.android.com/studio)
2. Install Android SDK
3. Set `ANDROID_HOME` environment variable
4. Create Android Virtual Device (AVD) or use physical device

### Web Development
No additional setup required - works out of the box!

## 🔍 Troubleshooting

### Common Issues

**"Metro bundler failed"**
```bash
npx expo start --clear
```

**"Permission denied" on scripts**
```bash
chmod +x scripts/*.sh
```

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Expo CLI not found"**
```bash
npm install -g @expo/cli
```

**"Babel configuration error"**
- Make sure you have the `.env` file with Supabase credentials
- Restart the development server

### Getting Help

1. **Check the logs** in your terminal
2. **Review error messages** carefully
3. **Check file permissions** on scripts
4. **Verify environment variables** are set correctly
5. **Check Node.js version** (should be 18.x or higher)

## 📚 Additional Resources

- **Project Documentation**: `PROJECT_STATUS.md`
- **Environment Setup**: `ENVIRONMENT_SETUP.md`
- **QA Checklist**: `docs/QA-checklist.md`
- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev/)
- **React Native**: [reactnative.dev](https://reactnative.dev/)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

## 🎯 Next Steps

Once you're up and running:

1. **Explore the codebase** - start with `app/index.tsx`
2. **Test all features** - use the QA checklist
3. **Make your first change** - try updating the welcome message
4. **Add a new feature** - perhaps a new subscription category
5. **Run the test suite** - ensure everything still works

## 🚀 Happy Coding!

You're now ready to contribute to Loopay! The project is feature-complete and production-ready. Feel free to:

- Add new features
- Improve existing functionality
- Fix bugs
- Enhance the UI/UX
- Write tests
- Update documentation

Welcome to the team! 🎉
