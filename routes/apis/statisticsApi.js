import * as statisticsService from "../../services/statisticsService.js";

const lastWeekStatistics = async () => {
    const statistics = await statisticsService.lastWeekStatistics();
    return statistics;
}

const dailyStatistics = async ({params}) => {
    const day = params.day;
    const month = params.month;
    const year = params.year;

    const statistics = await statisticsService.dailyStatistics(day, month, year);
    return statistics;
}

export { lastWeekStatistics, dailyStatistics };