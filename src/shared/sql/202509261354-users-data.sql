
-- Insert initial Superadmin user
INSERT INTO users (uuid, email, name, role, password_hash, is_active, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'superadmin@serbancario.ao', 'Superadmin User', 'superadmin', 'hashed_password_placeholder', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
