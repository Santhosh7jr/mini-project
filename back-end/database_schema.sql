-- Karigo Database Schema Setup
-- Run this script to create all tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'worker', 'admin')),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 500,
  jobs_completed INTEGER DEFAULT 0,
  location VARCHAR(255),
  description TEXT,
  response_time VARCHAR(50) DEFAULT '1 hour',
  is_approved BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(10,2),
  availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  worker_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  booking_date DATE,
  booking_time TIME,
  location VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'rejected', 'cancelled')),
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  worker_id INTEGER NOT NULL,
  booking_id INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  worker_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, worker_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_workers_user_id ON workers(user_id);
CREATE INDEX idx_workers_service_id ON workers(service_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_worker_id ON bookings(worker_id);
CREATE INDEX idx_reviews_worker_id ON reviews(worker_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Insert sample services
INSERT INTO services (name, description, image, icon) VALUES
  ('Plumbing', 'Professional plumbing services for repairs and installations', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952', '🔧'),
  ('Electrical', 'Skilled electricians for wiring, repairs, and maintenance', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789', '⚡'),
  ('Painting', 'Interior and exterior painting services', 'https://images.unsplash.com/photo-1589939705882-b0ee35ad44bd', '🎨'),
  ('Cleaning', 'Professional cleaning services for homes and offices', 'https://images.unsplash.com/photo-1581092945979-fb0a9cdfffe0', '🧹'),
  ('Carpentry', 'Wood working and furniture installation services', 'https://images.unsplash.com/photo-1580274455191-1c62238fa333', '🪵'),
  ('AC Repair', 'Air conditioning maintenance and repair services', 'https://images.unsplash.com/photo-1585602457335-66b9d34f0b0b', '❄️')
ON CONFLICT DO NOTHING;
