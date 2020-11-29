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
