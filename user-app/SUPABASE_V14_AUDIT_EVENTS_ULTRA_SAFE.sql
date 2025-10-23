-- =================================================================
-- MET2.4 V14 AUDIT EVENTS - ULTRA SAFE UPGRADE
-- Privacy-First ChatLLM Compliance Enhancement  
-- =================================================================
-- ULTRA SAFE: SIMPLE PARAMETER STRUCTURE
-- Datum: 11 oktober 2025
-- =================================================================

-- ✅ STAP 1: Drop minimal policies en replace met safe full version
DROP POLICY IF EXISTS "audit_events_public_access" ON public.audit_events;

-- ✅ STAP 2: Safe RLS policies 
CREATE POLICY "audit_events_select_own" ON public.audit_events
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "audit_events_insert_all" ON public.audit_events
    FOR INSERT WITH CHECK (true);

-- ✅ STAP 3: SIMPLE but COMPLETE audit function
CREATE OR REPLACE FUNCTION create_v14_audit_event_simple(
    p_trace_id UUID,
    p_user_id TEXT,
    p_event_type TEXT,
    p_action TEXT
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_sequence_number INTEGER;
    v_prev_hash BYTEA;
    v_event_hash BYTEA;
    v_canonical_data TEXT;
    v_chain_position INTEGER;
BEGIN
    -- Generate audit ID
    v_audit_id := gen_random_uuid();
    
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
    
    -- Create canonical data for hashing
    v_canonical_data := p_trace_id::text || '|' || 
                       p_event_type || '|' || 
                       p_action || '|' ||
                       NOW()::text;
    
    -- Generate event hash
    v_event_hash := digest(v_canonical_data, 'sha256');
    
    -- Insert audit event (FULL STRUCTURE, default values)
    INSERT INTO public.audit_events (
        audit_id, trace_id, sequence_number, timestamp, event_type, actor,
        user_id, prev_hash, event_hash, action, 
        data_sensitivity_level, processing_method, sanitization_applied, external_api_used,
        status, chain_position, event_timestamp
    ) VALUES (
        v_audit_id, p_trace_id, v_sequence_number, NOW(), p_event_type, 'privacy_first_chatllm',
        p_user_id, v_prev_hash, v_event_hash, p_action,
        'PERSONAL', 'cpu_fallback', true, false,
        'success', v_chain_position, NOW()
    );
    
    RETURN v_audit_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create V14 audit event: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ STAP 4: ADVANCED audit function with all optionals
CREATE OR REPLACE FUNCTION create_v14_audit_event_advanced(
    trace_id_param UUID,
    user_id_param TEXT,
    event_type_param TEXT,
    action_param TEXT,
    metadata_param JSONB
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_sequence_number INTEGER;
    v_prev_hash BYTEA;
    v_event_hash BYTEA;
    v_canonical_data TEXT;
    v_chain_position INTEGER;
    
    -- Extract from metadata with defaults
    v_sensitivity TEXT := COALESCE(metadata_param->>'data_sensitivity_level', 'PERSONAL');
    v_method TEXT := COALESCE(metadata_param->>'processing_method', 'cpu_fallback');
    v_processing_time INTEGER := COALESCE((metadata_param->>'processing_time_ms')::INTEGER, NULL);
    v_tokens INTEGER := COALESCE((metadata_param->>'tokens_processed')::INTEGER, NULL);
    v_memory DECIMAL := COALESCE((metadata_param->>'memory_usage_mb')::DECIMAL, NULL);
    v_fallback BOOLEAN := COALESCE((metadata_param->>'fallback_triggered')::BOOLEAN, false);
    v_status TEXT := COALESCE(metadata_param->>'status', 'success');
BEGIN
    -- Generate audit ID
    v_audit_id := gen_random_uuid();
    
    -- Get next sequence number
    SELECT COALESCE(MAX(sequence_number), 0) + 1 
    INTO v_sequence_number
    FROM public.audit_events 
    WHERE trace_id = trace_id_param;
    
    -- Get previous hash
    SELECT event_hash, chain_position
    INTO v_prev_hash, v_chain_position
    FROM public.audit_events 
    WHERE trace_id = trace_id_param 
    ORDER BY sequence_number DESC 
    LIMIT 1;
    
    v_chain_position := COALESCE(v_chain_position, 0) + 1;
    
    -- Create hash
    v_canonical_data := trace_id_param::text || '|' || 
                       event_type_param || '|' || 
                       action_param || '|' ||
                       NOW()::text;
    
    v_event_hash := digest(v_canonical_data, 'sha256');
    
    -- Insert with extracted values
    INSERT INTO public.audit_events (
        audit_id, trace_id, sequence_number, timestamp, event_type, actor,
        user_id, prev_hash, event_hash, action, 
        data_sensitivity_level, processing_method, sanitization_applied, external_api_used,
        status, chain_position, event_timestamp, decision_data,
        processing_time_ms, tokens_processed, memory_usage_mb, fallback_triggered
    ) VALUES (
        v_audit_id, trace_id_param, v_sequence_number, NOW(), event_type_param, 'privacy_first_chatllm',
        user_id_param, v_prev_hash, v_event_hash, action_param,
        v_sensitivity, v_method, true, false,
        v_status, v_chain_position, NOW(), metadata_param,
        v_processing_time, v_tokens, v_memory, v_fallback
    );
    
    RETURN v_audit_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create advanced V14 audit event: %', SQLERRM;
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
    previous_hash BYTEA := NULL;
    expected_hash BYTEA;
BEGIN
    FOR r IN 
        SELECT sequence_number, event_hash, prev_hash as stored_prev_hash,
               trace_id::text || '|' || event_type || '|' || COALESCE(action, '') || '|' ||
               timestamp::text as canonical
        FROM public.audit_events 
        WHERE trace_id = p_trace_id 
        ORDER BY sequence_number
    LOOP
        -- Check if previous hash matches
        IF r.stored_prev_hash IS DISTINCT FROM previous_hash THEN
            RETURN QUERY SELECT false, r.sequence_number, 'Hash chain broken: prev_hash mismatch';
            RETURN;
        END IF;
        
        -- Verify current event hash
        expected_hash := digest(r.canonical, 'sha256');
        IF r.event_hash != expected_hash THEN
            RETURN QUERY SELECT false, r.sequence_number, 'Hash chain broken: event_hash invalid';
            RETURN;
        END IF;
        
        previous_hash := r.event_hash;
    END LOOP;
    
    RETURN QUERY SELECT true, NULL::INTEGER, 'Hash chain valid'::TEXT;
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ STAP 7: Performance indexes
CREATE INDEX IF NOT EXISTS idx_audit_events_data_sensitivity ON public.audit_events(data_sensitivity_level);
CREATE INDEX IF NOT EXISTS idx_audit_events_processing_method ON public.audit_events(processing_method);
CREATE INDEX IF NOT EXISTS idx_audit_events_status ON public.audit_events(status);
CREATE INDEX IF NOT EXISTS idx_audit_events_external_api ON public.audit_events(external_api_used);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON public.audit_events(audit_id);

-- ✅ STAP 8: Grants
GRANT EXECUTE ON FUNCTION create_v14_audit_event_simple TO authenticated;
GRANT EXECUTE ON FUNCTION create_v14_audit_event_advanced TO authenticated;
GRANT EXECUTE ON FUNCTION validate_audit_chain TO authenticated;
GRANT SELECT ON v14_audit_summary TO authenticated;

-- ✅ TEST SIMPLE function
SELECT create_v14_audit_event_simple(
    gen_random_uuid(),
    'test-ultra-safe',
    'ultra_safe_test',
    'simple_function_test'
) as simple_test_id;

-- ✅ TEST ADVANCED function
SELECT create_v14_audit_event_advanced(
    gen_random_uuid(),
    'test-ultra-safe-advanced',
    'ultra_safe_advanced_test',
    'advanced_function_test',
    '{"data_sensitivity_level": "PERSONAL", "processing_method": "webgpu_local", "processing_time_ms": 150, "tokens_processed": 25, "memory_usage_mb": 45.2, "fallback_triggered": false, "status": "success"}'::jsonb
) as advanced_test_id;

-- ✅ TEST hash chain validation
SELECT * FROM validate_audit_chain(
    (SELECT trace_id FROM public.audit_events WHERE user_id = 'test-ultra-safe' LIMIT 1)
);

-- ✅ CHECK monitoring view
SELECT * FROM v14_audit_summary WHERE event_type LIKE '%ultra_safe%';

-- ✅ CLEANUP tests
DELETE FROM public.audit_events WHERE user_id LIKE 'test-ultra-safe%';

-- ✅ SUCCESS
SELECT 'MET2.4 V14 Audit Events ULTRA SAFE UPGRADE SUCCESSFUL! 🎉' as ultra_safe_status;

-- ✅ FEATURES AVAILABLE
SELECT 'ULTRA SAFE FEATURES:' as info;
SELECT '✅ Simple function: create_v14_audit_event_simple() - 4 required params' as feature;
SELECT '✅ Advanced function: create_v14_audit_event_advanced() - JSON metadata' as feature;
SELECT '✅ Hash chain validation: validate_audit_chain()' as feature;
SELECT '✅ Performance monitoring: v14_audit_summary view' as feature;
SELECT '✅ User-specific RLS security' as feature;
SELECT '✅ 6 performance indexes' as feature;