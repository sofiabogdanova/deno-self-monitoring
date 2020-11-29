DROP TABLE IF EXISTS morning_info;

CREATE TABLE morning_info
(
    id             SERIAL NOT NULL
        CONSTRAINT morning_info_pkey
            PRIMARY KEY,
    sleep_duration NUMERIC,
    sleep_quality  NUMERIC,
    mood           NUMERIC,
    day            DATE,
    user_id        INTEGER
        CONSTRAINT morning_info_user_id_fkey
            REFERENCES users
);
