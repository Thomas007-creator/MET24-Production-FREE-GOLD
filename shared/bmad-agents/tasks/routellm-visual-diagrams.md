# 🎨 RouteLLM Visual Architecture Diagrams

**Visual Guide**: Complete system flow met RouteLLM integration  
**Datum**: 2025-01-07  

---

## 📊 DIAGRAM 1: CURRENT SYSTEM (Without RouteLLM)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE (React PWA)                  │
│  CoachingScreen │ WellnessScreen │ JournalingScreen │ etc.     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CHATLLM SERVICE MANAGER                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Feature Router                                            │ │
│  │  • processChatCoaching()                                   │ │
│  │  • processWellnessAnalysis()                               │ │
│  │  • processJournalAnalysis()                                │ │
│  │  • processAIOrchestration()                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Privacy Check
                              ↓
            ┌─────────────────┴─────────────────┐
            ↓                                   ↓
┌─────────────────────────┐     ┌─────────────────────────────────┐
│  SENSITIVE/CONFIDENTIAL │     │    PERSONAL/PUBLIC              │
│                         │     │                                 │
│  ┌──────────────────┐  │     │  ┌──────────────────────────┐  │
│  │ WebLLM Worker    │  │     │  │ AI Orchestration         │  │
│  │ (Phi-2 Local)    │  │     │  │                          │  │
│  │                  │  │     │  │ ┌──────────────────────┐ │  │
│  │ • 100% Private   │  │     │  │ │ AI-1: OpenAI GPT-4o  │ │  │
│  │ • WebGPU Accel   │  │     │  │ │ (Aesthetic)          │ │  │
│  │ • No cloud       │  │     │  │ │ HARD-CODED           │ │  │
│  └──────────────────┘  │     │  │ └──────────────────────┘ │  │
│                         │     │  │                          │  │
│  Cost: $0              │     │  │ ┌──────────────────────┐ │  │
│  Quality: Medium       │     │  │ │ AI-2: Claude Opus    │ │  │
└─────────────────────────┘     │  │ │ (Cognitive)          │ │  │
                                │  │ │ COORDINATOR          │ │  │
                                │  │ │ HARD-CODED           │ │  │
                                │  │ └──────────────────────┘ │  │
                                │  │                          │  │
                                │  │ ┌──────────────────────┐ │  │
                                │  │ │ AI-3: Gemini Pro     │ │  │
                                │  │ │ (Ethical)            │ │  │
                                │  │ │ HARD-CODED           │ │  │
                                │  │ └──────────────────────┘ │  │
                                │  └──────────────────────────┘  │
                                │                                 │
                                │  Cost per query: $0.022         │
                                │  (AI-1+AI-2+AI-3 combined)      │
                                └─────────────────────────────────┘
                                              ↓
                                    ┌─────────────────┐
                                    │  MCP Bridge     │
                                    │  (port 3001)    │
                                    └─────────────────┘
                                              ↓
                                ┌─────────────────────────┐
                                │  External AI Providers  │
                                │  • OpenAI API           │
                                │  • Anthropic API        │
                                │  • Google Gemini API    │
                                └─────────────────────────┘

⚠️ PROBLEMS:
1. Simple query → Expensive Claude Opus ($0.015)
2. All orchestration queries → 3 models ($0.022)
3. No cost optimization
4. No fallback intelligence
5. Hard-coded provider mapping
```

---

## 🚀 DIAGRAM 2: NEW SYSTEM (With RouteLLM)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE (React PWA)                  │
│  CoachingScreen │ WellnessScreen │ JournalingScreen │ etc.     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CHATLLM SERVICE MANAGER                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Feature Router (Enhanced)                                 │ │
│  │  • processChatCoaching() ──┐                               │ │
│  │  • processWellnessAnalysis()├─→ RouteLLM Integration       │ │
│  │  • processJournalAnalysis() │                               │ │
│  │  • processAIOrchestration()─┘                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      🎯 ROUTELLM SERVICE (NEW!)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  STEP 1: Privacy Classification                            │ │
│  │  ├─ CONFIDENTIAL/SENSITIVE → Local Only ✅                 │ │
│  │  └─ PERSONAL/PUBLIC → Continue to Step 2 ↓                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  STEP 2: Complexity Analysis                               │ │
│  │  ├─ Token count: 150 tokens                                │ │
│  │  ├─ Feature type: chat_coaching (+20 points)               │ │
│  │  ├─ MBTI reasoning: Yes (+15 points)                       │ │
│  │  ├─ Context size: Medium (+8 points)                       │ │
│  │  └─ TOTAL COMPLEXITY SCORE: 58/100 (Medium)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  STEP 3: Model Selection                                   │ │
│  │  Complexity: 58 → Medium complexity tier                   │ │
│  │                                                              │ │
│  │  Selected Route:                                            │ │
│  │  ├─ Primary: Claude Haiku ($0.001)                         │ │
│  │  ├─ Fallback 1: Gemini Pro ($0.002)                        │ │
│  │  ├─ Fallback 2: GPT-4o-mini ($0.003)                       │ │
│  │  └─ Emergency: Local WebLLM ($0)                            │ │
│  │                                                              │ │
│  │  Cost Estimate: $0.001 (vs $0.015 without RouteLLM)        │ │
│  │  Savings: 93% 🎉                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROVIDER EXECUTION LAYER                      │
│                                                                  │
│  Try Primary: Claude Haiku                                      │
│         ↓                                                        │
│    ┌────────┐                                                   │
│    │Success?│─ YES → Return Result ✅                          │
│    └────────┘                                                   │
│         ↓ NO                                                     │
│  Try Fallback 1: Gemini Pro                                     │
│         ↓                                                        │
│    ┌────────┐                                                   │
│    │Success?│─ YES → Return Result ✅                          │
│    └────────┘                                                   │
│         ↓ NO                                                     │
│  Try Fallback 2: GPT-4o-mini                                    │
│         ↓                                                        │
│    ┌────────┐                                                   │
│    │Success?│─ YES → Return Result ✅                          │
│    └────────┘                                                   │
│         ↓ NO                                                     │
│  Emergency Fallback: WebLLM Local                               │
│         ↓                                                        │
│    Always Succeeds ✅                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS & TRACKING                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Cost: $0.001 (saved $0.014)                             │ │
│  │  • Latency: 1.2s                                            │ │
│  │  • Model used: claude-3-haiku                               │ │
│  │  • Fallbacks triggered: 0                                   │ │
│  │  • User satisfaction: TBD (await feedback)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

✅ BENEFITS:
1. Intelligent cost optimization: 93% savings
2. Quality maintained for complex queries
3. Smart fallback chain: 99.9% reliability
4. Analytics for continuous improvement
5. Privacy-first always respected
```

---

## 🧮 DIAGRAM 3: COMPLEXITY SCORING FLOW

```
Query Arrives: "Help me understand my INFP cognitive functions"
      ↓
┌──────────────────────────────────────────────────────────┐
│  COMPLEXITY ANALYZER                                     │
│                                                           │
│  [1] Token Count Analysis                                │
│      ├─ Input: "Help me understand my INFP..."          │
│      ├─ Estimated tokens: 12                             │
│      └─ Score: 0.6 points (12/20)                       │
│                                                           │
│  [2] Feature Type                                        │
│      ├─ Feature: chat_coaching                           │
│      ├─ Coaching requires deep understanding             │
│      └─ Score: +20 points                                │
│                                                           │
│  [3] MBTI Reasoning Depth                                │
│      ├─ MBTI type provided: INFP                         │
│      ├─ Cognitive functions mentioned: Yes               │
│      ├─ Deep personality analysis required               │
│      └─ Score: +20 points (15 base + 5 CF)              │
│                                                           │
│  [4] Context Complexity                                  │
│      ├─ User history: Available                          │
│      ├─ Previous sessions: 3                             │
│      ├─ Context size: 500 chars                          │
│      └─ Score: +7.5 points (500/500 * 15)               │
│                                                           │
│  [5] RAG Context                                         │
│      ├─ RAG enabled: No                                  │
│      └─ Score: +0 points                                 │
│                                                           │
│  [6] Conversation History                                │
│      ├─ Turn count: 2 (short conversation)               │
│      └─ Score: +0 points (< 5 turns)                     │
│                                                           │
│  ═══════════════════════════════════════════════════════ │
│  TOTAL COMPLEXITY SCORE: 48.1 / 100                      │
│  TIER: MEDIUM (41-60 range)                              │
└──────────────────────────────────────────────────────────┘
      ↓
┌──────────────────────────────────────────────────────────┐
│  MODEL SELECTOR                                          │
│                                                           │
│  Input: Complexity = 48 (Medium)                         │
│         Feature = chat_coaching                          │
│         Cost Priority = balanced                         │
│                                                           │
│  Decision Tree:                                          │
│  ├─ IF complexity < 30 → Tier: Cheap                    │
│  ├─ IF complexity 30-60 → Tier: Medium ✅               │
│  └─ IF complexity > 60 → Tier: Premium                  │
│                                                           │
│  Medium Tier Models:                                     │
│  ├─ Primary: Claude Haiku ($0.001) ✅                   │
│  ├─ Alt 1: Gemini Pro ($0.002)                          │
│  └─ Alt 2: GPT-4o-mini ($0.003)                         │
│                                                           │
│  Special Considerations:                                 │
│  • MBTI coaching → Prefer Claude (best at personality)  │
│  • Community mod → Prefer fast models                   │
│  • Creative → Prefer OpenAI                             │
│                                                           │
│  Final Selection: Claude Haiku ✅                        │
│  Reasoning: "Medium complexity MBTI coaching,            │
│              Claude excels at personality analysis,      │
│              Haiku provides good quality at low cost"    │
└──────────────────────────────────────────────────────────┘
      ↓
┌──────────────────────────────────────────────────────────┐
│  FALLBACK CHAIN BUILDER                                  │
│                                                           │
│  Primary: Claude Haiku                                   │
│     ├─ Success rate: 98%                                 │
│     └─ Latency: 1.2s                                     │
│                                                           │
│  Fallback 1: Gemini Pro                                  │
│     ├─ Similar quality tier                              │
│     ├─ Different provider (reliability)                  │
│     └─ Latency: 1.5s                                     │
│                                                           │
│  Fallback 2: GPT-4o-mini                                 │
│     ├─ Third provider option                             │
│     ├─ Higher cost but still reasonable                  │
│     └─ Latency: 1.8s                                     │
│                                                           │
│  Emergency: WebLLM Local (Phi-2)                         │
│     ├─ Always available                                  │
│     ├─ Lower quality but functional                      │
│     └─ Latency: 0.2s (fast!)                             │
└──────────────────────────────────────────────────────────┘
      ↓
    EXECUTE!
```

---

## 💰 DIAGRAM 4: COST COMPARISON MATRIX

```
┌─────────────────────────────────────────────────────────────────┐
│              MONTHLY COST ANALYSIS (1000 queries/day)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WITHOUT ROUTELLM (Current System)                              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  All queries → Claude Opus                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ████████████████████████████████████████████ $450       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  1000 queries/day × $0.015 × 30 days = $450/month              │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  All queries → AI Orchestration (3 models)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ████████████████████████████████████████████████ $660   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  1000 queries/day × $0.022 × 30 days = $660/month              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WITH ROUTELLM (Intelligent Routing)                            │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  Query Distribution:                                            │
│                                                                  │
│  30% Simple (300/day) → Local WebLLM                            │
│  ┌──────────────┐                                               │
│  │ ████ $0      │  300 × $0 × 30 = $0/month                    │
│  └──────────────┘                                               │
│                                                                  │
│  40% Medium (400/day) → Claude Haiku                            │
│  ┌─────────────────────┐                                        │
│  │ ██████ $12          │  400 × $0.001 × 30 = $12/month        │
│  └─────────────────────┘                                        │
│                                                                  │
│  20% Complex (200/day) → Claude Opus                            │
│  ┌─────────────────────────────────┐                            │
│  │ ███████████ $90                 │  200 × $0.015 × 30 = $90  │
│  └─────────────────────────────────┘                            │
│                                                                  │
│  10% Expert (100/day) → AI Orchestration                        │
│  ┌──────────────────────────┐                                   │
│  │ █████████ $66            │  100 × $0.022 × 30 = $66         │
│  └──────────────────────────┘                                   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  TOTAL WITH ROUTELLM: $168/month                                │
│                                                                  │
│  💰 SAVINGS: $450 - $168 = $282/month (63% reduction)           │
│  💰 SAVINGS: $660 - $168 = $492/month (75% reduction)           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ANNUAL PROJECTION                                              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  Without RouteLLM: $5,400 - $7,920/year                         │
│  With RouteLLM:    $2,016/year                                  │
│                                                                  │
│  💰 ANNUAL SAVINGS: $3,384 - $5,904/year                        │
│                                                                  │
│  At 10K users (10x scale):                                      │
│  Without: $54,000 - $79,200/year                                │
│  With:    $20,160/year                                          │
│  💰 SAVINGS: $33,840 - $59,040/year                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DIAGRAM 5: EXECUTION FLOW WITH FALLBACKS

```
                    Query Arrives
                         ↓
          ┌──────────────────────────┐
          │   RouteLLM Analysis      │
          │   Complexity: 58         │
          │   Selected: Claude Haiku │
          └──────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│                   EXECUTION MANAGER                         │
│                                                             │
│  Attempt 1: Claude Haiku                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /v1/messages                                   │  │
│  │  {                                                    │  │
│  │    "model": "claude-3-haiku-20240307",               │  │
│  │    "messages": [...],                                │  │
│  │    "max_tokens": 1000                                │  │
│  │  }                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│           ↓                                                 │
│      ┌─────────┐                                            │
│      │Success? │                                            │
│      └─────────┘                                            │
│           ↓                                                 │
│   ┌───────┴───────┐                                         │
│   ↓ YES           ↓ NO                                      │
│                                                             │
│  ✅ Return Result  ⚠️ Handle Error                          │
│  {                  {                                       │
│    success: true,    error: "rate_limit_exceeded",         │
│    result: "...",    provider: "anthropic",                │
│    model: "haiku",   model: "claude-3-haiku"               │
│    cost: $0.001      }                                      │
│  }                   ↓                                      │
│                                                             │
│                  Attempt 2: Gemini Pro                      │
│                  ┌───────────────────────────────────────┐  │
│                  │  POST /v1/models/gemini-pro:generate │  │
│                  │  {                                    │  │
│                  │    "contents": [...],                 │  │
│                  │    "generationConfig": {...}          │  │
│                  │  }                                    │  │
│                  └───────────────────────────────────────┘  │
│                            ↓                                │
│                       ┌─────────┐                           │
│                       │Success? │                           │
│                       └─────────┘                           │
│                            ↓                                │
│                    ┌───────┴───────┐                        │
│                    ↓ YES           ↓ NO                     │
│                                                             │
│             ✅ Return Result  ⚠️ Handle Error               │
│             {                  {                            │
│               success: true,    error: "service_unavailable│
│               result: "...",    provider: "google",        │
│               model: "gemini",  model: "gemini-pro"        │
│               cost: $0.002,     }                           │
│               fallback: true    ↓                           │
│             }                                               │
│                              Attempt 3: GPT-4o-mini         │
│                              ┌───────────────────────────┐  │
│                              │  POST /v1/chat/completions│  │
│                              │  {                        │  │
│                              │    "model": "gpt-4o-mini",│  │
│                              │    "messages": [...]      │  │
│                              │  }                        │  │
│                              └───────────────────────────┘  │
│                                         ↓                   │
│                                    ┌─────────┐              │
│                                    │Success? │              │
│                                    └─────────┘              │
│                                         ↓                   │
│                                 ┌───────┴───────┐           │
│                                 ↓ YES           ↓ NO        │
│                                                             │
│                          ✅ Return Result  ⚠️ All Failed   │
│                          {                                  │
│                            success: true,                   │
│                            result: "...",                   │
│                            model: "gpt4o",                  │
│                            cost: $0.003,                    │
│                            fallback: true                   │
│                          }                                  │
│                                            ↓                │
│                              Emergency: WebLLM Local        │
│                              ┌──────────────────────────┐   │
│                              │  Local Phi-2 Processing │   │
│                              │  • No API needed         │   │
│                              │  • Always succeeds       │   │
│                              │  • Degraded quality      │   │
│                              └──────────────────────────┘   │
│                                         ↓                   │
│                                  ✅ Return Result           │
│                                  {                          │
│                                    success: true,           │
│                                    result: "...",           │
│                                    model: "phi-2-local",    │
│                                    cost: $0,                │
│                                    emergency: true          │
│                                  }                          │
└────────────────────────────────────────────────────────────┘
                              ↓
                   ┌─────────────────────┐
                   │  Analytics Tracking  │
                   │  • Record cost       │
                   │  • Record latency    │
                   │  • Record fallbacks  │
                   │  • Update metrics    │
                   └─────────────────────┘
```

---

## 🎯 DIAGRAM 6: PROVIDER HEALTH MONITORING

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROVIDER HEALTH DASHBOARD                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  OpenAI (GPT-4, GPT-3.5)                                        │
│  Status: 🟢 Healthy                                             │
│  Uptime: 99.8% (Last 7 days)                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Success Rate                                             │  │
│  │ ████████████████████████████████████████████████ 98.5%  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  Avg Latency: 850ms                                             │
│  Total Queries: 12,450 (last 7 days)                            │
│  Errors: 187 (rate limits: 120, timeouts: 67)                   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Anthropic (Claude Opus, Sonnet, Haiku)                         │
│  Status: 🟢 Healthy                                             │
│  Uptime: 99.9% (Last 7 days)                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Success Rate                                             │  │
│  │ █████████████████████████████████████████████████ 99.2% │  │
│  └──────────────────────────────────────────────────────────┘  │
│  Avg Latency: 1,200ms                                           │
│  Total Queries: 8,920 (last 7 days)                             │
│  Errors: 71 (rate limits: 45, timeouts: 26)                     │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Google (Gemini Pro, Flash)                                     │
│  Status: 🟡 Degraded                                            │
│  Uptime: 97.2% (Last 7 days)                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Success Rate                                             │  │
│  │ ███████████████████████████████████████████ 95.8%       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  Avg Latency: 1,500ms                                           │
│  Total Queries: 6,340 (last 7 days)                             │
│  Errors: 266 (timeouts: 198, server errors: 68)                 │
│  ⚠️ Warning: Higher than normal timeout rate                    │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Local WebLLM (Phi-2)                                           │
│  Status: 🟢 Healthy                                             │
│  Uptime: 100% (Always available)                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Success Rate                                             │  │
│  │ ████████████████████████████████████████████████ 100%   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  Avg Latency: 180ms (Fast!)                                     │
│  Total Queries: 9,120 (last 7 days)                             │
│  Errors: 0                                                       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ROUTING ADJUSTMENTS (Auto-Applied)                             │
│  • Gemini Pro: Reduced priority (degraded performance)          │
│  • Claude Haiku: Increased priority (excellent reliability)     │
│  • WebLLM Local: Fallback chain moved up (zero failures)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 DIAGRAM 7: LEARNING & OPTIMIZATION LOOP

```
                    Week 1: Initial Deployment
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Initial Routing Rules (Conservative)                           │
│  • Simple (0-30): Local WebLLM                                  │
│  • Medium (31-60): Claude Haiku                                 │
│  • Complex (61-100): Claude Opus                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Collect Data (7 days)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Analytics Insights                                             │
│  • Claude Haiku handles complexity 40-70 well (user feedback)   │
│  • Local WebLLM underutilized (only 15% of traffic)             │
│  • Some complexity=65 queries failed on Haiku                   │
│  • OpenAI GPT-3.5 cheaper than Haiku for simple reasoning       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Week 2: Optimization Applied
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Optimized Routing Rules (Data-Driven)                          │
│  • Simple (0-35): Local WebLLM (expanded range)                 │
│  • Medium (36-65): Claude Haiku                                 │
│  • Complex (66-100): Claude Opus                                │
│  • Special: GPT-3.5 for queries <30 with no MBTI context        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Collect Data (7 days)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Improved Metrics                                               │
│  • Cost reduced: $168 → $142/month (15% additional savings)     │
│  • Quality maintained: 96% user satisfaction                    │
│  • Fallback rate reduced: 2.5% → 1.8%                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Week 3+: Continuous Learning
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Advanced Optimizations                                         │
│  • MBTI-specific routing (INFPs prefer Claude warmth)           │
│  • Time-of-day optimization (off-peak = premium models)         │
│  • User preference learning (power users = faster models)       │
│  • Feature-specific tuning (wellness = local, coaching = cloud) │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    🎯 Optimal Performance!
```

---

**Document Type**: Visual Architecture Guide  
**Status**: Ready for Review  
**Next**: Implementation Specifications  
**Location**: `shared/bmad-agents/tasks/routellm-visual-diagrams.md`
