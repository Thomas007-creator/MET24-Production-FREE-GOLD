-- =================================================================
-- MET2.4 V14 AUDIT EVENTS TABLE UPDATE
-- Privacy-First ChatLLM Compliance Enhancement
-- =================================================================
-- Voor gebruik in Supabase SQL Editor
-- Datum: 11 oktober 2025
-- Auteur: Thomas (MET2.4 V14 Production Setup)
-- 
-- 🎯 DIT SCRIPT:
-- - Maakt audit_events table aan (als hij niet bestaat)
-- - Voegt V14 privacy-first velden toe voor ChatLLM compliance
-- - Zorgt voor backward compatibility met bestaande installaties
-- - Implementeert hash chain integrity validation
-- - Voegt Row Level Security toe voor privacy protection
-- =================================================================

-- ✅ STAP 1: Eerst audit_events table aanmaken (als hij niet bestaat)
-- Basis EU AI Act compliant structure met V14 privacy-first uitbreidingen

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

-- ✅ STAP 1b: Voor bestaande databases - voeg alleen ontbrekende kolommen toe
-- (Deze worden geskipt als de table net is aangemaakt)

DO $$ 
BEGIN
    -- Check if table exists and add missing columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_events') THEN
        -- Add columns that might be missing in existing installations
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'audit_id') THEN
            ALTER TABLE public.audit_events ADD COLUMN audit_id UUID DEFAULT gen_random_uuid();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'action') THEN
            ALTER TABLE public.audit_events ADD COLUMN action TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'resource_type') THEN
            ALTER TABLE public.audit_events ADD COLUMN resource_type TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'resource_id') THEN
            ALTER TABLE public.audit_events ADD COLUMN resource_id TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'data_sensitivity_level') THEN
            ALTER TABLE public.audit_events ADD COLUMN data_sensitivity_level TEXT CHECK (data_sensitivity_level IN ('PUBLIC', 'PERSONAL', 'SENSITIVE', 'CONFIDENTIAL'));
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'processing_method') THEN
            ALTER TABLE public.audit_events ADD COLUMN processing_method TEXT CHECK (processing_method IN ('webgpu_local', 'cpu_fallback', 'pattern_fallback', 'emergency_block'));
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'sanitization_applied') THEN
            ALTER TABLE public.audit_events ADD COLUMN sanitization_applied BOOLEAN DEFAULT true;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'external_api_used') THEN
            ALTER TABLE public.audit_events ADD COLUMN external_api_used BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'compliance_flags') THEN
            ALTER TABLE public.audit_events ADD COLUMN compliance_flags JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'input_length') THEN
            ALTER TABLE public.audit_events ADD COLUMN input_length INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'output_length') THEN
            ALTER TABLE public.audit_events ADD COLUMN output_length INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'sanitized_snippets') THEN
            ALTER TABLE public.audit_events ADD COLUMN sanitized_snippets JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'processing_time_ms') THEN
            ALTER TABLE public.audit_events ADD COLUMN processing_time_ms INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'tokens_processed') THEN
            ALTER TABLE public.audit_events ADD COLUMN tokens_processed INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'memory_usage_mb') THEN
            ALTER TABLE public.audit_events ADD COLUMN memory_usage_mb DECIMAL(10,2);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'gpu_utilization') THEN
            ALTER TABLE public.audit_events ADD COLUMN gpu_utilization DECIMAL(5,2);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'status') THEN
            ALTER TABLE public.audit_events ADD COLUMN status TEXT CHECK (status IN ('success', 'warning', 'error', 'blocked')) DEFAULT 'success';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'error_type') THEN
            ALTER TABLE public.audit_events ADD COLUMN error_type TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'error_message') THEN
            ALTER TABLE public.audit_events ADD COLUMN error_message TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'fallback_triggered') THEN
            ALTER TABLE public.audit_events ADD COLUMN fallback_triggered BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'fallback_reason') THEN
            ALTER TABLE public.audit_events ADD COLUMN fallback_reason TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'chain_position') THEN
            ALTER TABLE public.audit_events ADD COLUMN chain_position INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'user_agent') THEN
            ALTER TABLE public.audit_events ADD COLUMN user_agent TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'ip_address_hash') THEN
            ALTER TABLE public.audit_events ADD COLUMN ip_address_hash TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'app_version') THEN
            ALTER TABLE public.audit_events ADD COLUMN app_version TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'platform') THEN
            ALTER TABLE public.audit_events ADD COLUMN platform TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'locale') THEN
            ALTER TABLE public.audit_events ADD COLUMN locale TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_events' AND column_name = 'event_timestamp') THEN
            ALTER TABLE public.audit_events ADD COLUMN event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- ✅ STAP 2: Nieuwe indexen voor V14 queries
CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON public.audit_events(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_data_sensitivity ON public.audit_events(data_sensitivity_level);
CREATE INDEX IF NOT EXISTS idx_audit_events_processing_method ON public.audit_events(processing_method);
CREATE INDEX IF NOT EXISTS idx_audit_events_status ON public.audit_events(status);
CREATE INDEX IF NOT EXISTS idx_audit_events_external_api ON public.audit_events(external_api_used);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_timestamp ON public.audit_events(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);

-- ✅ STAP 3: Row Level Security (RLS) voor privacy protection
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe cleanup)
DROP POLICY IF EXISTS "Users can view own audit events" ON public.audit_events;
DROP POLICY IF EXISTS "System can create audit events" ON public.audit_events;
DROP POLICY IF EXISTS "Admins can view all audit events" ON public.audit_events;

-- Policy: Users kunnen alleen hun eigen audit events zien
CREATE POLICY "Users can view own audit events" ON public.audit_events
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy: System kan alle audit events maken (voor automated logging)
CREATE POLICY "System can create audit events" ON public.audit_events
    FOR INSERT WITH CHECK (true);

-- Policy: Alleen admin kan alle audit events zien
CREATE POLICY "Admins can view all audit events" ON public.audit_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text 
            AND (role = 'admin' OR role = 'superadmin')
        )
    );

-- ✅ STAP 4: Functie voor V14 audit event creation (uitbreiding van bestaande)
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
        -- V14 nieuwe velden
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
        -- V14 waarden
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
        -- Log error maar fail niet de hele operatie
        RAISE WARNING 'Failed to create V14 audit event: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ STAP 5: View voor privacy-safe audit monitoring
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
    SUM(CASE WHEN external_api_used THEN 1 ELSE 0 END) as external_api_usage -- Zou altijd 0 moeten zijn
FROM public.audit_events 
WHERE event_timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY 1, 2, 3, 4, 5, 6
ORDER BY 1 DESC;

-- ✅ STAP 6: Functie voor hash chain validation
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
    canonical_data TEXT;
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

-- ✅ STAP 7: Cleanup policy voor privacy compliance (optioneel)
-- Automatically delete audit events older than retention period
CREATE OR REPLACE FUNCTION cleanup_old_audit_events() RETURNS void AS $$
BEGIN
    DELETE FROM public.audit_events 
    WHERE event_timestamp < NOW() - INTERVAL '1 year'
    AND retention_until IS NOT NULL 
    AND retention_until < NOW();
    
    -- Log cleanup event
    INSERT INTO public.audit_events (
        trace_id, event_type, actor, decision_data
    ) VALUES (
        gen_random_uuid(),
        'system_maintenance',
        'cleanup_function',
        jsonb_build_object('action', 'audit_cleanup', 'timestamp', NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ GRANTS voor applicatie toegang
GRANT SELECT, INSERT ON public.audit_events TO authenticated;
GRANT EXECUTE ON FUNCTION create_v14_audit_event TO authenticated;
GRANT EXECUTE ON FUNCTION validate_audit_chain TO authenticated;
GRANT SELECT ON v14_audit_summary TO authenticated;

-- =================================================================
-- 🎯 DEPLOYMENT CHECKLIST:
-- =================================================================
-- 1. ✅ Run dit script in je Supabase SQL Editor
-- 2. ✅ Verificeer dat alle indexen zijn aangemaakt
-- 3. ✅ Test de create_v14_audit_event functie
-- 4. ✅ Controleer RLS policies
-- 5. ✅ Verificeer de v14_audit_summary view
-- 6. ✅ Test hash chain validation
-- 
-- Na deployment kunnen je WatermelonDB V14 audit events 
-- syncen met deze uitgebreide Supabase schema!
-- =================================================================

-- ✅ VERIFICATION QUERIES - Run deze om te controleren of alles werkt:

-- 1. Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'audit_events' 
ORDER BY ordinal_position;

-- 2. Test audit event creation
SELECT create_v14_audit_event(
    p_trace_id := gen_random_uuid(),
    p_user_id := 'test-user',
    p_event_type := 'chat_llm_process',
    p_action := 'privacy_sanitization',
    p_data_sensitivity_level := 'PERSONAL',
    p_processing_method := 'webgpu_local',
    p_external_api_used := false
);

-- 3. Check if test event was created
SELECT * FROM public.audit_events WHERE user_id = 'test-user' LIMIT 1;

-- 4. Test audit summary view
SELECT * FROM v14_audit_summary LIMIT 5;

-- 5. Clean up test data
DELETE FROM public.audit_events WHERE user_id = 'test-user';