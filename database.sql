CREATE DATABASE IF NOT EXISTS happy_programming
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE happy_programming;

CREATE TABLE IF NOT EXISTS mentors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(255),
    skills VARCHAR(255),
    cv TEXT,
    visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER',
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Passwords are automatically BCrypt-hashed by the backend DataInitializer on startup:
-- admin / admin123 (ROLE_ADMIN)
-- mentor1 / 123456 (ROLE_MENTOR)
-- student1 / 123456 (ROLE_USER)

