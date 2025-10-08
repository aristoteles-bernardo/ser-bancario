

# MariaDB Migration Guide

This document provides complete instructions for migrating the Ser Bancário application from Cloudflare D1 to MariaDB.

## 1. Database Setup

The application now connects to a MariaDB instance with the following configuration:

- **Host**: 217.77.6.254
- **Database**: serbanca_production
- **Username**: serbanca_sa
- **Password**: S6rB@ncar!02025

## 2. Required Database Tables

Execute the following SQL statements to create the necessary tables in your MariaDB instance:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role ENUM('superadmin', 'gestor') DEFAULT 'gestor',
  password_hash VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_uuid (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(500) NOT NULL,
  subtitle TEXT,
  body_html LONGTEXT NOT NULL,
  categories VARCHAR(255),
  tags VARCHAR(500),
  publication_date TIMESTAMP NOT NULL,
  author VARCHAR(255) NOT NULL,
  is_featured TINYINT(1) DEFAULT 0,
  social_links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_publication_date (publication_date),
  INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create blogposts table
CREATE TABLE IF NOT EXISTS blogposts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(500) NOT NULL,
  subtitle TEXT,
  body_html LONGTEXT NOT NULL,
  categories VARCHAR(255),
  tags VARCHAR(500),
  publication_date TIMESTAMP NOT NULL,
  author VARCHAR(255) NOT NULL,
  social_links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_publication_date (publication_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(500) NOT NULL,
  description_html LONGTEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  banner_image_url VARCHAR(1000),
  capacity INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_event_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create eventbookings table
CREATE TABLE IF NOT EXISTS eventbookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  uniqueness_check VARCHAR(255),
  form_data JSON NOT NULL,
  notification_email_sent TINYINT(1) DEFAULT 0,
  reply_email_sent TINYINT(1) DEFAULT 0,
  email_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  INDEX idx_event_id (event_id),
  INDEX idx_uniqueness (uniqueness_check)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  logo_url VARCHAR(1000) NOT NULL,
  description TEXT,
  website_url VARCHAR(1000) NOT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500),
  subtitle TEXT,
  banner_image_url VARCHAR(1000),
  link_url VARCHAR(1000),
  display_order INT DEFAULT 1,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uniqueness_check VARCHAR(255) NOT NULL,
  form_data JSON NOT NULL,
  notification_email_sent TINYINT(1) DEFAULT 0,
  reply_email_sent TINYINT(1) DEFAULT 0,
  email_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_uniqueness (uniqueness_check)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 3. Seeding Sample Data

After creating the tables, insert sample data:

```sql
-- Insert sample users
INSERT INTO users (uuid, email, name, role, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@serbancario.ao', 'Admin User', 'superadmin', 1);

-- Insert sample news articles
INSERT INTO news (slug, title, subtitle, body_html, categories, tags, publication_date, author, is_featured) VALUES
('nova-regulamentacao-bancaria-angola', 'Nova Regulamentação Bancária em Angola', 'Banco Nacional de Angola anuncia mudanças importantes', '<p>O Banco Nacional de Angola (BNA) anunciou hoje um novo conjunto de regulamentações...</p>', 'Regulamentação', 'banco,regulamentacao,angola', '2025-01-06T08:00:00', 'Redação Ser Bancário', 1);

-- Insert sample blog posts
INSERT INTO blogposts (slug, title, subtitle, body_html, categories, tags, publication_date, author) VALUES
('futuro-banca-digital-angola', 'O Futuro da Banca Digital em Angola', 'Análise das tendências tecnológicas que moldam o setor', '<p>A transformação digital está redefinindo o setor bancário em Angola...</p>', 'Análise', 'banca digital,tecnologia,fintech', '2025-01-06T09:00:00', 'Maria Santos');

-- Insert sample events
INSERT INTO events (slug, title, description_html, event_date, event_time, location, banner_image_url, capacity) VALUES
('i-conferencia-nacional-banca-angolana-desafios', 'I. Conferência Nacional: Banca Angolana & Desafios', '<p>Algo grandioso está prestes a acontecer!</p><p>No dia 2 de Dezembro, Luanda será palco de um dos momentos mais marcantes da história da banca nacional...</p>', '2025-12-02', '08:00:00', 'Hotel Epic Sana, Luanda', 'https://heyboss.heeyo.ai/user-assets/image_9pDfQDJ0.png', 150);

-- Insert sample sponsors
INSERT INTO sponsors (name, logo_url, description, website_url, display_order, is_active) VALUES
('Banco Nacional de Angola', 'https://heyboss.heeyo.ai/logos/google.svg', 'Banco Central de Angola', 'https://www.bna.ao', 1, 1),
('Banco BAI', 'https://heyboss.heeyo.ai/logos/microsoft.svg', 'Banco Angolano de Investimentos', 'https://www.bancobai.ao', 2, 1);

-- Insert sample banners
INSERT INTO banners (title, subtitle, banner_image_url, link_url, display_order, is_active) VALUES
('Reformas e Inovação Impulsionam o Setor Bancário Angolano', 'Novas políticas e tecnologias trazem crescimento recorde', 'https://heyboss.heeyo.ai/user-assets/image_eHKVmA9I.png', '/noticias', 1, 1);
```

## 4. Server IP Monitoring

The application now includes a server IP monitoring feature that:

1. **Displays Current IP**: Shows the outbound IP address used for database connections
2. **Connection Status**: Real-time monitoring of database connectivity
3. **Configuration Helper**: Assists with firewall and access control setup

### Accessing Server IP Information

1. Log in to the admin dashboard at `/admin`
2. The server IP is displayed in the top navigation bar
3. When no table is selected, a detailed server information card shows:
   - Current server IP address
   - Database host and name
   - Connection status
   - Configuration recommendations

## 5. Migration Benefits

- **Improved Performance**: Direct MariaDB connection with connection pooling
- **Enhanced Reliability**: Robust error handling and connection management
- **Better Monitoring**: Real-time connection status and IP tracking
- **Scalability**: Production-ready database with ACID compliance
- **Security**: Secure credential management and encrypted connections

## 6. Troubleshooting

### Connection Issues
- Verify the server IP is whitelisted in your MariaDB firewall
- Check that the MariaDB instance is accessible from your deployment environment
- Ensure credentials are correct and the user has appropriate permissions

### Performance Optimization
- The connection pool is configured with 10 concurrent connections
- Timeout settings are optimized for web application usage
- All queries use prepared statements for security and performance

## 7. Security Considerations

- Database credentials are managed securely through environment variables
- All admin operations require proper authentication and authorization
- SQL injection protection through parameterized queries
- Connection encryption and secure credential handling

