ALTER TABLE accounts ADD COLUMN is_verified BOOLEAN;

CREATE TABLE IF NOT EXISTS verification_tokens (
  id SERIAL PRIMARY KEY,
  token text NOT NULL, 
  account_id REFERENCES accounts(id) NOT NULL;
  created_date timestamptz NOT NULL DEFAULT NOW(),
  );