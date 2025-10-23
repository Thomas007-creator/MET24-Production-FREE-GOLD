-- ================================================
-- DATABASE MIGRATION: Token Usage & Push Subscriptions
-- MET24 Production - Security Fix #2
-- ================================================

-- Create token_usage table
CREATE TABLE IF NOT EXISTS token_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  token_limit INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  user_id TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_usage_provider ON token_usage(provider);
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_last_updated ON token_usage(last_updated);
CREATE INDEX IF NOT EXISTS idx_token_usage_provider_user ON token_usage(provider, user_id);

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  subscription JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_created_at ON push_subscriptions(created_at);

-- Create notification_history table (for tracking sent notifications)
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'delivered'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_type ON notification_history(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_history_sent_at ON notification_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_notification_history_status ON notification_history(status);

-- Create token_thresholds table (for monitoring token usage limits)
CREATE TABLE IF NOT EXISTS token_thresholds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  user_id TEXT,
  threshold_percentage DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_thresholds_provider ON token_thresholds(provider);
CREATE INDEX IF NOT EXISTS idx_token_thresholds_user_id ON token_thresholds(user_id);
CREATE INDEX IF NOT EXISTS idx_token_thresholds_active ON token_thresholds(is_active);

-- Insert default token thresholds
INSERT INTO token_thresholds (provider, threshold_percentage, is_active) VALUES
  ('openai', 80.00, true),
  ('claude', 80.00, true),
  ('grok', 80.00, true),
  ('gemini', 80.00, true)
ON CONFLICT DO NOTHING;

-- Create RLS (Row Level Security) policies
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_thresholds ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY "Users can view own token usage" ON token_usage
  FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own push subscriptions" ON push_subscriptions
  FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own notification history" ON notification_history
  FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NULL);

-- RLS Policy: Service role can do everything
CREATE POLICY "Service role can manage token usage" ON token_usage
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage push subscriptions" ON push_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage notification history" ON notification_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage token thresholds" ON token_thresholds
  FOR ALL USING (auth.role() = 'service_role');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_token_usage_updated_at BEFORE UPDATE ON token_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_thresholds_updated_at BEFORE UPDATE ON token_thresholds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to check token thresholds and send notifications
CREATE OR REPLACE FUNCTION check_token_thresholds()
RETURNS TRIGGER AS $$
DECLARE
  threshold_record RECORD;
  current_percentage DECIMAL(5,2);
BEGIN
  -- Get the threshold for this provider
  SELECT * INTO threshold_record
  FROM token_thresholds
  WHERE provider = NEW.provider
    AND (user_id = NEW.user_id OR user_id IS NULL)
    AND is_active = true
  ORDER BY user_id DESC NULLS LAST
  LIMIT 1;

  -- If threshold exists and current usage exceeds it
  IF threshold_record IS NOT NULL AND NEW.percentage >= threshold_record.threshold_percentage THEN
    -- Log the threshold breach
    INSERT INTO notification_history (
      user_id,
      notification_type,
      title,
      body,
      data,
      status
    ) VALUES (
      NEW.user_id,
      'token_threshold_breach',
      'Token Usage Alert',
      'Token usage for ' || NEW.provider || ' has reached ' || NEW.percentage || '%',
      jsonb_build_object(
        'provider', NEW.provider,
        'percentage', NEW.percentage,
        'threshold', threshold_record.threshold_percentage
      ),
      'sent'
    );
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for token threshold checking
CREATE TRIGGER check_token_thresholds_trigger
  AFTER INSERT OR UPDATE ON token_usage
  FOR EACH ROW EXECUTE FUNCTION check_token_thresholds();

-- Grant necessary permissions
GRANT ALL ON token_usage TO authenticated;
GRANT ALL ON push_subscriptions TO authenticated;
GRANT ALL ON notification_history TO authenticated;
GRANT ALL ON token_thresholds TO authenticated;

GRANT ALL ON token_usage TO service_role;
GRANT ALL ON push_subscriptions TO service_role;
GRANT ALL ON notification_history TO service_role;
GRANT ALL ON token_thresholds TO service_role;

-- Create views for easier querying
CREATE OR REPLACE VIEW token_usage_summary AS
SELECT
  provider,
  user_id,
  SUM(tokens_used) as total_tokens_used,
  AVG(percentage) as avg_percentage,
  MAX(percentage) as max_percentage,
  COUNT(*) as usage_count,
  MAX(last_updated) as last_updated
FROM token_usage
GROUP BY provider, user_id;

CREATE OR REPLACE VIEW active_push_subscriptions AS
SELECT
  id,
  user_id,
  subscription,
  created_at,
  updated_at
FROM push_subscriptions
WHERE is_active = true;

-- Add comments for documentation
COMMENT ON TABLE token_usage IS 'Tracks token usage per AI provider and user';
COMMENT ON TABLE push_subscriptions IS 'Stores push notification subscriptions';
COMMENT ON TABLE notification_history IS 'Tracks sent notifications for audit purposes';
COMMENT ON TABLE token_thresholds IS 'Defines token usage thresholds for alerts';

COMMENT ON COLUMN token_usage.provider IS 'AI provider (openai, claude, grok, etc.)';
COMMENT ON COLUMN token_usage.percentage IS 'Percentage of token limit used';
COMMENT ON COLUMN push_subscriptions.subscription IS 'Push subscription object from browser';
COMMENT ON COLUMN notification_history.data IS 'Additional data sent with notification';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database migration completed successfully!';
  RAISE NOTICE '📊 Created tables: token_usage, push_subscriptions, notification_history, token_thresholds';
  RAISE NOTICE '🔒 RLS policies enabled for security';
  RAISE NOTICE '⚡ Indexes created for performance';
  RAISE NOTICE '🔔 Triggers created for automatic threshold checking';
END $$;
