DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id       SERIAL       NOT NULL
        CONSTRAINT users_pkey
            PRIMARY KEY,
    email    VARCHAR(320) NOT NULL,
    password CHAR(60)     NOT NULL
);

CREATE UNIQUE INDEX users_lower_idx
    ON users (LOWER(email::TEXT));
