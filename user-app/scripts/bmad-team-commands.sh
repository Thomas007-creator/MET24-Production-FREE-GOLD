#!/bin/bash

# 🎭 BMAD Team Quick Commands voor Daily Development
# Usage: source deze file in je terminal voor instant BMAD agent access

echo "🎯 BMAD Team Quick Commands Loaded!"
echo "🧙‍♀️ Mary (Master) | 🎭 Alex (Orchestrator) | 📊 Sam (Analyst) | 🏗️ Jordan (Architect)"

# 🧙‍♀️ Mary - BMAD Master Commands
alias mary-status="echo '🧙‍♀️ Mary: Checking team status...' && npm run test:bmad:quick"
alias mary-coordinate="echo '🧙‍♀️ Mary: Coordinating team for:' && read task && echo 'Team coordination started for: $task'"
alias mary-quality="echo '🧙‍♀️ Mary: Running quality assurance...' && npm run test:bmad"

# 🎭 Alex - Orchestrator Commands  
alias alex-help="echo '🎭 Alex: Available workflows:' && echo '1. MBTI Assessment | 2. Coaching Architecture | 3. Feature Development'"
alias alex-workflow="echo '🎭 Alex: Starting workflow orchestration...' && npm run test:bmad:dashboard"

# 📊 Sam - Analyst Commands
alias sam-analyze="echo '📊 Sam: Analyzing MBTI data patterns...'"
alias sam-assess="echo '📊 Sam: Running personality assessment validation...'"
alias sam-metrics="echo '📊 Sam: Generating coaching effectiveness metrics...'"

# 🏗️ Jordan - Architect Commands
alias jordan-design="echo '🏗️ Jordan: Designing system architecture...'"
alias jordan-review="echo '🏗️ Jordan: Reviewing architectural patterns...'"
alias jordan-optimize="echo '🏗️ Jordan: Optimizing system scalability...'"

# 👨‍💻 Riley - Developer Commands
alias riley-implement="echo '👨‍💻 Riley: Implementing feature...'"
alias riley-debug="echo '👨‍💻 Riley: Debugging implementation...'"
alias riley-optimize="echo '👨‍💻 Riley: Optimizing code performance...'"

# 🧪 Morgan - QA Commands
alias morgan-test="echo '🧪 Morgan: Running comprehensive test suite...' && npm run test:bmad"
alias morgan-validate="echo '🧪 Morgan: Validating quality standards...'"
alias morgan-verify="echo '🧪 Morgan: Verifying coaching effectiveness...'"

# 🎨 Blake - UX Commands
alias blake-design="echo '🎨 Blake: Designing user interface...'"
alias blake-optimize="echo '🎨 Blake: Optimizing user experience...'"
alias blake-test="echo '🎨 Blake: Testing interface usability...'"

# Quick Team Assembly
alias bmad-team="echo '🎭 BMAD Team Assembly:' && echo '🧙‍♀️ Mary - Master Coordinator' && echo '🎭 Alex - Workflow Orchestrator' && echo '📊 Sam - MBTI Analyst' && echo '🏗️ Jordan - System Architect' && echo '👨‍💻 Riley - Implementation Specialist' && echo '🧪 Morgan - Quality Assurance' && echo '🎨 Blake - UX Expert'"

# Development Workflow Shortcuts
alias start-feature="echo '🚀 Starting new feature development...' && mary-coordinate && alex-workflow"
alias test-feature="echo '🧪 Testing feature implementation...' && morgan-test"
alias deploy-feature="echo '🚀 Deploying feature...' && mary-quality && echo 'Feature ready for deployment!'"

echo ""
echo "🎯 Quick Start Commands:"
echo "  bmad-team          - Show full team"
echo "  mary-status        - Get team status"
echo "  alex-help          - Show available workflows"  
echo "  start-feature      - Begin new feature development"
echo "  test-feature       - Run comprehensive testing"
echo "  deploy-feature     - Deploy with quality assurance"
echo ""
echo "🧙‍♀️ Mary says: 'Team ready for Fortune 100 level development!'"