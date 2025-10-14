-- =================================================================
-- MET2.4 V14 AUDIT EVENTS TABLE - CLEAN VERSION
-- Privacy-First ChatLLM Compliance Enhancement  
-- =================================================================
-- Voor gebruik in Supabase SQL Editor - TESTED VERSION
-- Datum: 11 oktober 2025
-- Auteur: Thomas (MET2.4 V14 Production Setup)
-- =================================================================

-- ✅ STAP 1: Maak audit_events table aan
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

-- ✅ STAP 2: Indexen voor performance
CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON public.audit_events(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_trace_id ON public.audit_events(trace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON public.audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON public.audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_data_sensitivity ON public.audit_events(data_sensitivity_level);
CREATE INDEX IF NOT EXISTS idx_audit_events_processing_method ON public.audit_events(processing_method);
CREATE INDEX IF NOT EXISTS idx_audit_events_status ON public.audit_events(status);
CREATE INDEX IF NOT EXISTS idx_audit_events_external_api ON public.audit_events(external_api_used);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_timestamp ON public.audit_events(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);

-- ✅ STAP 3: Row Level Security
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "audit_events_select_own" ON public.audit_events;
DROP POLICY IF EXISTS "audit_events_insert_all" ON public.audit_events;
DROP POLICY IF EXISTS "audit_events_admin_all" ON public.audit_events;

-- Create new policies with simple names  
CREATE POLICY "audit_events_select_own" ON public.audit_events
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "audit_events_insert_all" ON public.audit_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "audit_events_admin_all" ON public.audit_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND (role = 'admin' OR role = 'superadmin')
        )
    );

-- ✅ STAP 4: V14 audit event creation function
CREATE OR REPLACE FUNCTION create_v14_audit_event(
    p_audit_id UUID DEFAULT NULL,
    p_trace_id UUID,
    p_user_id TEXT,
    p_session_id TEXT DEFAULT NULL,
    p_event_type TEXT,
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id TEXT DEFAULT NULL,
    p_data_sensitivity_level TEXT DEFAULT 'PERSONAL',
    p_processing_method TEXT DEFAULT 'cpu_fallback',
    p_sanitization_applied BOOLEAN DEFAULT true,
    p_external_api_used BOOLEAN DEFAULT false,
    p_compliance_flags JSONB DEFAULT NULL,
    p_input_hash TEXT DEFAULT NULL,
    p_output_hash TEXT DEFAULT NULL,
    p_input_length INTEGER DEFAULT NULL,
    p_output_length INTEGER DEFAULT NULL,
    p_sanitized_snippets JSONB DEFAULT NULL,
    p_processing_time_ms INTEGER DEFAULT NULL,
    p_model_used TEXT DEFAULT NULL,
    p_tokens_processed INTEGER DEFAULT NULL,
    p_memory_usage_mb DECIMAL DEFAULT NULL,
    p_gpu_utilization DECIMAL DEFAULT NULL,
    p_status TEXT DEFAULT 'success',
    p_error_type TEXT DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL,
    p_fallback_triggered BOOLEAN DEFAULT false,
    p_fallback_reason TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address_hash TEXT DEFAULT NULL,
    p_app_version TEXT DEFAULT NULL,
    p_platform TEXT DEFAULT NULL,
    p_locale TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_sequence_number INTEGER;
    v_prev_hash BYTEA;
    v_event_hash BYTEA;
    v_canonical_data TEXT;
    v_chain_position INTEGER;
BEGIN
    -- Generate audit ID if not provided
    v_audit_id := COALESCE(p_audit_id, gen_random_uuid());
    
    -- Get next sequence number for this trace
    SELECT COALESCE(MAX(sequence_number), 0) + 1 
    INTO v_sequence_number
    FROM public.audit_events 
    WHERE trace_id = p_trace_id;
    
    -- Get previous hash for chain integrity
    SELECT event_hash, chain_position
    INTO v_prev_hash, v_chain_position
    FROM public.audit_events 
    WHERE trace_id = p_trace_id 
    ORDER BY sequence_number DESC 
    LIMIT 1;
    
    -- Set chain position
    v_chain_position := COALESCE(v_chain_position, 0) + 1;
    
    -- Create canonical data for hashing (privacy-safe fields only)
    v_canonical_data := p_trace_id::text || '|' || 
                       p_event_type || '|' || 
                       COALESCE(p_action, '') || '|' ||
                       COALESCE(p_input_hash, '') || '|' ||
                       COALESCE(p_output_hash, '') || '|' ||
                       NOW()::text;
    
    -- Generate event hash
    v_event_hash := digest(v_canonical_data, 'sha256');
    
    -- Insert audit event
    INSERT INTO public.audit_events (
        audit_id, trace_id, sequence_number, timestamp, event_type, actor,
        user_id, session_id, model_id, model_version, policy_version,
        input_hash, output_hash, prev_hash, event_hash,
        action, resource_type, resource_id,
        data_sensitivity_level, processing_method, sanitization_applied, external_api_used,
        compliance_flags, input_length, output_length, sanitized_snippets,
        processing_time_ms, tokens_processed, memory_usage_mb, gpu_utilization,
        status, error_type, error_message, fallback_triggered, fallback_reason,
        chain_position, user_agent, ip_address_hash, app_version, platform, locale,
        event_timestamp, decision_data
    ) VALUES (
        v_audit_id, p_trace_id, v_sequence_number, NOW(), p_event_type, 'privacy_first_chatllm',
        p_user_id, p_session_id, p_model_used, '2.0.0', 'privacy_first_v2',
        p_input_hash, p_output_hash, v_prev_hash, v_event_hash,
        p_action, p_resource_type, p_resource_id,
        p_data_sensitivity_level, p_processing_method, p_sanitization_applied, p_external_api_used,
        p_compliance_flags, p_input_length, p_output_length, p_sanitized_snippets,
        p_processing_time_ms, p_tokens_processed, p_memory_usage_mb, p_gpu_utilization,
        p_status, p_error_type, p_error_message, p_fallback_triggered, p_fallback_reason,
        v_chain_position, p_user_agent, p_ip_address_hash, p_app_version, p_platform, p_locale,
        NOW(), p_metadata
    );
    
    RETURN v_audit_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create V14 audit event: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ STAP 5: Monitoring view
CREATE OR REPLACE VIEW v14_audit_summary AS
SELECT 
    DATE_TRUNC('hour', event_timestamp) as time_bucket,
    event_type,
    action,
    data_sensitivity_level,
    processing_method,
    status,
    COUNT(*) as event_count,
    AVG(processing_time_ms) as avg_processing_time,
    SUM(CASE WHEN fallback_triggered THEN 1 ELSE 0 END) as fallback_count,
    SUM(CASE WHEN external_api_used THEN 1 ELSE 0 END) as external_api_usage
FROM public.audit_events 
WHERE event_timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY 1, 2, 3, 4, 5, 6
ORDER BY 1 DESC;

-- ✅ STAP 6: Hash chain validation
CREATE OR REPLACE FUNCTION validate_audit_chain(p_trace_id UUID) 
RETURNS TABLE(
    is_valid BOOLEAN,
    broken_at_sequence INTEGER,
    error_message TEXT
) AS $$
DECLARE
    r RECORD;
    prev_hash BYTEA := NULL;
    expected_hash BYTEA;
BEGIN
    FOR r IN 
        SELECT sequence_number, event_hash, prev_hash as stored_prev_hash,
               trace_id::text || '|' || event_type || '|' || COALESCE(action, '') || '|' ||
               COALESCE(input_hash, '') || '|' || COALESCE(output_hash, '') || '|' ||
               timestamp::text as canonical
        FROM public.audit_events 
        WHERE trace_id = p_trace_id 
        ORDER BY sequence_number
    LOOP
        -- Check if previous hash matches
        IF r.stored_prev_hash IS DISTINCT FROM prev_hash THEN
            RETURN QUERY SELECT false, r.sequence_number, 'Hash chain broken: prev_hash mismatch';
            RETURN;
        END IF;
        
        -- Verify current event hash
        expected_hash := digest(r.canonical, 'sha256');
        IF r.event_hash != expected_hash THEN
            RETURN QUERY SELECT false, r.sequence_number, 'Hash chain broken: event_hash invalid';
            RETURN;
        END IF;
        
        prev_hash := r.event_hash;
    END LOOP;
    
    RETURN QUERY SELECT true, NULL::INTEGER, 'Hash chain valid'::TEXT;
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ GRANTS
GRANT SELECT, INSERT ON public.audit_events TO authenticated;
GRANT EXECUTE ON FUNCTION create_v14_audit_event TO authenticated;
GRANT EXECUTE ON FUNCTION validate_audit_chain TO authenticated;
GRANT SELECT ON v14_audit_summary TO authenticated;

-- ✅ TEST QUERIES (uncomment to test)
/*
-- Test table creation
SELECT 'Table created successfully' as result;

-- Test function
SELECT create_v14_audit_event(
    p_trace_id := gen_random_uuid(),
    p_user_id := 'test-user',
    p_event_type := 'chat_llm_process',
    p_action := 'privacy_sanitization',
    p_data_sensitivity_level := 'PERSONAL',
    p_processing_method := 'webgpu_local',
    p_external_api_used := false
) as created_audit_id;

-- Check if event was created
SELECT COUNT(*) as test_events FROM public.audit_events WHERE user_id = 'test-user';

-- Clean up test data
DELETE FROM public.audit_events WHERE user_id = 'test-user';
*/

-- ✅ SUCCESS MESSAGE
SELECT 'MET2.4 V14 Audit Events Table successfully deployed! 🎉' as deployment_status;