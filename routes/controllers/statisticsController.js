import * as statisticsService from '../../services/statisticsService.js';
import DateHelper from '../../utils/dateHelper.js'

const getData = async (session) => {
    const data = {
        email: "",
        userId: ""
    };

    if (session) {
        const user = await session.get('user');
        data.email = user.email;
        data.userId = user.id;
    }

    return data;
};


const allStatisticsDefault = async ({session, render}) => {
    const dateHelper = new DateHelper();
    const userData = await getData(session);
    const monthPeriod = dateHelper.previousMonth();
    const weekPeriod = dateHelper.previousWeek();

    const data = await statistics(weekPeriod, monthPeriod, userData.userId);
    data.email = userData.email;
    render('summary.ejs', data);
}

const allStatistics = async ({session, render, request}) => {
    const userData = await getData(session);

    const body = request.body();
    const params = await body.value;

    const weekPeriod = getWeekPeriod(params);
    const monthPeriod = getMonthPeriod(params);

    const data = await statistics(weekPeriod, monthPeriod, userData.userId);
    data.email = userData.email;

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
    const dateHelper = new DateHelper();
    const defaultPeriod = dateHelper.previousWeek();
    if (!params) {
        return defaultPeriod;
    }

    const weekDatePicker = params.get('week'); //2020-w48
    if (!weekDatePicker) {
        return defaultPeriod;
    }

    const week = Number(weekDatePicker.substring(6));

    return dateHelper.weekByWeekNumber(week);
}

const getMonthPeriod = (params) => {
    const dateHelper = new DateHelper();
    const defaultPeriod = dateHelper.previousMonth();
    if (!params) {
        return defaultPeriod;
    }

    const monthDatePicker = params.get('month');//2020-11
    if (!monthDatePicker) {
        return defaultPeriod;
    }

    const year = Number(monthDatePicker.substring(0,4));
    const month = Number(monthDatePicker.substring(5));

    return dateHelper.monthByMonthNumber(month, year);
}

export {allStatisticsDefault, allStatistics}
