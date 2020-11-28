CREATE PROCEDURE get_averages(userId INT, fromDate DATE, toDate DATE)
    LANGUAGE sql
AS
$$
WITH avgMood AS (
    SELECT avg(M.mood) AS avgMood, M.user_id
    FROM (SELECT mi.mood, mi.user_id
          FROM morning_info mi
          WHERE mi.user_id = userId
            AND mi.day BETWEEN fromDate AND toDate

          UNION

          SELECT ei.mood, ei.user_id
          FROM evening_info ei
          WHERE ei.user_id = userId
            AND ei.day BETWEEN fromDate AND toDate) M
    GROUP BY M.user_id
),
     avgEI AS (
         SELECT avg(ei.eating_quality)    AS avg_eating_quality,
                avg(ei.eating_regularity) AS avg_eating_regularity,
                avg(ei.exercise_time)     AS avg_exercise_time,
                avg(ei.studying_time)     AS avg_styding_time,
                ei.user_id
         FROM evening_info ei
         WHERE ei.user_id = userId
           AND ei.day BETWEEN fromDate AND toDate
         GROUP BY ei.user_id
     ),
     avgMI AS (
         SELECT avg(mi.sleep_quality)  AS avg_sleep_quality,
                avg(mi.sleep_duration) AS avg_sleep_duration,
                mi.user_id
         FROM morning_info mi
         WHERE mi.user_id = userId
           AND mi.day BETWEEN fromDate AND toDate
         GROUP BY mi.user_id)

SELECT *
FROM avgMood m
         FULL JOIN avgEI ei
                   ON m.user_id = ei.user_id
         FULL JOIN avgMI mi
                   ON m.user_id = mi.user_id;
$$;
