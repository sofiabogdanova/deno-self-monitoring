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
    const statistics = await getAllStatistic(period);
    return statistics;
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
    return {
        averageSleepTime: await averageSleepTime(period, userId),
        averageExerciseTime: await averageExerciseTime(period, userId),
        averageStudyTime: await averageStudyTime(period, userId),
        averageSleepQuality: await averageSleepQuality(period, userId),
        averageMood: await averageMood(period, userId),
    }
}

const averageSleepTime = async (period, userId) => {
    const duration = await sleepDuration(period, userId);
    const sleepValues = noData(duration) ? [] : duration.rowsOfObjects().map(obj => Number(obj.sleep_duration));
    return average(sleepValues, []);
}

const averageExerciseTime = async (period, userId) => {
    const duration = await exerciseTime(period, userId);
    const exerciseValues = noData(duration) ? [] : duration.rowsOfObjects().map(obj => Number(obj.exercise_time));
    return average(exerciseValues, []);
}

const averageStudyTime = async (period, userId) => {
    const duration = await studyTime(period, userId);
    const studyingValues = noData(duration) ? [] : duration.rowsOfObjects().map(obj => Number(obj.studying_time));
    return average(studyingValues, []);
}

const averageSleepQuality = async (period, userId) => {
    const duration = await sleepQuality(period, userId);
    const sleepQualityValues = noData(duration) ? [] : duration.rowsOfObjects().map(obj => Number(obj.sleep_quality));
    return average(sleepQualityValues, []);
}

const averageMood = async (period, userId) => {
    const mood = await moodQuality(period, userId);
    const moodValues = noData(mood) ? [] : mood.rowsOfObjects().map(obj => Number(obj.mood));
    return average(moodValues, []);
}

const noData = (rows) => {
    return !rows || rows.rowCount < 1
}

const average = (arr1, arr2) => {
    const sum = arr1.reduce((a, b) => a + b, 0) + arr2.reduce((a, b) => a + b, 0);
    const count = arr1.length + arr2.length;
    return count === 0 ? 0 : sum / count;
}

const sleepDuration = async (period, userId) => {
    if (userId) {
        return await executeQuery("SELECT sleep_duration FROM morning_info WHERE day between $1 and $2 " +
            "and user_id=$3",
            period.start,
            period.end,
            userId
        );
    }

    return await executeQuery("SELECT sleep_duration FROM morning_info WHERE day between $1 and $2",
        period.start,
        period.end
    );
}

const exerciseTime = async (period, userId) => {
    if (userId) {
        return await executeQuery("SELECT exercise_time FROM evening_info WHERE day between $1 and $2 " +
            "and user_id=$3",
            period.start,
            period.end,
            userId
        );
    }

    return await executeQuery("SELECT exercise_time FROM evening_info WHERE day between $1 and $2",
        period.start,
        period.end
    );
}

const studyTime = async (period, userId) => {
    if (userId) {
        return await executeQuery("SELECT studying_time FROM evening_info WHERE day between $1 and $2 " +
            "and user_id=$3",
            period.start,
            period.end,
            userId
        );
    }

    return await executeQuery("SELECT studying_time FROM evening_info WHERE day between $1 and $2",
        period.start,
        period.end
    );
}

const sleepQuality = async (period, userId) => {
    if (userId) {
        return await executeQuery("SELECT sleep_quality FROM morning_info WHERE day between $1 and $2 " +
            "and user_id=$3",
            period.start,
            period.end,
            userId
        );
    }

    return await executeQuery("SELECT sleep_quality FROM morning_info WHERE day between $1 and $2",
        period.start,
        period.end
    );
}

const moodQuality = async (period, userId) => {
    if (userId) {
        return await executeQuery("SELECT mood FROM evening_info WHERE day between $1 and $2 " +
            "and user_id=$3",
            period.start,
            period.end,
            userId
        );
    }

    return await executeQuery("SELECT mood FROM evening_info WHERE day between $1 and $2",
        period.start,
        period.end
    );
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