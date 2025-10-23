-- 🚀 MPNet L12-v2 Database Migration Script
-- Adds support for 384-dimensional all-MiniLM-L12-v2 embeddings
-- Maintains backward compatibility with existing OpenAI embeddings

-- Step 1: Add new columns for MPNet L12-v2 support
ALTER TABLE public.vector_embeddings 
ADD COLUMN IF NOT EXISTS embedding_384 vector(384),
ADD COLUMN IF NOT EXISTS model_name TEXT DEFAULT 'all-MiniLM-L12-v2',
ADD COLUMN IF NOT EXISTS inference_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS quality_score FLOAT,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS source_table TEXT;

-- Step 2: Add comments for documentation
COMMENT ON COLUMN public.vector_embeddings.embedding_384 IS 'MPNet L12-v2 embedding vector (384 dimensions)';
COMMENT ON COLUMN public.vector_embeddings.model_name IS 'Model used for embedding generation';
COMMENT ON COLUMN public.vector_embeddings.inference_time_ms IS 'Time taken to generate embedding in milliseconds';
COMMENT ON COLUMN public.vector_embeddings.quality_score IS 'Quality score for embedding (0.0-1.0)';
COMMENT ON COLUMN public.vector_embeddings.content_type IS 'Type of content (mbti_profile, chat_message, journal_entry, etc.)';
COMMENT ON COLUMN public.vector_embeddings.source_table IS 'Source table name for the embedded content';

-- Step 3: Create optimized indexes for fast similarity search
CREATE INDEX IF NOT EXISTS idx_embeddings_384_hnsw_cosine 
ON public.vector_embeddings 
USING hnsw (embedding_384 vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Step 4: Composite indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_embeddings_model_384 
ON public.vector_embeddings (model_name) 
WHERE embedding_384 IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_embeddings_user_model_384 
ON public.vector_embeddings (user_id, model_name) 
WHERE embedding_384 IS NOT NULL;

-- Step 5: Content type index for filtering
CREATE INDEX IF NOT EXISTS idx_embeddings_content_type_384
ON public.vector_embeddings (content_type)
WHERE embedding_384 IS NOT NULL;

-- Step 6: Enhanced similarity search function for all-MiniLM-L12-v2
CREATE OR REPLACE FUNCTION search_similar_l12v2(
    query_embedding vector(384),
    similarity_threshold float DEFAULT 0.75,
    max_results int DEFAULT 10,
    target_user_id text DEFAULT NULL,
    content_types text[] DEFAULT NULL,
    source_table text DEFAULT NULL
) RETURNS TABLE (
    id uuid,
    content text,
    similarity float,
    model_name text,
    content_type text,
    source_table text,
    inference_time_ms int,
    quality_score float,
    created_at timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ve.id,
        ve.content,
        1 - (ve.embedding_384 <=> query_embedding) as similarity,
        COALESCE(ve.model_name, 'all-MiniLM-L12-v2') as model_name,
        COALESCE(ve.content_type, 'general') as content_type,
        COALESCE(ve.source_table, 'unknown') as source_table,
        ve.inference_time_ms,
        ve.quality_score,
        ve.created_at
    FROM public.vector_embeddings ve
    WHERE 
        ve.embedding_384 IS NOT NULL
        AND (target_user_id IS NULL OR ve.user_id = target_user_id)
        AND (content_types IS NULL OR COALESCE(ve.content_type, 'general') = ANY(content_types))
        AND (source_table IS NULL OR COALESCE(ve.source_table, 'unknown') = source_table)
        AND 1 - (ve.embedding_384 <=> query_embedding) > similarity_threshold
    ORDER BY ve.embedding_384 <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Hybrid search function (supports both 384 and 1536 dimensions)
CREATE OR REPLACE FUNCTION search_similar_hybrid(
    query_text text,
    query_embedding_384 vector(384) DEFAULT NULL,
    query_embedding_1536 vector(1536) DEFAULT NULL,
    similarity_threshold float DEFAULT 0.75,
    max_results int DEFAULT 10,
    target_user_id text DEFAULT NULL,
    preferred_model text DEFAULT 'all-MiniLM-L12-v2'
) RETURNS TABLE (
    id uuid,
    content text,
    similarity float,
    model_used text,
    dimensions int,
    content_type text,
    created_at timestamp with time zone
) AS $$
BEGIN
    -- Priority 1: Use MPNet L12-v2 if available and preferred
    IF query_embedding_384 IS NOT NULL AND preferred_model = 'all-MiniLM-L12-v2' THEN
        RETURN QUERY
        SELECT 
            ve.id,
            ve.content,
            1 - (ve.embedding_384 <=> query_embedding_384) as similarity,
            'all-MiniLM-L12-v2' as model_used,
            384 as dimensions,
            COALESCE(ve.content_type, 'general') as content_type,
            ve.created_at
        FROM public.vector_embeddings ve
        WHERE 
            ve.embedding_384 IS NOT NULL
            AND (target_user_id IS NULL OR ve.user_id = target_user_id)
            AND 1 - (ve.embedding_384 <=> query_embedding_384) > similarity_threshold
        ORDER BY ve.embedding_384 <=> query_embedding_384
        LIMIT max_results;
        
        -- If we got results, return them
        IF FOUND THEN
            RETURN;
        END IF;
    END IF;
    
    -- Priority 2: Fallback to legacy OpenAI embeddings if needed
    IF query_embedding_1536 IS NOT NULL THEN
        RETURN QUERY
        SELECT 
            ve.id,
            ve.content,
            1 - (ve.embedding_vector::vector(1536) <=> query_embedding_1536) as similarity,
            'openai-ada-002' as model_used,
            1536 as dimensions,
            COALESCE(ve.content_type, 'general') as content_type,
            ve.created_at
        FROM public.vector_embeddings ve
        WHERE 
            ve.embedding_vector IS NOT NULL
            AND (target_user_id IS NULL OR ve.user_id = target_user_id)
            AND 1 - (ve.embedding_vector::vector(1536) <=> query_embedding_1536) > similarity_threshold
        ORDER BY ve.embedding_vector::vector(1536) <=> query_embedding_1536
        LIMIT max_results;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Analytics function for embedding performance
CREATE OR REPLACE FUNCTION get_embedding_analytics(
    target_user_id text DEFAULT NULL,
    days_back int DEFAULT 30
) RETURNS TABLE (
    model_name text,
    embedding_count bigint,
    avg_inference_time_ms float,
    avg_quality_score float,
    dimensions int
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ve.model_name, 'unknown') as model_name,
        COUNT(*) as embedding_count,
        AVG(ve.inference_time_ms::float) as avg_inference_time_ms,
        AVG(ve.quality_score) as avg_quality_score,
        CASE 
            WHEN ve.embedding_384 IS NOT NULL THEN 384
            WHEN ve.embedding_vector IS NOT NULL THEN 1536
            ELSE 0
        END as dimensions
    FROM public.vector_embeddings ve
    WHERE 
        (target_user_id IS NULL OR ve.user_id = target_user_id)
        AND ve.created_at >= NOW() - INTERVAL '%s days' % days_back
    GROUP BY 
        ve.model_name,
        CASE 
            WHEN ve.embedding_384 IS NOT NULL THEN 384
            WHEN ve.embedding_vector IS NOT NULL THEN 1536
            ELSE 0
        END
    ORDER BY embedding_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Update existing RLS policies to include new columns
-- (Assumes existing RLS policies exist - if not, create them)

-- Allow users to see embedding analytics (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view embedding analytics" ON public.vector_embeddings;
CREATE POLICY "Users can view embedding analytics" ON public.vector_embeddings
    FOR SELECT USING (true); -- Analytics can be viewed by anyone

-- Step 10: Add helpful comments and documentation
COMMENT ON FUNCTION search_similar_l12v2 IS 'Similarity search using MPNet L12-v2 embeddings (384 dimensions)';
COMMENT ON FUNCTION search_similar_hybrid IS 'Hybrid search supporting both MPNet L12-v2 and OpenAI embeddings';
COMMENT ON FUNCTION get_embedding_analytics IS 'Analytics for embedding performance and usage statistics';

-- Step 11: Performance optimization settings
-- Increase work_mem for vector operations (adjust based on your system)
-- SET work_mem = '256MB';

-- Step 12: Validate migration
-- Check if the new columns were added successfully
DO $$
DECLARE
    col_count integer;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns
    WHERE table_name = 'vector_embeddings'
    AND column_name IN ('embedding_384', 'model_name', 'inference_time_ms', 'quality_score', 'content_type', 'source_table');
    
    IF col_count = 6 THEN
        RAISE NOTICE '✅ Migration successful: All new columns added';
    ELSE
        RAISE EXCEPTION '❌ Migration failed: Expected 6 new columns, found %', col_count;
    END IF;
END $$;

-- Migration completed successfully
-- Ready for all-MiniLM-L12-v2 embeddings with dual vector support!