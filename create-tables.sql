-- Generated SQL Tables from JSON Schemas
-- Generated on: 2025-10-02T22:06:11.264Z
-- Database: PostgreSQL

-- Table: banners
-- Source: banners-schema.json
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  banner_image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INTEGER DEFAULT '1',
  is_active INTEGER DEFAULT '1',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_banners_created_at ON banners(created_at);


-- Table: blogposts
-- Source: blogposts-schema.json
CREATE TABLE IF NOT EXISTS blogposts (
  id SERIAL PRIMARY KEY,
  slug TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  body_html TEXT,
  categories TEXT,
  tags TEXT,
  publication_date TIMESTAMP NOT NULL,
  author TEXT NOT NULL,
  social_links TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blogposts_created_at ON blogposts(created_at);


-- Table: contact_submissions
-- Source: contact_submissions-schema.json
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  uniqueness_check TEXT NOT NULL,
  form_data TEXT NOT NULL,
  notification_email_sent INTEGER DEFAULT '0',
  reply_email_sent INTEGER DEFAULT '0',
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);


-- Table: eventbookings
-- Source: eventbookings-schema.json
CREATE TABLE IF NOT EXISTS eventbookings (
  id SERIAL PRIMARY KEY,
  event_id INTEGER,
  uniqueness_check TEXT NOT NULL,
  form_data TEXT NOT NULL,
  notification_email_sent INTEGER DEFAULT '0',
  reply_email_sent INTEGER DEFAULT '0',
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eventbookings_created_at ON eventbookings(created_at);


-- Table: events
-- Source: events-schema.json
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  slug TEXT,
  title TEXT NOT NULL,
  description_html TEXT,
  event_date TIMESTAMP NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  banner_image_url TEXT,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);


-- Table: news
-- Source: news-schema.json
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  slug TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  body_html TEXT,
  categories TEXT,
  tags TEXT,
  publication_date TIMESTAMP NOT NULL,
  author TEXT NOT NULL,
  is_featured INTEGER DEFAULT '0',
  social_links TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);


-- Table: sponsors
-- Source: sponsors-schema.json
CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT,
  website_url TEXT NOT NULL,
  display_order INTEGER DEFAULT '0',
  is_active INTEGER DEFAULT '1',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON sponsors(created_at);


-- Table: users
-- Source: users-schema.json
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uuid TEXT,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL,
  password_hash TEXT,
  is_active INTEGER DEFAULT '1',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);


