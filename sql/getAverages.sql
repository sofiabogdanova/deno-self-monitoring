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
                 GROUP BY mi.user_id)


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
