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
