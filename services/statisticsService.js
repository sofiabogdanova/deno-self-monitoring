import {executeQuery} from "../database/database.js";

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
    const morningMood = await executeQuery("SELECT mood FROM morning_info WHERE day=$1",day);

    const eveningMood = await executeQuery("SELECT mood FROM evening_info WHERE day=$1",day);

    const eveningValues = noData(eveningMood) ? [] : eveningMood.rowsOfObjects().map(obj => Number(obj.mood));
    const morningValues = noData(morningMood) ? [] : morningMood.rowsOfObjects().map(obj => Number(obj.mood));
    return average(eveningValues, morningValues);
}

const averageMonthMoodForUser = async() => {

}

const averageMonthMoodForAll = async() => {

}

const getAllStatistic = async (period, userId) => {
    return {
        averageSleepTime: 0,//await averageSleepTime(period, userId),
        averageExerciseTime: 0,//await averageExerciseTime(period, userId),
        averageStudyTime: 0,//await averageStudyTime(period, userId),
        averageSleepQuality: 0,//await averageSleepQuality(period, userId),
        averageMood: 0,// await averageMood(period, userId),
    }
}

const averageSleepTime = async(period, userId) => {
    const sleepDuration = await executeQuery("SELECT sleep_duration FROM morning_info WHERE day between $1 and $2 " +
        "and user_id=$3",
        period.start,
        period.end,
        userId
    );

    const sleepValues = noData(sleepDuration) ? [] : sleepDuration.rowsOfObjects().map(obj => Number(obj.sleep_duration));
    return average(sleepValues, []);
}

const averageExerciseTime = async(period, userId) => {
    const exerciseTime = await executeQuery("SELECT exercise_time FROM evening_info WHERE day between $1 and $2 " +
        "and user_id=$3",
        period.start,
        period.end,
        userId
    );

    const exerciseValues = noData(exerciseTime) ? [] : exerciseTime.rowsOfObjects().map(obj => Number(obj.exercise_time));
    return average(exerciseValues, []);
}

const averageStudyTime = async(period, userId) => {
    const studyingTime = await executeQuery("SELECT studying_time FROM evening_info WHERE day between $1 and $2 " +
        "and user_id=$3",
        period.start,
        period.end,
        userId
    );

    const studyingValues = noData(studyingTime) ? [] : studyingTime.rowsOfObjects().map(obj => Number(obj.studying_time));
    return average(studyingValues, []);
}


const averageSleepQuality = async(period, userId) => {
    const sleepQuality = await executeQuery("SELECT sleep_quality FROM morning_info WHERE day between $1 and $2 " +
        "and user_id=$3",
        period.start,
        period.end,
        userId
    );

    const sleepQualityValues = noData(sleepQuality) ? [] : sleepQuality.rowsOfObjects().map(obj => Number(obj.sleep_quality));
    return average(sleepQualityValues, []);
}

const averageMood = async(period, userId) => {
    const mood = await executeQuery("SELECT mood FROM evening_info WHERE day between $1 and $2 " +
        "and user_id=$3",
        period.start,
        period.end,
        userId
    );

    const moodValues = noData(mood) ? [] : mood.rowsOfObjects().map(obj => Number(obj.mood));
    return average(moodValues, []);
}

const noData = (rows) => {
    return !rows || rows.rowCount < 1
}

const average = (arr1, arr2) => {
    const sum = arr1.reduce((a, b) => a + b, 0) + arr2.reduce((a, b) => a + b, 0);
    const count = arr1.length + arr2.length;
    return count === 0 ? 0 : sum/count;
}

export {averageMoodForUser, averageMoodForAll, averageMonthMoodForUser, averageMonthMoodForAll, getAllStatistic}