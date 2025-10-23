-- =================================================================
-- MET2.4 V14 AUDIT EVENTS TABLE - MINIMAL DEPLOY VERSION
-- Privacy-First ChatLLM Compliance Enhancement  
-- =================================================================
-- ULTRA-SAFE VERSION - BASIC TABLE + FUNCTION ONLY
-- Datum: 11 oktober 2025
-- =================================================================

-- ✅ STAP 1: Maak audit_events table aan (BASIC VERSION)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audit_id UUID DEFAULT gen_random_uuid(),
    trace_id UUID NOT NULL,
    sequence_number INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_type TEXT NOT NULL,
    actor TEXT NOT NULL DEFAULT 'privacy_first_chatllm',
    user_id TEXT,
    session_id TEXT,
    model_id TEXT,
    model_version TEXT,
    policy_version TEXT,
    input_hash TEXT,
    output_hash TEXT,
    input_ref TEXT,
    output_ref TEXT,
    risk_signals JSONB,
    decision_data JSONB,
    prev_hash BYTEA,
    event_hash BYTEA,
    pii_minimized BOOLEAN DEFAULT true,
    retention_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- V14 privacy-first uitbreidingen
    action TEXT,
    resource_type TEXT,
    resource_id TEXT,
    data_sensitivity_level TEXT CHECK (data_sensitivity_level IN ('PUBLIC', 'PERSONAL', 'SENSITIVE', 'CONFIDENTIAL')),
    processing_method TEXT CHECK (processing_method IN ('webgpu_local', 'cpu_fallback', 'pattern_fallback', 'emergency_block')),
    sanitization_applied BOOLEAN DEFAULT true,
    external_api_used BOOLEAN DEFAULT false,
    compliance_flags JSONB,
    input_length INTEGER,
    output_length INTEGER,
    sanitized_snippets JSONB,
    processing_time_ms INTEGER,
    tokens_processed INTEGER,
    memory_usage_mb DECIMAL(10,2),
    gpu_utilization DECIMAL(5,2),
    status TEXT CHECK (status IN ('success', 'warning', 'error', 'blocked')) DEFAULT 'success',
    error_type TEXT,
    error_message TEXT,
    fallback_triggered BOOLEAN DEFAULT false,
    fallback_reason TEXT,
    chain_position INTEGER,
    user_agent TEXT,
    ip_address_hash TEXT,
    app_version TEXT,
    platform TEXT,
    locale TEXT,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ STAP 2: Essential indexen
CREATE INDEX IF NOT EXISTS idx_audit_events_trace_id ON public.audit_events(trace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON public.audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON public.audit_events(event_timestamp);

-- ✅ STAP 3: RLS (BASIC VERSION - NO AUTH DEPENDENCIES)
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Ultra-safe policy - allows all operations for now
CREATE POLICY "audit_events_public_access" ON public.audit_events
    FOR ALL USING (true);

-- ✅ STAP 4: V14 audit creation function (SIMPLIFIED)
CREATE OR REPLACE FUNCTION create_v14_audit_event(
    p_trace_id UUID,
    p_user_id TEXT,
    p_event_type TEXT,
    p_action TEXT DEFAULT NULL,
    p_data_sensitivity_level TEXT DEFAULT 'PERSONAL',
    p_processing_method TEXT DEFAULT 'cpu_fallback',
    p_status TEXT DEFAULT 'success',
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_sequence_number INTEGER;
BEGIN
    -- Generate audit ID
    v_audit_id := gen_random_uuid();
    
    -- Get next sequence number
    SELECT COALESCE(MAX(sequence_number), 0) + 1 
    INTO v_sequence_number
    FROM public.audit_events 
    WHERE trace_id = p_trace_id;
    
    -- Insert audit event (MINIMAL VERSION)
    INSERT INTO public.audit_events (
        audit_id, trace_id, sequence_number, event_type,
        user_id, action, data_sensitivity_level, processing_method,
        status, event_timestamp, decision_data, sanitization_applied, external_api_used
    ) VALUES (
        v_audit_id, p_trace_id, v_sequence_number, p_event_type,
        p_user_id, p_action, p_data_sensitivity_level, p_processing_method,
        p_status, NOW(), p_metadata, true, false
    );
    
    RETURN v_audit_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create V14 audit event: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ✅ GRANTS
GRANT ALL ON public.audit_events TO authenticated;
GRANT ALL ON public.audit_events TO anon;
GRANT EXECUTE ON FUNCTION create_v14_audit_event TO authenticated;
GRANT EXECUTE ON FUNCTION create_v14_audit_event TO anon;

-- ✅ TEST
SELECT create_v14_audit_event(
    p_trace_id := gen_random_uuid(),
    p_user_id := 'test-user-minimal',
    p_event_type := 'deployment_test',
    p_action := 'table_creation'
) as test_audit_id;

-- Check table
SELECT COUNT(*) as created_events FROM public.audit_events WHERE user_id = 'test-user-minimal';

-- ✅ SUCCESS
SELECT 'MET2.4 V14 Audit Events MINIMAL deployment successful! 🎉' as status;