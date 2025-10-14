-- ================================================
-- EU AI ACT COMPLIANCE SCHEMA - MET24 AI BUDDY
-- ================================================
-- High-Risk AI System Compliance (Artikelen 9-16)
-- Implementeert: risicobeheer, data governance, technische documentatie,
-- logging/traceerbaarheid, transparantie, human oversight, nauwkeurigheid/robustheid

-- 1. RISK MANAGEMENT (Artikel 9)
CREATE TABLE IF NOT EXISTS public.risk_register (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    risk_id TEXT NOT NULL UNIQUE,
    risk_category TEXT NOT NULL, -- 'harm', 'privacy', 'security', 'bias', 'manipulation'
    risk_description TEXT NOT NULL,
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5),
    probability_score DECIMAL(3,2) CHECK (probability_score BETWEEN 0 AND 1),
    impact_score DECIMAL(3,2) CHECK (impact_score BETWEEN 0 AND 1),
    risk_score DECIMAL(3,2) GENERATED ALWAYS AS (severity_level * probability_score * impact_score) STORED,
    mitigation_strategy TEXT,
    mitigation_status TEXT DEFAULT 'pending', -- 'pending', 'implemented', 'verified', 'failed'
    test_evidence TEXT, -- JSON with test results
    policy_references TEXT[], -- Array of policy IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    approved_by TEXT
);

-- 2. DATA GOVERNANCE (Artikel 10)
CREATE TABLE IF NOT EXISTS public.dataset_registry (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dataset_id TEXT NOT NULL UNIQUE,
    dataset_name TEXT NOT NULL,
    dataset_type TEXT NOT NULL, -- 'training', 'evaluation', 'feedback', 'user_data'
    data_sources TEXT[], -- Array of data source descriptions
    data_quality_metrics JSONB, -- Quality scores, completeness, accuracy
    bias_assessment JSONB, -- Fairness metrics, demographic breakdowns
    consent_status TEXT DEFAULT 'pending', -- 'pending', 'granted', 'revoked', 'expired'
    retention_policy TEXT,
    data_origin TEXT, -- 'user_input', 'public_dataset', 'synthetic', 'third_party'
    license_info TEXT,
    dpo_approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    dpo_approval_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TECHNICAL DOCUMENTATION (Artikel 11)
CREATE TABLE IF NOT EXISTS public.system_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    system_version TEXT NOT NULL,
    system_name TEXT NOT NULL DEFAULT 'MET24 AI Buddy',
    intended_use TEXT NOT NULL,
    system_limitations TEXT[],
    known_risks TEXT[],
    performance_metrics JSONB, -- Accuracy, latency, throughput
    technical_architecture TEXT, -- High-level system description
    model_versions TEXT[], -- Array of model versions used
    deployment_environment TEXT,
    monitoring_capabilities TEXT[],
    user_responsibilities TEXT[],
    contact_information TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by TEXT,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_to TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.model_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id TEXT NOT NULL UNIQUE,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    provider TEXT NOT NULL, -- 'openai', 'claude', 'grok', 'local'
    training_data_sources TEXT[],
    training_data_size BIGINT,
    training_methodology TEXT,
    evaluation_metrics JSONB, -- Accuracy, bias, safety scores
    known_biases TEXT[],
    performance_characteristics JSONB,
    limitations TEXT[],
    intended_use_cases TEXT[],
    inappropriate_use_cases TEXT[],
    ethical_considerations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by TEXT
);

-- 4. RECORD-KEEPING & TRACEABILITY (Artikel 12)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trace_id UUID NOT NULL,
    sequence_number INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_type TEXT NOT NULL, -- 'request_received', 'policy_decision', 'model_invocation', 'model_output', 'oversight_intervention'
    actor TEXT NOT NULL, -- 'system', 'user', 'oversight', 'admin'
    user_id TEXT,
    session_id TEXT,
    model_id TEXT,
    model_version TEXT,
    policy_version TEXT,
    input_hash TEXT, -- Hash of redacted input
    output_hash TEXT, -- Hash of output
    input_ref TEXT, -- Reference to input blob in storage
    output_ref TEXT, -- Reference to output blob in storage
    risk_signals JSONB, -- Risk assessment signals
    decision_data JSONB, -- Policy decision details
    prev_hash BYTEA, -- Previous event hash for chain
    event_hash BYTEA, -- Current event hash
    pii_minimized BOOLEAN DEFAULT true,
    retention_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. HUMAN OVERSIGHT (Artikel 14)
CREATE TABLE IF NOT EXISTS public.oversight_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trace_id UUID NOT NULL,
    session_type TEXT NOT NULL, -- 'escalation', 'review', 'intervention', 'override'
    opened_by TEXT NOT NULL, -- User ID of oversight person
    opened_reason TEXT NOT NULL,
    risk_level INTEGER CHECK (risk_level BETWEEN 1 AND 5),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'escalated')),
    resolution TEXT,
    resolution_notes TEXT,
    actions_taken TEXT[],
    human_decision TEXT, -- 'allow', 'block', 'modify', 'escalate'
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    escalated_at TIMESTAMP WITH TIME ZONE
);

-- 6. ACCURACY & ROBUSTNESS (Artikel 15)
CREATE TABLE IF NOT EXISTS public.evaluation_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    evaluation_id TEXT NOT NULL UNIQUE,
    evaluation_type TEXT NOT NULL, -- 'adversarial', 'domain', 'safety', 'bias', 'performance'
    model_version TEXT NOT NULL,
    test_dataset_id TEXT,
    evaluation_metrics JSONB, -- Detailed metrics per test
    pass_threshold DECIMAL(3,2),
    actual_score DECIMAL(3,2),
    passed BOOLEAN GENERATED ALWAYS AS (actual_score >= pass_threshold) STORED,
    failure_reasons TEXT[],
    recommendations TEXT[],
    evaluator TEXT, -- Who ran the evaluation
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    approved_by TEXT
);

-- 7. INCIDENT MANAGEMENT (Artikelen 61-62)
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    incident_id TEXT NOT NULL UNIQUE,
    severity_level INTEGER NOT NULL CHECK (severity_level BETWEEN 1 AND 5),
    incident_category TEXT NOT NULL, -- 'harm', 'privacy_breach', 'security', 'bias', 'system_failure'
    incident_description TEXT NOT NULL,
    affected_users INTEGER,
    first_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    root_cause TEXT,
    impact_assessment TEXT,
    mitigation_actions TEXT[],
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'mitigated', 'resolved', 'reported')),
    authority_notification_required BOOLEAN DEFAULT false,
    authority_notified_at TIMESTAMP WITH TIME ZONE,
    authority_response TEXT,
    lessons_learned TEXT,
    prevention_measures TEXT[],
    reported_by TEXT,
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. POLICY REGISTRY
CREATE TABLE IF NOT EXISTS public.policy_registry (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    policy_version TEXT NOT NULL UNIQUE,
    policy_name TEXT NOT NULL,
    policy_type TEXT NOT NULL, -- 'safety', 'privacy', 'refusal', 'escalation'
    policy_rules JSONB NOT NULL, -- The actual policy rules
    change_log TEXT,
    approved_by TEXT NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_to TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- 9. COMPLIANCE SNAPSHOTS
CREATE TABLE IF NOT EXISTS public.compliance_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snapshot_id TEXT NOT NULL UNIQUE,
    snapshot_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'incident', 'audit'
    snapshot_data JSONB NOT NULL, -- Complete compliance state
    kpi_metrics JSONB, -- Key performance indicators
    incident_summary JSONB, -- Summary of incidents
    authority_ready BOOLEAN DEFAULT false, -- Ready for authority submission
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by TEXT,
    approved_by TEXT,
    submitted_to_authority_at TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Risk register indexes
CREATE INDEX IF NOT EXISTS idx_risk_register_category ON public.risk_register(risk_category);
CREATE INDEX IF NOT EXISTS idx_risk_register_score ON public.risk_register(risk_score);
CREATE INDEX IF NOT EXISTS idx_risk_register_status ON public.risk_register(mitigation_status);

-- Audit events indexes
CREATE INDEX IF NOT EXISTS idx_audit_events_trace_id ON public.audit_events(trace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON public.audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON public.audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);

-- Oversight sessions indexes
CREATE INDEX IF NOT EXISTS idx_oversight_sessions_trace_id ON public.oversight_sessions(trace_id);
CREATE INDEX IF NOT EXISTS idx_oversight_sessions_status ON public.oversight_sessions(status);
CREATE INDEX IF NOT EXISTS idx_oversight_sessions_opened_at ON public.oversight_sessions(opened_at);

-- Incident reports indexes
CREATE INDEX IF NOT EXISTS idx_incident_reports_severity ON public.incident_reports(severity_level);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON public.incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_category ON public.incident_reports(incident_category);

-- Evaluation runs indexes
CREATE INDEX IF NOT EXISTS idx_evaluation_runs_model_version ON public.evaluation_runs(model_version);
CREATE INDEX IF NOT EXISTS idx_evaluation_runs_type ON public.evaluation_runs(evaluation_type);
CREATE INDEX IF NOT EXISTS idx_evaluation_runs_passed ON public.evaluation_runs(passed);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all compliance tables
ALTER TABLE public.risk_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oversight_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_snapshots ENABLE ROW LEVEL SECURITY;

-- Audit events - users can only see their own events
CREATE POLICY "Users can view their own audit events" ON public.audit_events
    FOR SELECT USING (auth.uid()::text = user_id);

-- Oversight sessions - oversight staff can see all, users can see their own
CREATE POLICY "Users can view their own oversight sessions" ON public.oversight_sessions
    FOR SELECT USING (auth.uid()::text = opened_by OR auth.uid()::text IN (
        SELECT user_id FROM public.audit_events WHERE trace_id = oversight_sessions.trace_id
    ));

-- System and model cards - public read access
CREATE POLICY "System cards are publicly readable" ON public.system_cards
    FOR SELECT USING (true);

CREATE POLICY "Model cards are publicly readable" ON public.model_cards
    FOR SELECT USING (true);

-- Risk register - admin only
CREATE POLICY "Risk register admin only" ON public.risk_register
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Dataset registry - admin and DPO only
CREATE POLICY "Dataset registry admin and DPO only" ON public.dataset_registry
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'dpo'));

-- Incident reports - admin and oversight staff only
CREATE POLICY "Incident reports admin and oversight only" ON public.incident_reports
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'oversight'));

-- Evaluation runs - admin and evaluators only
CREATE POLICY "Evaluation runs admin and evaluators only" ON public.evaluation_runs
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'evaluator'));

-- Policy registry - admin only
CREATE POLICY "Policy registry admin only" ON public.policy_registry
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Compliance snapshots - admin and compliance staff only
CREATE POLICY "Compliance snapshots admin and compliance only" ON public.compliance_snapshots
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'compliance'));

-- ================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ================================================

-- Update triggers for all tables
CREATE TRIGGER update_risk_register_updated_at BEFORE UPDATE ON public.risk_register FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dataset_registry_updated_at BEFORE UPDATE ON public.dataset_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_cards_updated_at BEFORE UPDATE ON public.system_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_model_cards_updated_at BEFORE UPDATE ON public.model_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oversight_sessions_updated_at BEFORE UPDATE ON public.oversight_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VIEWS FOR COMPLIANCE REPORTING
-- ================================================

-- Safety KPI view
CREATE OR REPLACE VIEW v_safety_kpis AS
SELECT
    DATE_TRUNC('day', ae.timestamp) as day,
    COUNT(*) FILTER (WHERE ae.event_type = 'model_output') as total_outputs,
    COUNT(*) FILTER (WHERE ae.event_type = 'refusal_issued') as total_refusals,
    COUNT(*) FILTER (WHERE ae.event_type = 'pushback_issued') as total_pushbacks,
    COUNT(*) FILTER (WHERE ae.event_type = 'oversight_intervention') as total_oversight_interventions,
    ROUND(
        COUNT(*) FILTER (WHERE ae.event_type = 'refusal_issued')::DECIMAL / 
        NULLIF(COUNT(*) FILTER (WHERE ae.event_type = 'policy_decision'), 0) * 100, 2
    ) as refusal_rate_percent,
    ROUND(
        COUNT(*) FILTER (WHERE ae.event_type = 'pushback_issued')::DECIMAL / 
        NULLIF(COUNT(*) FILTER (WHERE ae.event_type = 'policy_decision'), 0) * 100, 2
    ) as pushback_rate_percent,
    COUNT(*) FILTER (WHERE ae.risk_signals ? 'harmful_flag' AND (ae.risk_signals->>'harmful_flag')::boolean) as harmful_content_detected,
    AVG((ae.risk_signals->>'overall_risk')::DECIMAL) as avg_risk_score
FROM public.audit_events ae
WHERE ae.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', ae.timestamp)
ORDER BY day DESC;

-- Incident summary view
CREATE OR REPLACE VIEW v_incident_summary AS
SELECT
    ir.incident_category,
    ir.severity_level,
    COUNT(*) as incident_count,
    COUNT(*) FILTER (WHERE ir.status = 'resolved') as resolved_count,
    COUNT(*) FILTER (WHERE ir.authority_notification_required = true) as authority_notifications_required,
    COUNT(*) FILTER (WHERE ir.authority_notified_at IS NOT NULL) as authority_notifications_sent,
    AVG(EXTRACT(EPOCH FROM (ir.updated_at - ir.first_detected_at))/3600) as avg_resolution_hours
FROM public.incident_reports ir
WHERE ir.first_detected_at >= NOW() - INTERVAL '90 days'
GROUP BY ir.incident_category, ir.severity_level
ORDER BY ir.severity_level DESC, incident_count DESC;

-- Model performance view
CREATE OR REPLACE VIEW v_model_performance AS
SELECT
    er.model_version,
    er.evaluation_type,
    COUNT(*) as total_evaluations,
    COUNT(*) FILTER (WHERE er.passed = true) as passed_evaluations,
    ROUND(COUNT(*) FILTER (WHERE er.passed = true)::DECIMAL / COUNT(*) * 100, 2) as pass_rate_percent,
    AVG(er.actual_score) as avg_score,
    MAX(er.completed_at) as last_evaluation
FROM public.evaluation_runs er
WHERE er.completed_at IS NOT NULL
GROUP BY er.model_version, er.evaluation_type
ORDER BY er.model_version, er.evaluation_type;

-- ================================================
-- FUNCTIONS FOR COMPLIANCE OPERATIONS
-- ================================================

-- Function to create audit event with hash chain
CREATE OR REPLACE FUNCTION create_audit_event(
    p_trace_id UUID,
    p_event_type TEXT,
    p_actor TEXT,
    p_user_id TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_model_id TEXT DEFAULT NULL,
    p_model_version TEXT DEFAULT NULL,
    p_policy_version TEXT DEFAULT NULL,
    p_input_hash TEXT DEFAULT NULL,
    p_output_hash TEXT DEFAULT NULL,
    p_risk_signals JSONB DEFAULT NULL,
    p_decision_data JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
    v_sequence_number INTEGER;
    v_prev_hash BYTEA;
    v_event_hash BYTEA;
    v_canonical_data TEXT;
BEGIN
    -- Get next sequence number for this trace
    SELECT COALESCE(MAX(sequence_number), 0) + 1 INTO v_sequence_number
    FROM public.audit_events 
    WHERE trace_id = p_trace_id;
    
    -- Get previous hash
    SELECT event_hash INTO v_prev_hash
    FROM public.audit_events 
    WHERE trace_id = p_trace_id 
    ORDER BY sequence_number DESC 
    LIMIT 1;
    
    -- Create canonical data for hashing
    v_canonical_data := json_build_object(
        'trace_id', p_trace_id,
        'sequence_number', v_sequence_number,
        'event_type', p_event_type,
        'actor', p_actor,
        'timestamp', NOW(),
        'prev_hash', COALESCE(encode(v_prev_hash, 'hex'), ''),
        'data', COALESCE(p_decision_data, '{}'::jsonb)
    )::text;
    
    -- Generate event hash
    v_event_hash := digest(v_canonical_data, 'sha256');
    
    -- Insert audit event
    INSERT INTO public.audit_events (
        trace_id, sequence_number, event_type, actor, user_id, session_id,
        model_id, model_version, policy_version, input_hash, output_hash,
        risk_signals, decision_data, prev_hash, event_hash
    ) VALUES (
        p_trace_id, v_sequence_number, p_event_type, p_actor, p_user_id, p_session_id,
        p_model_id, p_model_version, p_policy_version, p_input_hash, p_output_hash,
        p_risk_signals, p_decision_data, v_prev_hash, v_event_hash
    ) RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate compliance snapshot
CREATE OR REPLACE FUNCTION generate_compliance_snapshot(
    p_snapshot_type TEXT DEFAULT 'daily'
) RETURNS UUID AS $$
DECLARE
    v_snapshot_id UUID;
    v_snapshot_data JSONB;
    v_kpi_metrics JSONB;
    v_incident_summary JSONB;
BEGIN
    -- Generate snapshot ID
    v_snapshot_id := gen_random_uuid();
    
    -- Collect KPI metrics
    SELECT json_agg(row_to_json(t)) INTO v_kpi_metrics
    FROM (
        SELECT * FROM v_safety_kpis 
        WHERE day >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY day DESC
    ) t;
    
    -- Collect incident summary
    SELECT json_agg(row_to_json(t)) INTO v_incident_summary
    FROM (
        SELECT * FROM v_incident_summary
    ) t;
    
    -- Build complete snapshot data
    v_snapshot_data := json_build_object(
        'snapshot_id', v_snapshot_id,
        'snapshot_type', p_snapshot_type,
        'generated_at', NOW(),
        'system_version', (SELECT system_version FROM public.system_cards ORDER BY created_at DESC LIMIT 1),
        'active_models', (SELECT json_agg(row_to_json(t)) FROM (
            SELECT model_id, model_version, provider FROM public.model_cards 
            WHERE created_at >= NOW() - INTERVAL '30 days'
        ) t),
        'active_policies', (SELECT json_agg(row_to_json(t)) FROM (
            SELECT policy_version, policy_name, effective_from FROM public.policy_registry 
            WHERE is_active = true
        ) t),
        'kpi_metrics', v_kpi_metrics,
        'incident_summary', v_incident_summary,
        'risk_register_summary', (SELECT json_agg(row_to_json(t)) FROM (
            SELECT risk_category, COUNT(*) as count, AVG(risk_score) as avg_risk
            FROM public.risk_register 
            WHERE mitigation_status != 'verified'
            GROUP BY risk_category
        ) t)
    );
    
    -- Insert compliance snapshot
    INSERT INTO public.compliance_snapshots (
        snapshot_id, snapshot_type, snapshot_data, kpi_metrics, incident_summary
    ) VALUES (
        v_snapshot_id, p_snapshot_type, v_snapshot_data, v_kpi_metrics, v_incident_summary
    );
    
    RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- INITIAL DATA SETUP
-- ================================================

-- Insert initial system card
INSERT INTO public.system_cards (
    system_version, system_name, intended_use, system_limitations, known_risks,
    performance_metrics, technical_architecture, user_responsibilities, contact_information
) VALUES (
    '1.0.0',
    'MET24 AI Buddy',
    'MBTI-based personal development coaching and guidance',
    ARRAY[
        'Not a replacement for professional therapy or medical advice',
        'Limited to general personal development guidance',
        'May not be suitable for crisis situations'
    ],
    ARRAY[
        'Potential for bias in MBTI-based recommendations',
        'Risk of over-reliance on AI for personal decisions',
        'Privacy concerns with personal data processing'
    ],
    '{"accuracy": 0.85, "latency_ms": 1200, "throughput_rpm": 100}'::jsonb,
    'React PWA with Supabase backend, multiple AI provider integration, local-first data storage',
    ARRAY[
        'Use responsibly and not as sole source of guidance',
        'Report any concerning outputs immediately',
        'Maintain appropriate boundaries in interactions'
    ],
    'support@met24-ai-buddy.com'
) ON CONFLICT DO NOTHING;

-- Insert initial policy
INSERT INTO public.policy_registry (
    policy_version, policy_name, policy_type, policy_rules, approved_by
) VALUES (
    '1.0.0',
    'Default Safety Policy',
    'safety',
    '{
        "version": "1.0.0",
        "rules": [
            {
                "id": "R001",
                "when": {"topic": "self_harm"},
                "then": {"action": "REFUSE", "message_key": "self_harm_safe"}
            },
            {
                "id": "R002", 
                "when": {"user.age": {"lt": 18}, "topic": "mental_health"},
                "then": {"action": "ESCALATE"}
            },
            {
                "id": "R003",
                "when": {"uncertainty": {">": 0.6}},
                "then": {"action": "PUSHBACK", "ask": "clarify_scope"}
            }
        ]
    }'::jsonb,
    'system'
) ON CONFLICT DO NOTHING;

-- Insert initial risk register entries
INSERT INTO public.risk_register (
    risk_id, risk_category, risk_description, severity_level, probability_score, impact_score,
    mitigation_strategy, mitigation_status, created_by
) VALUES 
(
    'RISK-001', 'harm', 'AI provides harmful or inappropriate advice', 4, 0.2, 0.8,
    'Implement refusal logic and human oversight for high-risk interactions', 'implemented', 'system'
),
(
    'RISK-002', 'privacy', 'Unauthorized access to personal user data', 5, 0.1, 0.9,
    'Implement encryption, access controls, and audit logging', 'implemented', 'system'
),
(
    'RISK-003', 'bias', 'AI exhibits bias in MBTI-based recommendations', 3, 0.3, 0.6,
    'Regular bias testing and diverse training data validation', 'pending', 'system'
),
(
    'RISK-004', 'manipulation', 'AI is manipulated to ignore safety guidelines', 4, 0.2, 0.7,
    'Robust prompt filtering and manipulation detection', 'implemented', 'system'
);

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

SELECT 'EU AI Act Compliance Schema Created Successfully!' as status,
       'High-Risk AI System Compliance Ready' as message,
       NOW() as completed_at,
       'Tables created: 10, Views: 3, Functions: 2' as summary;
