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
