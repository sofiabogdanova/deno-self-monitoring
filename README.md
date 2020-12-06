## Deno Self Monitoring App

### Table of Contents
* [Description](#description)
* [Demo](#demo)
* [Database initialization](#database-initialization)
* [Run the app](#run-the-app)
  * [OR using Docker Compose:](#or-using-docker-compose)
* [Test](#tests)

### Description
This is a web application for self-monitoring purposes.
The application provides users an opportunity to report behavior daily.

#### Reported content
The behavior reported to the application are as follows:

- Sleep duration and sleep quality
- Time spent on sports and exercise
- Time spent studying
- Regularity and quality of eating
- Generic mood

#### Summarization
The application provides functionality for summarization of responses. Each user can view statistics of their reports on a weekly and monthly level. These statistics are as follows.

- Average sleep duration
- Average time spent on sports and exercise
- Average time spent studying
- Average sleep quality
- Average generic mood

### Demo
The application is deployed to Heroku and can be accessed by the following link:  
https://deno-self-monitoring.herokuapp.com/

### Run the app
If you want to run the app simply run in terminal:

```shell
deno run --allow-all --unstable app.js
```

After initialization process is over the app will be listening on `7777` port.  
So you could access it on [localhost:7777](http://localhost:7777)

**!!! IMPORTANT !!!**  
In order to work this app requires you to set up the following ENV variables:
- DENO_ENV - set it to anything else from `TEST`
- PGHOST - address where your PostgreSql server is accessible
- PGDATABASE - name of the database on your PostgreSql server 
- PGUSER - username to access your PostgreSql server
- PGPASSWORD - password to access your PostgreSql server
- PGPORT - port on which your PostgreSql server is listening 

You could set them all up in `.env` file.

#### Or using docker compose

As an alternative you could use docker-compose to wire up the application with PostgreSql database in the container.
Just simply run the following command in terminal from the app's root:
```shell
docker-compose up
```

**!!! IMPORTANT !!!**  
In order to work you need to set up the following ENV variables:
- DENO_ENV - set it to anything else from `TEST`
- PGHOST - address where your PostgreSql server is accessible
- PGDATABASE - name of the database on your PostgreSql server
- PGUSER - username to access your PostgreSql server
- PGPASSWORD - password to access your PostgreSql server
- PGPORT - port on which your PostgreSql server is listening
- POSTGRES_USER - username to access your PostgreSql server
- POSTGRES_PASSWORD - password to access your PostgreSql server
- FLYWAY_USER - username to access your PostgreSql server
- FLYWAY_PASSWORD - password to access your PostgreSql server
- FLYWAY_URL - connection string to PostgreSql server (for ex. `jdbc:postgresql://postgres-database:5432/postgres`)

You could set them all up in `.env` file.

### Database initialization
All below listed scripts you could find in `/sql` folder

This app requires PostgreSql database  
In order to work this app requires you to run following sql scripts:

#### Create `users` table
```postgresql
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

```

#### Create `morning_info` table
```postgresql
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

```

#### Create `evening_info` table
```postgresql
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

```

#### Create `get_average_mood_for_all` function
```postgresql
DROP FUNCTION IF EXISTS get_average_mood_for_all;

CREATE OR REPLACE FUNCTION get_average_mood_for_all(_date DATE)
    RETURNS TABLE
            (
                avg_mood NUMERIC
            )
AS
$func$
BEGIN
    RETURN QUERY
        WITH avgMood AS (
            SELECT avg(M.mood) AS avg_mood
            FROM (SELECT mi.mood
                  FROM morning_info mi
                  WHERE mi.day = _date

                  UNION

                  SELECT ei.mood
                  FROM evening_info ei
                  WHERE ei.day = _date) M
        )
        SELECT *
        FROM avgMood;
END
$func$ LANGUAGE plpgsql;


```

#### Create `get_average_mood_for_user` function
```postgresql
DROP FUNCTION IF EXISTS get_average_mood_for_user;

CREATE OR REPLACE FUNCTION get_average_mood_for_user(_user_id INT, _date DATE)
    RETURNS TABLE
            (
                avg_mood NUMERIC
            )
AS
$func$
BEGIN
    RETURN QUERY
        WITH avgMood AS (
            SELECT avg(M.mood) AS avg_mood
            FROM (SELECT mi.mood, mi.user_id
                  FROM morning_info mi
                  WHERE mi.user_id = _user_id
                    AND mi.day = _date

                  UNION

                  SELECT ei.mood, ei.user_id
                  FROM evening_info ei
                  WHERE ei.user_id = _user_id
                    AND ei.day = _date) M
            GROUP BY user_id
        )
        SELECT *
        FROM avgMood;
END
$func$ LANGUAGE plpgsql;

```

#### Create `get_averages_for_date_range` function
```postgresql
DROP FUNCTION IF EXISTS get_averages_for_date_range;

CREATE OR REPLACE FUNCTION get_averages_for_date_range(_from_date DATE, _to_date DATE)
    RETURNS TABLE
            (
                avg_mood              NUMERIC,
                avg_eating_quality    NUMERIC,
                avg_eating_regularity NUMERIC,
                avg_exercise_time     NUMERIC,
                avg_studying_time     NUMERIC,
                avg_sleep_quality     NUMERIC,
                avg_sleep_duration    NUMERIC
            )
AS
$func$
BEGIN
    RETURN QUERY
        WITH avgMood AS (
            SELECT avg(M.mood) AS avg_mood
            FROM (SELECT mi.mood
                  FROM morning_info mi
                  WHERE mi.day BETWEEN _from_date AND _to_date

                  UNION

                  SELECT ei.mood
                  FROM evening_info ei
                  WHERE ei.day BETWEEN _from_date AND _to_date) M
        ),
             avgEI AS (
                 SELECT avg(ei.eating_quality)    AS avg_eating_quality,
                        avg(ei.eating_regularity) AS avg_eating_regularity,
                        avg(ei.exercise_time)     AS avg_exercise_time,
                        avg(ei.studying_time)     AS avg_studying_time
                 FROM evening_info ei
                 WHERE ei.day BETWEEN _from_date AND _to_date
             ),
             avgMI AS (
                 SELECT avg(mi.sleep_quality)  AS avg_sleep_quality,
                        avg(mi.sleep_duration) AS avg_sleep_duration
                 FROM morning_info mi
                 WHERE mi.day BETWEEN _from_date AND _to_date
             )
        SELECT m.avg_mood,
               ei.avg_eating_quality,
               ei.avg_eating_regularity,
               ei.avg_exercise_time,
               ei.avg_studying_time,
               mi.avg_sleep_quality,
               mi.avg_sleep_duration
        FROM avgMood m,
             avgEI ei,
             avgMI mi;
END
$func$ LANGUAGE plpgsql;

```

#### Create `get_averages_for_user` function
```postgresql
DROP FUNCTION IF EXISTS get_averages_for_user;

CREATE OR REPLACE FUNCTION get_averages_for_user(_user_id INT, _from_date DATE, _to_date DATE)
    RETURNS TABLE
            (
                avg_mood              NUMERIC,
                avg_eating_quality    NUMERIC,
                avg_eating_regularity NUMERIC,
                avg_exercise_time     NUMERIC,
                avg_studying_time     NUMERIC,
                avg_sleep_quality     NUMERIC,
                avg_sleep_duration    NUMERIC
            )
AS
$func$
BEGIN
    RETURN QUERY
        WITH avgMood AS (
            SELECT avg(M.mood) AS avg_mood, M.user_id
            FROM (SELECT mi.mood, mi.user_id
                  FROM morning_info mi
                  WHERE mi.user_id = _user_id
                    AND mi.day BETWEEN _from_date AND _to_date

                  UNION

                  SELECT ei.mood, ei.user_id
                  FROM evening_info ei
                  WHERE ei.user_id = _user_id
                    AND ei.day BETWEEN _from_date AND _to_date) M
            GROUP BY M.user_id
        ),
             avgEI AS (
                 SELECT avg(ei.eating_quality)    AS avg_eating_quality,
                        avg(ei.eating_regularity) AS avg_eating_regularity,
                        avg(ei.exercise_time)     AS avg_exercise_time,
                        avg(ei.studying_time)     AS avg_studying_time,
                        ei.user_id
                 FROM evening_info ei
                 WHERE ei.user_id = _user_id
                   AND ei.day BETWEEN _from_date AND _to_date
                 GROUP BY ei.user_id
             ),
             avgMI AS (
                 SELECT avg(mi.sleep_quality)  AS avg_sleep_quality,
                        avg(mi.sleep_duration) AS avg_sleep_duration,
                        mi.user_id
                 FROM morning_info mi
                 WHERE mi.user_id = _user_id
                   AND mi.day BETWEEN _from_date AND _to_date
                 GROUP BY mi.user_id
             )

        SELECT m.avg_mood,
               ei.avg_eating_quality,
               ei.avg_eating_regularity,
               ei.avg_exercise_time,
               ei.avg_studying_time,
               mi.avg_sleep_quality,
               mi.avg_sleep_duration
        FROM avgMood m
                 FULL JOIN avgEI ei
                           ON m.user_id = ei.user_id
                 FULL JOIN avgMI mi
                           ON m.user_id = mi.user_id;
END
$func$ LANGUAGE plpgsql;

```

### Tests
If you want to run tests simply run in terminal:

```shell
deno test --allow-all --unstable
```

**!!! IMPORTANT !!!**  
In order to work you need to set up the following ENV variables:
- DENO_ENV=TEST - **Please pay attention that this variable should be TEST. Otherwise, the app will hang**
- PGHOST - address where your PostgreSql server is accessible
- PGDATABASE - name of the database on your PostgreSql server
- PGUSER - username to access your PostgreSql server
- PGPASSWORD - password to access your PostgreSql server
- PGPORT - port on which your PostgreSql server is listening

You could set them all up in `.env.test` file.
