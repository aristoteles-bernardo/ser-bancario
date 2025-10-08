
-- Insert sponsors and partners for the portal
INSERT INTO sponsors (name, logo_url, description, website_url, display_order, is_active, created_at, updated_at)
VALUES
  ('Ser Bancário', 'https://heyboss.heeyo.ai/1758894905-88cce9e4.png', 'Portal de Notícias do Setor Bancário Angolano', '/', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Banco Nacional de Angola', 'https://heyboss.heeyo.ai/logos/aws_light.svg', 'Banco Central de Angola', 'https://www.bna.ao', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Banco BAI', 'https://heyboss.heeyo.ai/logos/google.svg', 'Banco Angolano de Investimentos', 'https://www.bancobai.ao', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Banco BIC', 'https://heyboss.heeyo.ai/logos/microsoft.svg', 'Banco BIC Angola', 'https://www.bancobic.ao', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Banco Millennium Atlântico', 'https://heyboss.heeyo.ai/logos/linkedin.svg', 'Banco Millennium Atlântico Angola', 'https://www.millenniumatlntico.ao', 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
