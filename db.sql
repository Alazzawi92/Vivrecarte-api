-- Schema MySQL pour vivreCard
-- Compatible avec backendY/backendY2

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS vivrecard_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vivrecard_db;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  verification_token VARCHAR(191) NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  latitude DECIMAL(10,8) NULL,
  longitude DECIMAL(11,8) NULL,
  last_seen DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_verification_token (verification_token),
  KEY idx_users_last_seen (last_seen),
  KEY idx_users_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optionnel: verifier la structure
-- DESCRIBE users;