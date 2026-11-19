-- Demandes de devis reçues via /api/devis.
-- Appliquer : npx wrangler d1 migrations apply stayphora --remote   (--local en dev)
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,                               -- UUID
  created_at TEXT NOT NULL,                          -- date ISO 8601 (UTC)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  profile TEXT NOT NULL,                             -- conciergerie | proprietaire | hote | agent | autre
  property_type TEXT NOT NULL,
  area INTEGER NOT NULL,                             -- m²
  units INTEGER,                                     -- nombre de logements (conciergeries)
  city TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '',
  videos_link TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',                -- new | quoted | won | lost…
  internal_email_sent INTEGER NOT NULL DEFAULT 0,    -- 0 / 1
  confirmation_email_sent INTEGER NOT NULL DEFAULT 0 -- 0 / 1
);

CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes (created_at);
