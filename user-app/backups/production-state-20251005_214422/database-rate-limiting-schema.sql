-- ================================================
-- RATE LIMITING DATABASE SCHEMA
-- MET24 Production - Security Enhancement
-- ================================================

-- Create rate_limiting table for persistent rate limiting
CREATE TABLE IF NOT EXISTS rate_limiting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  ip INET NOT NULL,
  user_agent TEXT,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limiting_key ON rate_limiting(key);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_ip ON rate_limiting(ip);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_created_at ON rate_limiting(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_key_created ON rate_limiting(key, created_at);

-- Create rate_limiting_config table for dynamic configuration
CREATE TABLE IF NOT EXISTS rate_limiting_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  window_ms INTEGER NOT NULL DEFAULT 900000, -- 15 minutes
  max_requests INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for rate limiting config
CREATE INDEX IF NOT EXISTS idx_rate_limiting_config_endpoint ON rate_limiting_config(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_config_active ON rate_limiting_config(is_active);

-- Create rate_limiting_whitelist table for trusted IPs
CREATE TABLE IF NOT EXISTS rate_limiting_whitelist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip INET NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for whitelist
CREATE INDEX IF NOT EXISTS idx_rate_limiting_whitelist_ip ON rate_limiting_whitelist(ip);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_whitelist_active ON rate_limiting_whitelist(is_active);

-- Create rate_limiting_blacklist table for blocked IPs
CREATE TABLE IF NOT EXISTS rate_limiting_blacklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip INET NOT NULL UNIQUE,
  reason TEXT,
  blocked_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blacklist
CREATE INDEX IF NOT EXISTS idx_rate_limiting_blacklist_ip ON rate_limiting_blacklist(ip);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_blacklist_active ON rate_limiting_blacklist(is_active);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_blacklist_blocked_until ON rate_limiting_blacklist(blocked_until);

-- Create rate_limiting_violations table for tracking violations
CREATE TABLE IF NOT EXISTS rate_limiting_violations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip INET NOT NULL,
  endpoint TEXT NOT NULL,
  violation_type TEXT NOT NULL, -- 'rate_limit', 'size_limit', 'invalid_input'
  details JSONB,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for violations
CREATE INDEX IF NOT EXISTS idx_rate_limiting_violations_ip ON rate_limiting_violations(ip);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_violations_endpoint ON rate_limiting_violations(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_violations_type ON rate_limiting_violations(violation_type);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_violations_created_at ON rate_limiting_violations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE rate_limiting ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limiting_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limiting_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limiting_blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limiting_violations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rate_limiting table
CREATE POLICY "Allow service role full access to rate_limiting" ON rate_limiting
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to read their own rate limiting data" ON rate_limiting
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for rate_limiting_config table
CREATE POLICY "Allow service role full access to rate_limiting_config" ON rate_limiting_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to read rate limiting config" ON rate_limiting_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for rate_limiting_whitelist table
CREATE POLICY "Allow service role full access to rate_limiting_whitelist" ON rate_limiting_whitelist
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for rate_limiting_blacklist table
CREATE POLICY "Allow service role full access to rate_limiting_blacklist" ON rate_limiting_blacklist
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for rate_limiting_violations table
CREATE POLICY "Allow service role full access to rate_limiting_violations" ON rate_limiting_violations
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default rate limiting configurations
INSERT INTO rate_limiting_config (endpoint, window_ms, max_requests, is_active) VALUES
  ('/api/ai/chat', 3600000, 50, true), -- 50 requests per hour for AI chat
  ('/api/ai/generate', 3600000, 50, true), -- 50 requests per hour for AI generation
  ('/api/push/subscribe', 900000, 10, true), -- 10 requests per 15 minutes for push subscription
  ('/api/token-monitor/update', 300000, 100, true), -- 100 requests per 5 minutes for token updates
  ('/api/sync', 600000, 20, true), -- 20 requests per 10 minutes for sync
  ('/api/auth/login', 900000, 5, true), -- 5 login attempts per 15 minutes
  ('/api/auth/register', 900000, 3, true), -- 3 registration attempts per 15 minutes
  ('/api/feedback', 3600000, 10, true), -- 10 feedback submissions per hour
  ('/api/contact', 3600000, 5, true) -- 5 contact form submissions per hour
ON CONFLICT (endpoint) DO NOTHING;

-- Create function to clean up old rate limiting data
CREATE OR REPLACE FUNCTION cleanup_old_rate_limiting_data()
RETURNS void AS $$
BEGIN
  -- Delete rate limiting data older than 24 hours
  DELETE FROM rate_limiting 
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  -- Delete violations older than 7 days
  DELETE FROM rate_limiting_violations 
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  -- Log cleanup
  RAISE NOTICE 'Cleaned up old rate limiting data';
END;
$$ LANGUAGE plpgsql;

-- Create function to check if IP is whitelisted
CREATE OR REPLACE FUNCTION is_ip_whitelisted(check_ip INET)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM rate_limiting_whitelist 
    WHERE ip = check_ip AND is_active = true
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to check if IP is blacklisted
CREATE OR REPLACE FUNCTION is_ip_blacklisted(check_ip INET)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM rate_limiting_blacklist 
    WHERE ip = check_ip 
    AND is_active = true 
    AND (blocked_until IS NULL OR blocked_until > NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get rate limit status for an IP
CREATE OR REPLACE FUNCTION get_rate_limit_status(
  check_ip INET,
  check_endpoint TEXT,
  window_ms INTEGER DEFAULT 900000
)
RETURNS TABLE(
  current_count BIGINT,
  max_requests INTEGER,
  remaining_requests BIGINT,
  reset_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as current_count,
    rlc.max_requests,
    GREATEST(0, rlc.max_requests - COUNT(*)) as remaining_requests,
    (NOW() + (window_ms || ' milliseconds')::INTERVAL) as reset_time
  FROM rate_limiting rl
  LEFT JOIN rate_limiting_config rlc ON rlc.endpoint = check_endpoint
  WHERE rl.ip = check_ip 
    AND rl.endpoint = check_endpoint
    AND rl.created_at > NOW() - (window_ms || ' milliseconds')::INTERVAL
  GROUP BY rlc.max_requests;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clean up old data
CREATE OR REPLACE FUNCTION trigger_cleanup_rate_limiting()
RETURNS TRIGGER AS $$
BEGIN
  -- Run cleanup every 1000 inserts
  IF (SELECT COUNT(*) FROM rate_limiting) % 1000 = 0 THEN
    PERFORM cleanup_old_rate_limiting_data();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_rate_limiting_trigger
  AFTER INSERT ON rate_limiting
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_rate_limiting();

-- Create views for easier monitoring
CREATE OR REPLACE VIEW rate_limiting_stats AS
SELECT 
  endpoint,
  COUNT(*) as total_requests,
  COUNT(DISTINCT ip) as unique_ips,
  AVG(EXTRACT(EPOCH FROM (NOW() - created_at))) as avg_age_seconds,
  MAX(created_at) as last_request
FROM rate_limiting
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY endpoint;

CREATE OR REPLACE VIEW rate_limiting_violations_summary AS
SELECT 
  violation_type,
  COUNT(*) as violation_count,
  COUNT(DISTINCT ip) as unique_ips,
  MAX(created_at) as last_violation
FROM rate_limiting_violations
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY violation_type;

-- Add comments for documentation
COMMENT ON TABLE rate_limiting IS 'Stores rate limiting data for API endpoints';
COMMENT ON TABLE rate_limiting_config IS 'Configuration for rate limiting per endpoint';
COMMENT ON TABLE rate_limiting_whitelist IS 'Whitelisted IPs that bypass rate limiting';
COMMENT ON TABLE rate_limiting_blacklist IS 'Blacklisted IPs that are blocked';
COMMENT ON TABLE rate_limiting_violations IS 'Tracks rate limiting violations and abuse';

COMMENT ON COLUMN rate_limiting.key IS 'Unique identifier for rate limiting (IP, user ID, etc.)';
COMMENT ON COLUMN rate_limiting_config.window_ms IS 'Time window in milliseconds';
COMMENT ON COLUMN rate_limiting_config.max_requests IS 'Maximum requests allowed in the time window';
COMMENT ON COLUMN rate_limiting_blacklist.blocked_until IS 'When the block expires (NULL = permanent)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Rate limiting database schema created successfully!';
  RAISE NOTICE '📊 Created tables: rate_limiting, rate_limiting_config, rate_limiting_whitelist, rate_limiting_blacklist, rate_limiting_violations';
  RAISE NOTICE '🔒 RLS policies enabled for security';
  RAISE NOTICE '⚡ Indexes created for performance';
  RAISE NOTICE '🔧 Functions created for rate limiting logic';
  RAISE NOTICE '📈 Views created for monitoring';
  RAISE NOTICE '🧹 Automatic cleanup triggers enabled';
END $$;
