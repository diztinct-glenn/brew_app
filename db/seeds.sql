DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS beers;

CREATE TABLE users (
  id              SERIAL       PRIMARY KEY,
  email           VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);

CREATE TABLE beers(
  id              SERIAL       PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  brewery         VARCHAR(255) NOT NULL,
  img_url         VARCHAR(255) NOT NULL,
  description     TEXT         NOT NULL,
  abv             VARCHAR(50)     NOT NULL,
  liked           VARCHAR(5)   NOT NULL
  -- user_id         INTEGER      REFERENCES users(id)
);

