// Quick Mary test zonder ES module issues
const MaryPromptingSystem = class {
  promptMary(command, context = {}) {
    if (command === 'fix-app-startup') {
      return {
        mary_says: "🧙‍♀️ Mary: Coordinating app startup fix voor MET24...",
        team_assignment: {
          primary: "Riley (Developer)",
          support: ["Jordan (Architect)", "Morgan (QA)"],
          timeline: "2-4 hours"
        },
        action_plan: [
          "🔍 Riley: Analyze React startup errors in package.json scripts",
          "🏗️ Jordan: Review build configuration and dependencies", 
          "🧪 Morgan: Test startup sequence with clean error logs",
          "✅ Mary: Validate fix quality and performance"
        ],
        immediate_actions: [
          "Check package.json scripts section",
          "Verify all dependencies are installed", 
          "Test npm start vs npm run dev",
          "Review craco.config.js configuration"
        ],
        expected_outcome: "Functional React app startup with clean error logs",
        quality_gates: ["No console errors", "Fast startup time", "All routes accessible"]
      };
    }
    return { mary_says: `🧙‍♀️ Mary: Command "${command}" received` };
  }
};

const mary = new MaryPromptingSystem();
const response = mary.promptMary('fix-app-startup', {priority: 'high', component: 'React App'});
console.log(JSON.stringify(response, null, 2));