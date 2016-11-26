DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS liked;
DROP TABLE IF EXISTS disliked;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);

CREATE TABLE liked(
  id SERIAL PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  brewery VARCHAR (255) NOT NULL,
  img_url VARCHAR (255) NOT NULL,
  description TEXT NOT NULL,
  num_drinks INTEGER NOT NULL
);

CREATE TABLE disliked(
  id SERIAL PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  brewery VARCHAR (255) NOT NULL,
  img_url VARCHAR (255) NOT NULL,
  description TEXT NOT NULL
);

-- COPY liked
--   (species, family, habitat, diet, planet)
-- FROM '/Users/gbasgaard/code/wdi/WDI-xfiles-mulder/u2/d09/api_lab/creatures.csv'
--     DELIMITER ',' CSV;
