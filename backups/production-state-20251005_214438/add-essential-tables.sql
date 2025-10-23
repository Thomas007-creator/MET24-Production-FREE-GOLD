-- ================================================
-- ESSENTIËLE TABELLEN VOOR MET2.4.2 X OAUTH INTEGRATION
-- ================================================

-- 1. external_ai_services table (voor X OAuth en AI API keys)
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

-- 2. onboarding_states table (voor onboarding progress tracking)
CREATE TABLE IF NOT EXISTS public.onboarding_states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    last_step TEXT,
    step_completed_flags TEXT,
    onboarding_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ai_interactions table (voor AI usage tracking)
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL,
    ai_provider TEXT NOT NULL,
    model_used TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost DECIMAL(10,6),
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. vector_embeddings table (voor AI embeddings)
CREATE TABLE IF NOT EXISTS public.vector_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    embedding_vector TEXT,
    metadata TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. life_areas_progress table (voor levensgebieden tracking)
CREATE TABLE IF NOT EXISTS public.life_areas_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    life_area TEXT NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. content_management table (voor content opslag)
CREATE TABLE IF NOT EXISTS public.content_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    metadata TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. subscription_payments table (voor betalingen)
CREATE TABLE IF NOT EXISTS public.subscription_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    subscription_type TEXT NOT NULL,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. met24_domains table (voor domein management)
CREATE TABLE IF NOT EXISTS public.met24_domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_name TEXT NOT NULL UNIQUE,
    domain_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    ssl_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. levensgebieden table (voor levensgebieden configuratie)
CREATE TABLE IF NOT EXISTS public.levensgebieden (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. tasks_productivity table (voor taken en productiviteit)
CREATE TABLE IF NOT EXISTS public.tasks_productivity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    task_title TEXT NOT NULL,
    task_description TEXT,
    task_status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. sync_status table (voor sync status tracking)
CREATE TABLE IF NOT EXISTS public.sync_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    sync_type TEXT NOT NULL,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. analytics_tracking table (voor analytics)
CREATE TABLE IF NOT EXISTS public.analytics_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT,
    event_name TEXT NOT NULL,
    event_data TEXT,
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. extensions table (voor extensies)
CREATE TABLE IF NOT EXISTS public.extensions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    extension_name TEXT NOT NULL UNIQUE,
    extension_version TEXT,
    is_enabled BOOLEAN DEFAULT true,
    configuration TEXT,
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

-- ai_interactions indexes
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_provider ON public.ai_interactions(ai_provider);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON public.ai_interactions(created_at);

-- vector_embeddings indexes
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_user_id ON public.vector_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_content_type ON public.vector_embeddings(content_type);

-- life_areas_progress indexes
CREATE INDEX IF NOT EXISTS idx_life_areas_progress_user_id ON public.life_areas_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_life_areas_progress_life_area ON public.life_areas_progress(life_area);

-- content_management indexes
CREATE INDEX IF NOT EXISTS idx_content_management_user_id ON public.content_management(user_id);
CREATE INDEX IF NOT EXISTS idx_content_management_type ON public.content_management(content_type);

-- subscription_payments indexes
CREATE INDEX IF NOT EXISTS idx_subscription_payments_user_id ON public.subscription_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON public.subscription_payments(payment_status);

-- tasks_productivity indexes
CREATE INDEX IF NOT EXISTS idx_tasks_productivity_user_id ON public.tasks_productivity(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_productivity_status ON public.tasks_productivity(task_status);

-- sync_status indexes
CREATE INDEX IF NOT EXISTS idx_sync_status_user_id ON public.sync_status(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_status_type ON public.sync_status(sync_type);

-- analytics_tracking indexes
CREATE INDEX IF NOT EXISTS idx_analytics_tracking_user_id ON public.analytics_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_tracking_event ON public.analytics_tracking(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_tracking_created_at ON public.analytics_tracking(created_at);

-- ================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.external_ai_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vector_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_areas_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.met24_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levensgebieden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks_productivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extensions ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for ai_interactions
CREATE POLICY "Users can view their own AI interactions" ON public.ai_interactions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own AI interactions" ON public.ai_interactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- RLS Policies for vector_embeddings
CREATE POLICY "Users can view their own embeddings" ON public.vector_embeddings
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own embeddings" ON public.vector_embeddings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own embeddings" ON public.vector_embeddings
    FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS Policies for life_areas_progress
CREATE POLICY "Users can view their own progress" ON public.life_areas_progress
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress" ON public.life_areas_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress" ON public.life_areas_progress
    FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS Policies for content_management
CREATE POLICY "Users can view their own content" ON public.content_management
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own content" ON public.content_management
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own content" ON public.content_management
    FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS Policies for subscription_payments
CREATE POLICY "Users can view their own payments" ON public.subscription_payments
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own payments" ON public.subscription_payments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- RLS Policies for tasks_productivity
CREATE POLICY "Users can view their own tasks" ON public.tasks_productivity
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own tasks" ON public.tasks_productivity
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks_productivity
    FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS Policies for sync_status
CREATE POLICY "Users can view their own sync status" ON public.sync_status
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own sync status" ON public.sync_status
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own sync status" ON public.sync_status
    FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS Policies for analytics_tracking
CREATE POLICY "Users can view their own analytics" ON public.analytics_tracking
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own analytics" ON public.analytics_tracking
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ================================================
-- TRIGGERS VOOR AUTOMATISCHE TIMESTAMPS
-- ================================================

-- Function to update updated_at timestamp
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
CREATE TRIGGER update_vector_embeddings_updated_at BEFORE UPDATE ON public.vector_embeddings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_life_areas_progress_updated_at BEFORE UPDATE ON public.life_areas_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_management_updated_at BEFORE UPDATE ON public.content_management FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_payments_updated_at BEFORE UPDATE ON public.subscription_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_met24_domains_updated_at BEFORE UPDATE ON public.met24_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_levensgebieden_updated_at BEFORE UPDATE ON public.levensgebieden FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_productivity_updated_at BEFORE UPDATE ON public.tasks_productivity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sync_status_updated_at BEFORE UPDATE ON public.sync_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_extensions_updated_at BEFORE UPDATE ON public.extensions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

-- Insert completion record
INSERT INTO public.analytics_tracking (event_name, event_data, created_at) 
VALUES ('database_schema_update', '{"version": "2.4.2", "tables_added": 13, "purpose": "X_OAuth_integration"}', NOW());

-- Success message
SELECT 'MET2.4.2 Essential Tables Created Successfully!' as status,
       'X OAuth and AI Integration Ready' as message,
       NOW() as completed_at;
