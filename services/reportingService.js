import {executeQuery} from '../database/database.js';
import {format} from "../utils/formatHelper.js";

const getMorningReport = async (day, userId) => {
    const report = await getReport(day, userId, 'morning_info');

    if (!report) {
        return null;
    }

    return {
        sleepDuration: report.sleep_duration,
        sleepQuality: report.sleep_quality,
        mood: report.mood,
        day: format(report.day),
        userId: report.user_id
    }
}

const postMorningReport = async (morningInfo) => {
    const reportAlreadyExists = getMorningReport(morningInfo.day, morningInfo.userId)

    if (reportAlreadyExists) {
        await deleteMorningReport(morningInfo.day, morningInfo.userId)
    }

    await executeQuery(`
INSERT INTO morning_info (sleep_duration, sleep_quality, mood, day, user_id) 
VALUES ($1, $2, $3, $4, $5)`,
        morningInfo.sleepDuration,
        morningInfo.sleepQuality,
        morningInfo.mood,
        morningInfo.day,
        morningInfo.userId,
    );
}

const deleteMorningReport = (day, userId) => deleteReport(day, userId, 'morning_info');

const getEveningReport = async (day, userId) => {
    const report = await getReport(day, userId, 'evening_info');

    if (!report) {
        return null;
    }

    return {
        studyingTime: report.studying_time,
        eatingRegularity: report.eating_regularity,
        eatingQuality: report.eating_quality,
        mood: report.mood,
        day: format(report.day),
        userId: report.user_id
    }
}

const postEveningReport = async (eveningInfo) => {
    const reportAlreadyExists = await getEveningReport(eveningInfo.day, eveningInfo.userId)

    if (reportAlreadyExists) {
        await deleteEveningReport(eveningInfo.day, eveningInfo.userId)
    }

    await executeQuery(`
INSERT INTO evening_info (exercise_time, studying_time, eating_regularity, eating_quality, mood, day, user_id) 
VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        eveningInfo.exerciseTime,
        eveningInfo.studyingTime,
        eveningInfo.eatingRegularity,
        eveningInfo.eatingQuality,
        eveningInfo.mood,
        eveningInfo.day,
        eveningInfo.userId,
    );
}

const deleteEveningReport = (day, userId) => deleteReport(day, userId, 'evening_info');

// ====================================================================================================================
// PRIVATE
// ====================================================================================================================
const getReport = async (day, userId, tableName) => {
    const res = await executeQuery(`SELECT * FROM ${tableName} WHERE user_id = $1 AND day = $2 ORDER BY id DESC LIMIT 1`,
        userId, day);
    if (res && res.rowCount > 0) {
        return res.rowsOfObjects()[0];
    }

    return null;
}

const deleteReport = async (day, userId, tableName) => {
    await executeQuery(`DELETE FROM ${tableName} WHERE user_id = $1 AND day = $2`,
        userId,
        day);
}

export {
    getMorningReport,
    postMorningReport,
    deleteMorningReport,
    getEveningReport,
    postEveningReport,
    deleteEveningReport
};
