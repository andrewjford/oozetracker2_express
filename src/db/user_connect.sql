ALTER TABLE categories ADD COLUMN account INTEGER REFERENCES users(id);

ALTER TABLE users RENAME TO accounts;

-- on line below, update reference to proper account id
UPDATE categories SET account = 8;
ALTER TABLE categories ALTER COLUMN account SET NOT NULL;

ALTER TABLE expenses ADD COLUMN account INTEGER REFERENCES accounts(id);
UPDATE expenses SET account = 8;
ALTER TABLE expenses ALTER COLUMN account SET NOT NULL;

ALTER TABLE categories RENAME COLUMN account TO account_id;
ALTER TABLE expenses RENAME COLUMN account TO account_id;