CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name text, 
  email text UNIQUE, 
  password text, 
  created_date timestamptz NOT NULL DEFAULT NOW(), 
  modified_date timestamptz NOT NULL DEFAULT NOW()
  );

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.modified_date = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();