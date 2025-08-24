#!/bin/bash

echo "🚀 Setting up Loopay - Subscription Management App"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOL
# Supabase Configuration
# Get these values from your Supabase project dashboard
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOL
    echo "📝 Please update .env with your Supabase credentials"
    echo "🔗 Get them from: https://supabase.com/dashboard"
else
    echo "✅ .env file exists"
fi

# Run type check
echo "🔍 Running type check..."
npm run typecheck

# Run linting
echo "🧹 Running linting..."
npm run lint

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env with your Supabase credentials"
echo "2. Set up your Supabase database (see ENVIRONMENT_SETUP.md)"
echo "3. Run 'npm start' to start the development server"
echo "4. Run 'npm test' to run tests"
echo ""
echo "📚 Documentation:"
echo "- ENVIRONMENT_SETUP.md - Database and environment setup"
echo "- docs/QA-checklist.md - Testing and QA guide"
echo ""
echo "🚀 Happy coding!"
