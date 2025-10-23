#!/bin/bash

# 🧙‍♀️ Mary Direct Command Interface voor Thomas
# Direct prompting van Mary voor alle MET24 onderdelen

echo "🧙‍♀️ Mary Direct Command System - MET24 Production"
echo "=================================================="

# 🎯 Development Commands
alias mary-fix-startup="echo '🧙‍♀️ Mary: Fixing app startup issues...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('fix-app-startup', {priority: 'high', component: 'React App'});
console.log(JSON.stringify(response, null, 2));
\""

alias mary-add-feature="echo '🧙‍♀️ Mary: Ready for new feature development...' && read -p 'Feature name: ' feature && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('add-feature', {feature: '$feature', priority: 'normal'});
console.log(JSON.stringify(response, null, 2));
\""

alias mary-fix-bug="echo '🧙‍♀️ Mary: Bug fixing coordination...' && read -p 'Bug description: ' bug && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('fix-bug', {bug: '$bug', priority: 'high'});
console.log(JSON.stringify(response, null, 2));
\""

# 🎯 MBTI Specific Commands
alias mary-enhance-mbti="echo '🧙‍♀️ Mary: Enhancing MBTI assessment...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('enhance-mbti-assessment', {focus: 'accuracy', priority: 'high'});
console.log(JSON.stringify(response, null, 2));
\""

alias mary-improve-coaching="echo '🧙‍♀️ Mary: Improving coaching algorithms...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('improve-coaching', {focus: 'personalization', priority: 'normal'});
console.log(JSON.stringify(response, null, 2));
\""

alias mary-analyze-personality="echo '🧙‍♀️ Mary: Analyzing personality data...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('analyze-personality-data', {timeframe: 'last_30_days', priority: 'normal'});
console.log(JSON.stringify(response, null, 2));
\""

# 🚀 Production Commands
alias mary-deploy="echo '🧙‍♀️ Mary: Coordinating deployment...' && read -p 'Deploy target (staging/production): ' target && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('deploy-feature', {target: '$target', priority: 'high'});
console.log(JSON.stringify(response, null, 2));
\""

alias mary-monitor="echo '🧙‍♀️ Mary: Monitoring system performance...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('monitor-performance', {scope: 'full_system', priority: 'normal'});
console.log(JSON.stringify(response, null, 2));
\""

# 📊 Analytics Commands  
alias mary-reports="echo '🧙‍♀️ Mary: Generating comprehensive reports...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('generate-reports', {type: 'weekly_summary', priority: 'normal'});
console.log(JSON.stringify(response, null, 2));
\""

alias mary-user-analytics="echo '🧙‍♀️ Mary: Analyzing user behavior...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const response = mary.promptMary('user-analytics', {period: 'current_month', priority: 'normal'});
console.log(JSON.stringify(response, null, 2));
\""

# 🧙‍♀️ Mary Status & Help
alias mary-help="echo '🧙‍♀️ Mary Available Commands:' && echo '' && echo '🔧 DEVELOPMENT:' && echo '  mary-fix-startup    - Fix React app startup issues' && echo '  mary-add-feature    - Add new feature with full team coordination' && echo '  mary-fix-bug        - Bug fixing with team assignment' && echo '' && echo '🎯 MBTI COACHING:' && echo '  mary-enhance-mbti   - Enhance MBTI assessment accuracy' && echo '  mary-improve-coaching - Improve coaching algorithms' && echo '  mary-analyze-personality - Analyze personality data patterns' && echo '' && echo '🚀 PRODUCTION:' && echo '  mary-deploy         - Coordinate deployment process' && echo '  mary-monitor        - Monitor system performance' && echo '' && echo '📊 ANALYTICS:' && echo '  mary-reports        - Generate comprehensive reports' && echo '  mary-user-analytics - Analyze user behavior patterns' && echo '' && echo '🧙‍♀️ Mary says: \"Ready to coordinate any MET24 task!\"'"

alias mary-status="echo '🧙‍♀️ Mary Team Status Check...' && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const status = mary.getTeamStatus();
console.log(JSON.stringify(status, null, 2));
\""

# 🎯 Quick Mary Prompting
alias mary-prompt="echo '🧙‍♀️ Mary: What can I coordinate for you?' && read -p 'Command: ' cmd && read -p 'Context (optional): ' ctx && node -e \"
const MaryPromptingSystem = require('./src/services/MaryPromptingSystem.js').default || require('./src/services/MaryPromptingSystem.js');
const mary = new MaryPromptingSystem();
const context = '$ctx' ? {description: '$ctx'} : {};
const response = mary.promptMary('$cmd', context);
console.log(JSON.stringify(response, null, 2));
\""

echo ""
echo "🎯 Mary Command System Loaded!"
echo "Type 'mary-help' to see all available commands"
echo "Type 'mary-status' to check team readiness"
echo "Type 'mary-prompt' for custom commands"
echo ""
echo "🧙‍♀️ Mary: 'Ready to coordinate any MET24 task with Fortune 100 precision!'"