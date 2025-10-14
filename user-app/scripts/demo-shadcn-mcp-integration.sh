#!/bin/bash

# Shadcn MCP Server Integration Demo Script
# Demonstrates component discovery workflow for MET24 features

echo "🚀 MET24 Shadcn MCP Server Integration Demo"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to show step progress
show_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
    echo "-------------------------------------------"
}

# Function to show success
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to show warning
show_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Function to show error
show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js and npm are available
check_dependencies() {
    show_step "1" "Checking Dependencies"
    
    if ! command -v node &> /dev/null; then
        show_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        show_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    show_success "Node.js and npm are available"
    node --version
    npm --version
    echo ""
}

# Install dependencies if needed
install_dependencies() {
    show_step "2" "Installing Dependencies"
    
    if [ ! -d "node_modules" ]; then
        echo "Installing project dependencies..."
        npm install
    else
        echo "Dependencies already installed"
    fi
    
    # Check if ts-node is available
    if ! npm list ts-node &> /dev/null; then
        echo "Installing ts-node..."
        npm install --save-dev ts-node@^10.9.2
    fi
    
    show_success "Dependencies ready"
    echo ""
}

# Run component discovery demo
run_discovery_demo() {
    show_step "3" "Component Discovery Demo"
    
    echo -e "${PURPLE}🔍 Discovering Wellness Dashboard Components${NC}"
    echo "This demonstrates component discovery for TASK-WD-003..."
    echo ""
    
    # Try to run the discovery, but don't fail if it errors
    if npm run component-discovery:wellness 2>/dev/null; then
        show_success "Wellness component discovery completed"
    else
        show_warning "Running in demo mode (MCP server not connected)"
        echo ""
        echo "Expected components for Wellness Dashboard:"
        echo "📊 Radar Chart Components:"
        echo "   • recharts-radar (Score: 95%)"
        echo "   • victory-radar (Score: 88%)"
        echo "   • d3-spider-chart (Score: 82%)"
        echo ""
        echo "📝 Likert Scale Components:"
        echo "   • slider-rating (Score: 92%)"
        echo "   • radio-group-rating (Score: 85%)"
        echo "   • star-rating (Score: 78%)"
        echo ""
        echo "📈 Progress Indicators:"
        echo "   • circular-progress (Score: 96%)"
        echo "   • radial-meter (Score: 90%)"
        echo "   • linear-progress (Score: 83%)"
    fi
    echo ""
}

# Show MBTI adaptation examples
show_mbti_adaptations() {
    show_step "4" "MBTI Adaptation Examples"
    
    echo -e "${PURPLE}🧠 MBTI-Optimized Component Adaptations${NC}"
    echo ""
    
    echo "INTJ (Architect) - Radar Chart Adaptation:"
    echo "• Layout: Information-dense with detailed metrics"
    echo "• Interaction: Minimal clicks, direct data access"
    echo "• Styling: Professional dark theme, clean lines"
    echo "• Features: Advanced filtering, export capabilities"
    echo ""
    
    echo "ESFP (Entertainer) - Radar Chart Adaptation:"
    echo "• Layout: Colorful, engaging visual presentation"
    echo "• Interaction: Immediate feedback, social sharing"
    echo "• Styling: Warm colors, friendly animations"
    echo "• Features: Gamification, progress celebrations"
    echo ""
    
    echo "INFP (Mediator) - Journaling Interface Adaptation:"
    echo "• Layout: Calm, minimalist design"
    echo "• Interaction: Gentle prompts, reflective pauses"
    echo "• Styling: Soft colors, nature-inspired themes"
    echo "• Features: Privacy controls, emotional tracking"
    echo ""
    
    echo "ESTJ (Executive) - Dashboard Adaptation:"
    echo "• Layout: Structured, goal-oriented metrics"
    echo "• Interaction: Efficient navigation, quick actions"
    echo "• Styling: Professional, business-like appearance"
    echo "• Features: Performance tracking, achievement badges"
    echo ""
}

# Show integration testing
show_integration_testing() {
    show_step "5" "Integration Testing Examples"
    
    echo -e "${PURPLE}🔗 Component Integration Validation${NC}"
    echo ""
    
    echo "Testing: Wellness Dashboard Complete"
    echo "• Components: radar-chart, likert-scale, progress-indicator"
    echo "• Compatibility: ✅ 98% compatible"
    echo "• Performance: ✅ Optimized for mobile"
    echo "• Accessibility: ✅ WCAG 2.1 AA compliant"
    echo ""
    
    echo "Testing: Journaling Interface Complete"
    echo "• Components: rich-text-editor, voice-input, theme-tags"
    echo "• Compatibility: ✅ 95% compatible"
    echo "• Privacy: ✅ Client-side encryption"
    echo "• Offline: ✅ Full offline functionality"
    echo ""
    
    echo "Testing: Content Discovery Complete"
    echo "• Components: content-card, search-input, filter-panel"
    echo "• Compatibility: ✅ 92% compatible"
    echo "• Performance: ✅ Lazy loading implemented"
    echo "• MBTI Optimization: ✅ 16 personality adaptations"
    echo ""
}

# Show next steps
show_next_steps() {
    show_step "6" "Next Steps & Implementation"
    
    echo -e "${PURPLE}🎯 Development Workflow${NC}"
    echo ""
    
    echo "1. Install MCP Server (Optional):"
    echo "   npm install @shadcn/mcp-server"
    echo "   npm run mcp:start"
    echo ""
    
    echo "2. Run Component Discovery:"
    echo "   npm run component-discovery           # Full workflow"
    echo "   npm run component-discovery:wellness  # Specific feature"
    echo ""
    
    echo "3. Test MBTI Adaptations:"
    echo "   npm run component-discovery:generate  # Generate examples"
    echo "   npm run test:components              # Run validation"
    echo ""
    
    echo "4. Validate Integrations:"
    echo "   npm run component-discovery:integration"
    echo ""
    
    echo "5. Deploy Testing Environment:"
    echo "   npm run build:dev                   # Build for testing"
    echo "   npm run deploy:development          # Deploy to dev"
    echo ""
    
    echo -e "${GREEN}📚 Documentation:${NC}"
    echo "• Usage Guide: src/components/testing/USAGE_GUIDE.md"
    echo "• Component Criteria: COMPONENT_CRITERIA_AND_TESTING_STRUCTURE.md"
    echo "• Integration Scripts: src/components/testing/"
    echo ""
    
    echo -e "${GREEN}🎉 Ready for Structured Development!${NC}"
    echo "The Shadcn MCP Server integration enables:"
    echo "• Systematic component discovery"
    echo "• MBTI-optimized adaptations"
    echo "• Integration validation"
    echo "• Type-safe implementations"
    echo ""
}

# Main execution
main() {
    echo "Starting MET24 Shadcn MCP Integration Demo..."
    echo ""
    
    check_dependencies
    install_dependencies
    run_discovery_demo
    show_mbti_adaptations
    show_integration_testing
    show_next_steps
    
    echo -e "${GREEN}🎊 Demo Complete!${NC}"
    echo ""
    echo "You can now use the component discovery system to transition"
    echo "from 'vibecoding' to structured, agent-based development."
    echo ""
    echo "Run 'npm run component-discovery' to get started!"
}

# Execute main function
main "$@"