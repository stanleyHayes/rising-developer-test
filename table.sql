CREATE DATABASE profile_db;
USE profile_db;

CREATE TABLE users (
id VARCHAR(255) PRIMARY KEY,
name VARCHAR(255),
phone_number VARCHAR(13) NOT NULL,
email VARCHAR(255),
diagnostic_level TINYINT NOT NULL CHECK(diagnostic_level >= 0 AND diagnostic_level <= 10),
diagnostic_level TINYINT NOT NULL CHECK(diagnostic_level >= 0 AND diagnostic_level <= 10),
first_message_timestamp TIMESTAMP NOT NULL,
last_message_timestamp TIMESTAMP NOT NULL
);

CREATE TABLE message_ids(
id VARCHAR(255) PRIMARY KEY,
user VARCHAR(255),
FOREIGN KEY (user) REFERENCES users(id)
)