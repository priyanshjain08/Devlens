-- DevLens database schema
-- Run with: psql "$DATABASE_URL" -f db/schema.sql
-- (or: npm run migrate, which applies this file automatically)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS analyses (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id          TEXT NOT NULL,
    language           TEXT NOT NULL,
    code               TEXT NOT NULL,
    code_char_count    INTEGER NOT NULL,
    title              TEXT NOT NULL,
    overall_score      INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    category_scores    JSONB NOT NULL,
    summary            TEXT NOT NULL,
    issues             JSONB NOT NULL DEFAULT '[]',
    positives          JSONB NOT NULL DEFAULT '[]',
    explanation        JSONB NOT NULL DEFAULT '{}',
    ai_provider        TEXT NOT NULL,
    ai_model           TEXT NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analyses_client_id ON analyses (client_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC);
