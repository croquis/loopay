#!/bin/bash

# Loopay - Complete Development Environment Setup Script
# This script installs all required software for running and building the project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Function to install Homebrew (macOS)
install_homebrew() {
    if ! command_exists brew; then
        print_status "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for M1/M2 Macs
        if [[ $(uname -m) == "arm64" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        
        print_success "Homebrew installed successfully"
    else
        print_success "Homebrew already installed"
    fi
}

# Function to install Node.js
install_nodejs() {
    if ! command_exists node; then
        print_status "Installing Node.js..."
        
        OS=$(detect_os)
        if [[ "$OS" == "macos" ]]; then
            brew install node
        elif [[ "$OS" == "linux" ]]; then
            # Install Node.js using NodeSource repository
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [[ "$OS" == "windows" ]]; then
            print_warning "Please install Node.js manually from https://nodejs.org/"
            print_warning "Download and install Node.js 18.x LTS version"
            return 1
        fi
        
        print_success "Node.js installed successfully"
    else
        print_success "Node.js already installed ($(node --version))"
    fi
}

# Function to install npm
install_npm() {
    if ! command_exists npm; then
        print_status "Installing npm..."
        # npm usually comes with Node.js, but let's make sure
        if [[ "$OS" == "macos" ]]; then
            brew install npm
        fi
        print_success "npm installed successfully"
    else
        print_success "npm already installed ($(npm --version))"
    fi
}

# Function to install Expo CLI
install_expo_cli() {
    if ! command_exists expo; then
        print_status "Installing Expo CLI..."
        npm install -g @expo/cli
        print_success "Expo CLI installed successfully"
    else
        print_success "Expo CLI already installed ($(expo --version))"
    fi
}

# Function to install Watchman (macOS)
install_watchman() {
    if [[ "$(detect_os)" == "macos" ]]; then
        if ! command_exists watchman; then
            print_status "Installing Watchman..."
            brew install watchman
            print_success "Watchman installed successfully"
        else
            print_success "Watchman already installed"
        fi
    fi
}

# Function to install Android development tools
install_android_tools() {
    print_status "Setting up Android development environment..."
    
    if [[ "$(detect_os)" == "macos" ]]; then
        # Install Android Studio via Homebrew
        if ! command_exists studio; then
            print_status "Installing Android Studio..."
            brew install --cask android-studio
            print_warning "Android Studio installed. Please complete the setup wizard manually."
            print_warning "After setup, make sure to install Android SDK and set ANDROID_HOME"
        else
            print_success "Android Studio already installed"
        fi
        
        # Install Java
        if ! command_exists java; then
            print_status "Installing Java..."
            brew install openjdk@11
            print_warning "Please add Java to your PATH:"
            print_warning "echo 'export PATH=\"/opt/homebrew/opt/openjdk@11/bin:\$PATH\"' >> ~/.zshrc"
        else
            print_success "Java already installed ($(java --version | head -n 1))"
        fi
    elif [[ "$(detect_os)" == "linux" ]]; then
        print_warning "Please install Android Studio manually from https://developer.android.com/studio"
        print_warning "Also install OpenJDK 11: sudo apt-get install openjdk-11-jdk"
    elif [[ "$(detect_os)" == "windows" ]]; then
        print_warning "Please install Android Studio manually from https://developer.android.com/studio"
        print_warning "Also install OpenJDK 11 from https://adoptium.net/"
    fi
}

# Function to install iOS development tools (macOS only)
install_ios_tools() {
    if [[ "$(detect_os)" == "macos" ]]; then
        print_status "Setting up iOS development environment..."
        
        # Check if Xcode is installed
        if ! command_exists xcodebuild; then
            print_warning "Xcode not found. Please install Xcode from the Mac App Store."
            print_warning "After installation, run: sudo xcode-select --install"
        else
            print_success "Xcode already installed"
            
            # Install Xcode command line tools
            if ! command_exists xcode-select; then
                print_status "Installing Xcode command line tools..."
                sudo xcode-select --install
            else
                print_success "Xcode command line tools already installed"
            fi
        fi
        
        # Install CocoaPods
        if ! command_exists pod; then
            print_status "Installing CocoaPods..."
            sudo gem install cocoapods
            print_success "CocoaPods installed successfully"
        else
            print_success "CocoaPods already installed"
        fi
    fi
}

# Function to install development tools
install_dev_tools() {
    print_status "Installing development tools..."
    
    if [[ "$(detect_os)" == "macos" ]]; then
        # Install Git if not present
        if ! command_exists git; then
            print_status "Installing Git..."
            brew install git
        fi
        
        # Install VS Code if not present
        if ! command_exists code; then
            print_status "Installing VS Code..."
            brew install --cask visual-studio-code
        fi
        
        # Install useful development tools
        brew install wget curl jq tree
    elif [[ "$(detect_os)" == "linux" ]]; then
        sudo apt-get update
        sudo apt-get install -y git wget curl jq tree
    fi
    
    print_success "Development tools installed"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up development environment..."
    
    # Create .env file if it doesn't exist
    if [[ ! -f .env ]]; then
        print_warning ".env file not found. Creating template..."
        cat > .env << EOL
# Supabase Configuration
# Get these values from your Supabase project dashboard
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOL
        print_warning "Please update .env with your Supabase credentials"
        print_warning "Get them from: https://supabase.com/dashboard"
    else
        print_success ".env file already exists"
    fi
    
    # Install project dependencies
    print_status "Installing project dependencies..."
    npm install
    
    print_success "Project dependencies installed"
}

# Function to verify installation
verify_installation() {
    print_header "Verifying Installation"
    
    local all_good=true
    
    # Check Node.js
    if command_exists node; then
        print_success "Node.js: $(node --version)"
    else
        print_error "Node.js: NOT INSTALLED"
        all_good=false
    fi
    
    # Check npm
    if command_exists npm; then
        print_success "npm: $(npm --version)"
    else
        print_error "npm: NOT INSTALLED"
        all_good=false
    fi
    
    # Check Expo CLI
    if command_exists expo; then
        print_success "Expo CLI: $(expo --version)"
    else
        print_error "Expo CLI: NOT INSTALLED"
        all_good=false
    fi
    
    # Check Git
    if command_exists git; then
        print_success "Git: $(git --version)"
    else
        print_error "Git: NOT INSTALLED"
        all_good=false
    fi
    
    # Check OS-specific tools
    OS=$(detect_os)
    if [[ "$OS" == "macos" ]]; then
        if command_exists watchman; then
            print_success "Watchman: INSTALLED"
        else
            print_warning "Watchman: NOT INSTALLED"
        fi
        
        if command_exists xcodebuild; then
            print_success "Xcode: INSTALLED"
        else
            print_warning "Xcode: NOT INSTALLED (required for iOS development)"
        fi
        
        if command_exists studio; then
            print_success "Android Studio: INSTALLED"
        else
            print_warning "Android Studio: NOT INSTALLED (required for Android development)"
        fi
    fi
    
    if [[ "$all_good" == true ]]; then
        print_success "All core tools are installed and ready!"
    else
        print_error "Some tools are missing. Please review the installation above."
    fi
}

# Function to show next steps
show_next_steps() {
    print_header "Next Steps"
    
    echo -e "${CYAN}1. Environment Setup:${NC}"
    echo "   - Update .env file with your Supabase credentials"
    echo "   - Get them from: https://supabase.com/dashboard"
    
    echo -e "\n${CYAN}2. Database Setup:${NC}"
    echo "   - Follow the instructions in ENVIRONMENT_SETUP.md"
    echo "   - Create the subscriptions table in Supabase"
    
    echo -e "\n${CYAN}3. Test the App:${NC}"
    echo "   - Run: npm start"
    echo "   - Scan QR code with Expo Go app"
    echo "   - Test sign-up and subscription creation"
    
    echo -e "\n${CYAN}4. Development:${NC}"
    echo "   - Run: npm run lint (code quality)"
    echo "   - Run: npm run typecheck (TypeScript)"
    echo "   - Run: npm test (run tests)"
    
    echo -e "\n${CYAN}5. Building:${NC}"
    echo "   - iOS: npm run ios (requires Xcode)"
    echo "   - Android: npm run android (requires Android Studio)"
    echo "   - Web: npm run web"
    
    echo -e "\n${CYAN}6. Useful Commands:${NC}"
    echo "   - npm start: Start development server"
    echo "   - npm run lint: Check code quality"
    echo "   - npm run format: Format code with Prettier"
    echo "   - npm run typecheck: Check TypeScript types"
    echo "   - npm test: Run test suite"
}

# Main execution
main() {
    print_header "Loopay Development Environment Setup"
    echo "This script will install all required software for running and building the Loopay project."
    echo ""
    
    # Detect OS
    OS=$(detect_os)
    print_status "Detected OS: $OS"
    
    # Install tools based on OS
    if [[ "$OS" == "macos" ]]; then
        install_homebrew
        install_nodejs
        install_npm
        install_expo_cli
        install_watchman
        install_android_tools
        install_ios_tools
        install_dev_tools
    elif [[ "$OS" == "linux" ]]; then
        install_nodejs
        install_npm
        install_expo_cli
        install_android_tools
        install_dev_tools
    elif [[ "$OS" == "windows" ]]; then
        print_warning "Windows support is limited. Some tools need manual installation."
        install_nodejs
        install_npm
        install_expo_cli
        install_android_tools
    else
        print_error "Unsupported operating system"
        exit 1
    fi
    
    # Setup project environment
    setup_environment
    
    # Verify installation
    verify_installation
    
    # Show next steps
    show_next_steps
    
    print_header "Setup Complete!"
    echo -e "${GREEN}Your development environment is ready!${NC}"
    echo "Follow the next steps above to get started with Loopay development."
}

# Run main function
main "$@"
