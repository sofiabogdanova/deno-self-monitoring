import {executeQuery} from "../database/database.js";
import {format} from "../utils/formatHelper.js";

const averageMoodForUser = async (day, userId) => {
    const morningMood = await executeQuery("SELECT mood FROM morning_info WHERE day=$1 and user_id=$2",
        day,
        userId
    );

    const eveningMood = await executeQuery("SELECT mood FROM evening_info WHERE day=$1 and user_id=$2",
        day,
        userId
    );

    const eveningValues = noData(eveningMood) ? [] : eveningMood.rowsOfObjects().map(obj => Number(obj.mood));
    const morningValues = noData(morningMood) ? [] : morningMood.rowsOfObjects().map(obj => Number(obj.mood));
    return average(eveningValues, morningValues);
}

const averageMoodForAll = async (day) => {
    const morningMood = await executeQuery("SELECT mood FROM morning_info WHERE day=$1", day);

    const eveningMood = await executeQuery("SELECT mood FROM evening_info WHERE day=$1", day);

    const eveningValues = noData(eveningMood) ? [] : eveningMood.rowsOfObjects().map(obj => Number(obj.mood));
    const morningValues = noData(morningMood) ? [] : morningMood.rowsOfObjects().map(obj => Number(obj.mood));
    return average(eveningValues, morningValues);
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

    if (res && res.rowCount > 0) {
        const t = res.rowsOfObjects()[0];

        averageSleepTime = t.avg_sleep_duration;
        averageExerciseTime = t.avg_excercise_time;
        averageStudyTime = t.avg_studying_time;
        averageSleepQuality = t.avg_sleep_quality;
        averageMood = t.avg_mood;
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

const average = (arr1, arr2) => {
    const sum = arr1.reduce((a, b) => a + b, 0) + arr2.reduce((a, b) => a + b, 0);
    const count = arr1.length + arr2.length;
    return count === 0 ? 0 : sum / count;
}

export {
    averageMoodForUser,
    averageMoodForAll,
    averageMonthMoodForUser,
    averageMonthMoodForAll,
    getAllStatistic,
    lastWeekStatistics,
    dailyStatistics
}
