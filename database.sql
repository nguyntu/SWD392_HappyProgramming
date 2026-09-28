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
