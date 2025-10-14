# N8N ChatLLM Dashboard Ontwerp - Gebaseerd op Orcish Admin Templates

## 🎯 Dashboard Visie: Overzichtelijk Beheer voor n8n & ChatLLM

Gebaseerd op de analyses van TheOrcDev's admin templates, hier is het ontwerp voor een geïntegreerd dashboard voor n8n workflow management en ChatLLM AI-services.

## 📊 Dashboard Architecture - Geïnspireerd door Orcish Templates

### Core Template Features (Van Orcish Admin)
```tsx
// Dashboard Layout Structure
interface DashboardLayout {
  sidebar: SidebarNavigation;
  header: HeaderControls;
  mainContent: DashboardCards;
  theme: ThemeProvider;
}

// Gebaseerd op orcish-fullstack-admin architecture
const dashboardStructure = {
  layout: "grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]",
  components: ["Sidebar", "Header", "MainDashboard"],
  responsive: true,
  darkMode: true
};
```

## 🗂️ Sidebar Navigatie - N8N & ChatLLM Geïntegreerd

### Hoofdnavigatie Structuur
```tsx
export const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Home className="h-4 w-4" />,
    badge: null
  },
  {
    label: "n8n Workflows",
    href: "/admin/workflows",
    icon: <GitBranch className="h-4 w-4" />,
    badge: activeWorkflows.length
  },
  {
    label: "ChatLLM Services",
    href: "/admin/chatllm",
    icon: <Bot className="h-4 w-4" />,
    badge: onlineServices.length
  },
  {
    label: "AI Providers",
    href: "/admin/providers",
    icon: <Zap className="h-4 w-4" />,
    badge: null
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <LineChart className="h-4 w-4" />,
    badge: null
  },
  {
    label: "Database Health",
    href: "/admin/database",
    icon: <Database className="h-4 w-4" />,
    badge: syncStatus.length
  },
  {
    label: "System Logs",
    href: "/admin/logs",
    icon: <FileText className="h-4 w-4" />,
    badge: errorCount
  }
];
```

## 📈 Dashboard Cards - Overzichtelijke Widgets

### 1. N8N Workflow Management Widget
```tsx
interface WorkflowWidget {
  title: "n8n Workflows Status";
  data: {
    totalWorkflows: number;
    activeWorkflows: number;
    failedExecutions: number;
    avgExecutionTime: string;
  };
  actions: ["Start All", "Stop All", "Health Check"];
  realtimeUpdates: boolean;
}

// Template gebaseerd op orcish-admin OrdersTable
const WorkflowStatusTable = () => (
  <Card>
    <CardHeader className="px-7">
      <CardTitle>Active Workflows</CardTitle>
      <CardDescription>Real-time workflow execution status</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow Name</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Last Run</TableHead>
            <TableHead className="hidden md:table-cell">Success Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.id} className={workflow.active ? "bg-green-50" : ""}>
              <TableCell>
                <div className="font-medium">{workflow.name}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {workflow.description}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant={workflow.active ? "default" : "secondary"}>
                  {workflow.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {workflow.lastRun}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {workflow.successRate}%
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  {workflow.active ? "Stop" : "Start"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
```

### 2. ChatLLM Services Monitor Widget
```tsx
interface ChatLLMWidget {
  title: "ChatLLM AI Services";
  services: {
    openai: ServiceStatus;
    anthropic: ServiceStatus;
    local: ServiceStatus;
    custom: ServiceStatus[];
  };
  metrics: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    costToday: number;
  };
}

const ChatLLMServiceCards = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">OpenAI API</CardTitle>
        <Bot className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {openaiStatus.online ? "Online" : "Offline"}
        </div>
        <p className="text-xs text-muted-foreground">
          {openaiStatus.requests} requests today
        </p>
        <div className="mt-2">
          <Badge variant={openaiStatus.online ? "default" : "destructive"}>
            {openaiStatus.responseTime}ms avg
          </Badge>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Local ChatLLM</CardTitle>
        <Server className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {localChatLLM.status}
        </div>
        <p className="text-xs text-muted-foreground">
          {localChatLLM.uptime} uptime
        </p>
        <div className="mt-2">
          <Badge variant="outline">
            CPU: {localChatLLM.cpu}%
          </Badge>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">
          {privacyMetrics.score}/100
        </div>
        <p className="text-xs text-muted-foreground">
          {privacyMetrics.localProcessing}% local processing
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Cost</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          €{dailyCost.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          {dailyCost.change}% from yesterday
        </p>
      </CardContent>
    </Card>
  </div>
);
```

### 3. Interactive Analytics - Gebaseerd op Orcish Charts
```tsx
// Gebaseerd op orcish-fullstack-admin analytics page
const DashboardAnalytics = () => {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("requests");
  
  const chartConfig = {
    requests: {
      label: "API Requests",
      color: "hsl(var(--primary))",
    },
    workflows: {
      label: "Workflow Executions", 
      color: "hsl(var(--destructive))",
    },
    costs: {
      label: "AI Costs",
      color: "hsl(var(--muted))",
    }
  } satisfies ChartConfig;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>System Analytics</CardTitle>
          <CardDescription>
            n8n workflows and ChatLLM performance metrics
          </CardDescription>
        </div>
        <div className="flex">
          {["requests", "workflows", "costs"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {totals[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={analyticsData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="value"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
```

## 🔧 Header Controls - Geïntegreerd Beheer

### Header Component Features
```tsx
const DashboardHeader = () => (
  <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        {/* Mobile navigation */}
      </SheetContent>
    </Sheet>
    
    <div className="w-full flex-1">
      <AdminSearch placeholder="Search workflows, services, logs..." />
    </div>
    
    {/* Global Controls */}
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Activity className="h-4 w-4 mr-2" />
        System Status
      </Button>
      
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Sync All
      </Button>
    </div>
    
    <ModeToggle />
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleUser className="size-4" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>n8n Settings</DropdownMenuItem>
        <DropdownMenuItem>ChatLLM Config</DropdownMenuItem>
        <DropdownMenuItem>System Preferences</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Export Data</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
);
```

## 🎨 Theme & Styling - Orcish Template Gebaseerd

### CSS Custom Properties (Van orcish-admin)
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  
  /* n8n Branded Colors */
  --color-n8n-primary: #FF6D5A;
  --color-n8n-secondary: #2D2E3F;
  
  /* ChatLLM Status Colors */
  --color-chatllm-online: #10B981;
  --color-chatllm-offline: #EF4444;
  --color-chatllm-warning: #F59E0B;
  
  /* Dashboard Specific */
  --color-sidebar: oklch(0.216 0.006 56.043);
  --color-sidebar-foreground: oklch(0.985 0.001 106.423);
  --color-chart-1: oklch(0.488 0.243 264.376);
  --color-chart-2: oklch(0.696 0.17 162.48);
  --color-chart-3: oklch(0.769 0.188 70.08);
}

.dashboard-grid {
  @apply grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr];
}

.dashboard-card {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}

.status-badge-online {
  @apply inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-green-500 text-white hover:bg-green-600;
}

.status-badge-offline {
  @apply inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-red-500 text-white hover:bg-red-600;
}
```

## 🔄 Real-time Updates & State Management

### Dashboard State Architecture
```tsx
interface DashboardState {
  n8nWorkflows: {
    active: WorkflowStatus[];
    inactive: WorkflowStatus[];
    recentExecutions: ExecutionLog[];
  };
  chatLLMServices: {
    providers: ServiceProvider[];
    metrics: ServiceMetrics;
    healthChecks: HealthStatus[];
  };
  systemHealth: {
    database: DatabaseStatus;
    apis: APIStatus[];
    performance: PerformanceMetrics;
  };
  realTimeUpdates: {
    enabled: boolean;
    interval: number;
    lastUpdate: Date;
  };
}

// Zustand store gebaseerd op MET24 patterns
const useDashboardStore = create<DashboardState>((set, get) => ({
  // State implementation
  updateWorkflowStatus: async () => {
    const workflows = await fetchN8NWorkflows();
    set(state => ({
      ...state,
      n8nWorkflows: {
        ...state.n8nWorkflows,
        active: workflows.filter(w => w.active)
      }
    }));
  },
  
  updateChatLLMMetrics: async () => {
    const metrics = await fetchChatLLMMetrics();
    set(state => ({
      ...state,
      chatLLMServices: {
        ...state.chatLLMServices,
        metrics
      }
    }));
  }
}));
```

## 📱 Responsive Design - Mobile First

### Mobile Optimizations (Van Orcish Templates)
```tsx
// Mobile Navigation Sheet
const MobileDashboard = () => (
  <Sheet>
    <SheetContent side="left" className="flex flex-col">
      <nav className="grid gap-2 text-lg font-medium p-5">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold">
          <Package2 className="h-6 w-6" />
          <span>n8n & ChatLLM</span>
        </Link>
        
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            {item.icon}
            {item.label}
            {item.badge && (
              <Badge className="ml-auto flex">{item.badge}</Badge>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto px-5">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Emergency controls for n8n and ChatLLM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full mb-2">
              Stop All Workflows
            </Button>
            <Button size="sm" className="w-full" variant="outline">
              Reset AI Services
            </Button>
          </CardContent>
        </Card>
      </div>
    </SheetContent>
  </Sheet>
);

// Responsive Dashboard Cards
const ResponsiveDashboardGrid = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* Cards automatically stack on mobile */}
  </div>
);
```

## 🚀 Implementation Roadmap

### Fase 1: Core Dashboard (Week 1)
- [x] Basic layout met Orcish template structuur
- [x] Sidebar navigatie voor n8n & ChatLLM
- [x] Header met global controls
- [x] Theme provider met dark/light mode
- [ ] Responsive design implementatie

### Fase 2: n8n Integration (Week 2)
- [ ] n8n API wrapper service
- [ ] Workflow status monitoring
- [ ] Real-time execution tracking
- [ ] Workflow management controls

### Fase 3: ChatLLM Integration (Week 3)
- [ ] ChatLLM service monitoring
- [ ] AI provider health checks
- [ ] Cost tracking en analytics
- [ ] Privacy metrics dashboard

### Fase 4: Advanced Features (Week 4)
- [ ] System analytics met Charts
- [ ] Log aggregation en filtering
- [ ] Database health monitoring
- [ ] Export en backup functies

## 📦 Required Dependencies

### UI Framework (Van Orcish Templates)
```json
{
  "dependencies": {
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.400.0",
    "next-themes": "^0.3.0",
    "recharts": "^2.8.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### n8n & ChatLLM Integration
```json
{
  "dependencies": {
    "n8n-client": "^1.0.0",
    "ws": "^8.14.0",
    "axios": "^1.6.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.0"
  }
}
```

## 🎯 Dashboard Features Samenvatting

### Kern Functionaliteit
1. **n8n Workflow Management**
   - Real-time status monitoring
   - Start/stop controls
   - Execution history
   - Performance metrics

2. **ChatLLM Service Dashboard**
   - Multi-provider monitoring (OpenAI, Anthropic, Local)
   - API health checks
   - Cost tracking
   - Privacy compliance metrics

3. **System Analytics**
   - Interactive charts (gebaseerd op Orcish template)
   - Performance trending
   - Cost analysis
   - Usage patterns

4. **Unified Interface**
   - Consistent design language
   - Dark/light theme support
   - Mobile responsive
   - Real-time updates

Deze dashboard ontwerp combineert de beste elementen van beide Orcish admin templates met specifieke functionaliteit voor n8n workflow management en ChatLLM AI service monitoring, resulterend in een overzichtelijk en krachtig beheerinterface.