import * as statisticsService from "../../services/statisticsService.js";

const lastWeekStatistics = async ({response}) => {
    // JSON document with averages for sleep duration, time spent on sports and exercise, time spent studying,
    //     sleep quality, and generic mood for previous 7 days
    const statistics = await statisticsService.lastWeekStatistics();
    response.body = statistics;
    response.status = 200;
}

const dailyStatistics = async ({params, response}) => {
    const day = params.day;
    const month = params.month;
    const year = params.year;

    // JSON document with averages for sleep duration, time spent on sports and exercise, time spent studying,
    //     sleep quality, and generic mood for the given day
    const statistics = await statisticsService.dailyStatistics(day, month, year);
    response.body = statistics;
    response.status = 200;
}

export { lastWeekStatistics, dailyStatistics };