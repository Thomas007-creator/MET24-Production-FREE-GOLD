-- ================================================
-- KRITIEKE TABELLEN VOOR MET2.4.2 X OAUTH INTEGRATION
-- Alleen de 2 ontbrekende tabellen die essentieel zijn
-- ================================================

-- 1. external_ai_services table (ESSENTIEEL voor X OAuth en AI API keys)
CREATE TABLE IF NOT EXISTS public.external_ai_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id TEXT NOT NULL UNIQUE,
    service_type TEXT NOT NULL,
    service_endpoint TEXT,
    authentication_data TEXT,
    service_model TEXT,
    service_configuration TEXT,
    service_limits TEXT,
    usage_statistics TEXT,
    cost_information TEXT,
    service_status TEXT DEFAULT 'active',
    last_accessed BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- 2. onboarding_states table (ESSENTIEEL voor onboarding progress tracking)
CREATE TABLE IF NOT EXISTS public.onboarding_states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    last_step TEXT,
    step_completed_flags TEXT,
    onboarding_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES VOOR PERFORMANCE
-- ================================================

-- external_ai_services indexes
CREATE INDEX IF NOT EXISTS idx_external_ai_services_user_id ON public.external_ai_services(service_id);
CREATE INDEX IF NOT EXISTS idx_external_ai_services_type ON public.external_ai_services(service_type);

-- onboarding_states indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_states_user_id ON public.onboarding_states(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_states_last_step ON public.onboarding_states(last_step);

-- ================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ================================================

-- Enable RLS on critical tables
ALTER TABLE public.external_ai_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_states ENABLE ROW LEVEL SECURITY;

-- RLS Policies for external_ai_services
CREATE POLICY "Users can view their own AI services" ON public.external_ai_services
    FOR SELECT USING (auth.uid()::text = split_part(service_id, '-', 1));

CREATE POLICY "Users can insert their own AI services" ON public.external_ai_services
    FOR INSERT WITH CHECK (auth.uid()::text = split_part(service_id, '-', 1));

CREATE POLICY "Users can update their own AI services" ON public.external_ai_services
    FOR UPDATE USING (auth.uid()::text = split_part(service_id, '-', 1));

-- RLS Policies for onboarding_states
CREATE POLICY "Users can view their own onboarding states" ON public.onboarding_states
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own onboarding states" ON public.onboarding_states
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own onboarding states" ON public.onboarding_states
    FOR UPDATE USING (auth.uid()::text = user_id);

-- ================================================
-- TRIGGERS VOOR AUTOMATISCHE TIMESTAMPS
-- ================================================

-- Function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_external_ai_services_updated_at BEFORE UPDATE ON public.external_ai_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_states_updated_at BEFORE UPDATE ON public.onboarding_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

-- Success message
SELECT 'MET2.4.2 Critical Tables Added Successfully!' as status,
       'X OAuth and Onboarding Integration Ready' as message,
       NOW() as completed_at;
