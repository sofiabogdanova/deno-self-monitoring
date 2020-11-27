import * as statisticsService from '../../services/statisticsService.js';
import {previousMonth, previousWeek} from '../../utils/dateHelper.js'

const allStatisticsDefault = async ({session, render}) => {
    const userId = 1; //get from session
    const monthPeriod = previousMonth();
    const weekPeriod = previousWeek();

    // const weeklyStatistics = await statisticsService.getAllStatistic(weekPeriod, userId);
    // const monthlyStatistics = await statisticsService.getAllStatistic(monthPeriod, userId);
    //
    // const data = {
    //     weeklyStatistics: weeklyStatistics,
    //     monthlyStatistics: monthlyStatistics,
    //     weekStart: weekPeriod.start,
    //     weekEnd: weekPeriod.end,
    //     monthStart: monthPeriod.start,
    //     monthEnd: monthPeriod.end,
    // };
    const data = await statistics(weekPeriod, monthPeriod, userId);
    data.email = 'blabla';
    data.authorised = true;
    render('summary.ejs', data);
}

const allStatistics = async ({session, render, request}) => {
    const userId = 1; //get from session
    const body = request.body();
    const params = await body.value;
    const weekPeriod = getWeekPeriod(params);
    const monthPeriod = getMonthPeriod(params);
    const data = await statistics(weekPeriod, monthPeriod, userId);

    render('summary.ejs', data);
}

const statistics = async(weekPeriod, monthPeriod, userId) => {
    const weeklyStatistics = await statisticsService.getAllStatistic(weekPeriod, userId);
    const monthlyStatistics = await statisticsService.getAllStatistic(monthPeriod, userId);

    const data = {
        weeklyStatistics: weeklyStatistics,
        monthlyStatistics: monthlyStatistics,
        weekStart: weekPeriod.start,
        weekEnd: weekPeriod.end,
        monthStart: monthPeriod.start,
        monthEnd: monthPeriod.end,
    };
    return data;
}

const getWeekPeriod = (params) => {
    const defaultPeriod = previousWeek();
    if (!params) {
        return defaultPeriod;
    }
    const start = params.get('weekStart') ? params.get('weekStart') : defaultPeriod.start;
    const end = params.get('weekEnd')? params.get('weekEnd') : defaultPeriod.end;
    return { start, end }
}

const getMonthPeriod = (params) => {
    const defaultPeriod = previousMonth();
    if (!params) {
        return defaultPeriod;
    }
    const start = params.get('monthStart') ? params.get('monthStart') : defaultPeriod.start;
    const end = params.get('monthEnd') ? params.get('monthEnd') : defaultPeriod.end;
    return { start, end }
}

export {allStatisticsDefault, allStatistics}