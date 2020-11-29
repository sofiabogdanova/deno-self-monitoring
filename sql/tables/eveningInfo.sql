DROP TABLE IF EXISTS evening_info;

CREATE TABLE evening_info
(
    id                SERIAL NOT NULL
        CONSTRAINT evening_info_pkey
            PRIMARY KEY,
    exercise_time     NUMERIC,
    studying_time     NUMERIC,
    eating_regularity NUMERIC,
    eating_quality    NUMERIC,
    mood              NUMERIC,
    day               DATE,
    user_id           INTEGER
        CONSTRAINT evening_info_user_id_fkey
            REFERENCES users
);
