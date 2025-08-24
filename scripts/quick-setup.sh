#!/bin/bash

# Loopay Quick Setup Script
# One-liner to get started quickly

echo "🚀 Loopay Quick Setup"
echo "======================"

# Detect OS and run appropriate setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 macOS detected - Running full setup..."
    chmod +x scripts/install-dependencies.sh
    ./scripts/install-dependencies.sh
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Linux detected - Running full setup..."
    chmod +x scripts/install-dependencies.sh
    ./scripts/install-dependencies.sh
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Windows detected - Please run: scripts/install-dependencies.bat"
    echo "Or manually install:"
    echo "1. Node.js from https://nodejs.org/"
    echo "2. Git from https://git-scm.com/"
    echo "3. Run: npm install -g @expo/cli"
    echo "4. Run: npm install"
else
    echo "❓ Unknown OS - Please run the appropriate setup script manually"
fi
