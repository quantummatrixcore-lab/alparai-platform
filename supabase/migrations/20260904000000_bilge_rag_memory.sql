-- Migration: 20260904000000_bilge_rag_memory.sql
-- Description: Bilge RAG Memory pgvector table & HNSW index for AI accountability memory

-- 1. pgvector eklentisini etkinleştir
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. bilge_memory tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.bilge_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security (RLS) etkinleştir ve Admin erişim policy'si ekle
ALTER TABLE public.bilge_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access bilge_memory" ON public.bilge_memory;
CREATE POLICY "Admin full access bilge_memory"
    ON public.bilge_memory FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 4. Hızlı vektör araması için HNSW index ekle
CREATE INDEX IF NOT EXISTS idx_bilge_memory_embedding 
    ON public.bilge_memory 
    USING hnsw (embedding vector_cosine_ops);

-- ROLLBACK:
-- DROP INDEX IF EXISTS public.idx_bilge_memory_embedding;
-- DROP POLICY IF EXISTS "Admin full access bilge_memory" ON public.bilge_memory;
-- DROP TABLE IF EXISTS public.bilge_memory;
