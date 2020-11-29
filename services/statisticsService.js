import {executeQuery} from "../database/database.js";
import {format} from "../utils/formatHelper.js";

const averageMoodForUser = async (day, userId) => {
    const res = await executeQuery('SELECT * FROM get_average_mood_for_user($1, $2)', userId, day);

    return noData(res) ? 0 : parseValue(res.rowsOfObjects()[0].avg_mood);
}

const averageMoodForAll = async (day) => {
    const res = await executeQuery('SELECT * FROM get_average_mood_for_all($1)', day);

    return noData(res) ? 0 : parseValue(res.rowsOfObjects()[0].avg_mood);
}

const averageMonthMoodForUser = async () => {

}

const averageMonthMoodForAll = async () => {

}

const dailyStatistics = async (day, month, year) => {
    const date = format(new Date(year, month, day));
    const period = {
        start: date,
        end: date
    }
    return await getAllStatistic(period);
}

const lastWeekStatistics = async () => {
    const statistics = [];

    let i;
    const today = new Date();
    for (i = 1; i <= 7; i++) {
        const date = format(new Date(today.getFullYear(), today.getMonth(), today.getDate()-i));
        const period = {
            start: date,
            end: date
        };
        const data = await getAllStatistic(period);
        data.date = date;
        statistics.push(data);
    }

    return statistics;
}

const getAllStatistic = async (period, userId) => {
    let res;

    if (userId) {
        res = await executeQuery(`SELECT * FROM get_averages_for_user($1, $2, $3)`,
            userId,
            period.start,
            period.end
        );
    } else {
        res = await executeQuery(`SELECT * FROM get_averages_for_date_rage($1, $2)`,
            period.start,
            period.end
        );
    }

    let averageSleepTime = 0;
    let averageExerciseTime = 0;
    let averageStudyTime = 0;
    let averageSleepQuality = 0;
    let averageMood = 0;

    if (!noData(res)) {
        const t = res.rowsOfObjects()[0];

        averageSleepTime = parseValue(t.avg_sleep_duration);
        averageExerciseTime = parseValue(t.avg_excercise_time);
        averageStudyTime = parseValue(t.avg_studying_time);
        averageSleepQuality = parseValue(t.avg_sleep_quality);
        averageMood = parseValue(t.avg_mood);
    }

    return {
        averageSleepTime: averageSleepTime,
        averageExerciseTime: averageExerciseTime,
        averageStudyTime: averageStudyTime,
        averageSleepQuality: averageSleepQuality,
        averageMood: averageMood
    }
}

const noData = (rows) => {
    return !rows || rows.rowCount < 1
}

const parseValue = (value) => value ? +value : 0;

export {
    averageMoodForUser,
    averageMoodForAll,
    averageMonthMoodForUser,
    averageMonthMoodForAll,
    getAllStatistic,
    lastWeekStatistics,
    dailyStatistics
}
