import {executeQuery} from "../database/database.js";

const postMorningReport = async (morningInfo) => {
    const reportAlreadyExists = getReport(morningInfo.day, morningInfo.userId, "morning_info")
    if (reportAlreadyExists) {
        await deleteReport(morningInfo.userId, morningInfo.day, "morning_info")
    }
    await executeQuery("INSERT into morning_info (sleep_duration, sleep_quality, mood, day, user_id) values ($1, $2, $3, $4, $5)",
        morningInfo.sleepDuration,
        morningInfo.sleepQuality,
        morningInfo.mood,
        morningInfo.day,
        morningInfo.userId,
    );
}

const postEveningReport = async (eveningInfo) => {
    const reportAlreadyExists = await getReport(eveningInfo.day, eveningInfo.userId, "evening_info")
    if (reportAlreadyExists) {
        await deleteReport(eveningInfo.userId, eveningInfo.day, "evening_info")
    }
    await executeQuery(
        "INSERT into evening_info (exercise_time, studying_time, eating_regularity, " +
        "eating_quality, mood, day, user_id) values ($1, $2, $3, $4, $5, $6, $7)",
        eveningInfo.exerciseTime,
        eveningInfo.studyingTime,
        eveningInfo.eatingRegularity,
        eveningInfo.eatingQuality,
        eveningInfo.mood,
        eveningInfo.day,
        eveningInfo.userId,
    );
}

const getReport = async (day, userId, tableName) => {
    const res = await executeQuery(`SELECT * FROM ${tableName} where user_id = $1 and day = $2 ORDER BY id DESC LIMIT 1`,
        userId,
        day);
    if (res && res.rowCount > 0) {
        return res.rowsOfObjects()[0];
    }

    return null;
}

const deleteReport = async (userId, day, tableName) => {
    await executeQuery(`DELETE from ${tableName} where user_id = $1 and day = $2`,
        userId,
        day);
}

export {postMorningReport, postEveningReport, getReport};