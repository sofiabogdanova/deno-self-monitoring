import * as statisticsService from '../../services/statisticsService.js';
import DateHelper from '../../utils/dateHelper.js'

const data = {
    todayMood: {},
    yesterdayMood: {},
    displayText: {},
    authorized: false,
    email: null
};

const showMainTrends = async ({session, render}) => {
    const dateHelper = new DateHelper();
    const todayMood = await statisticsService.averageMoodForAll(dateHelper.today());
    const yesterdayMood = await statisticsService.averageMoodForAll(dateHelper.yesterday());

    const displayText = (todayMood > yesterdayMood) ?
        'Things are looking bright today! :)' : 'Things are looking gloomy today... :(';
    data.todayMood=todayMood;
    data.yesterdayMood=yesterdayMood;
    data.displayText=displayText;
    render('index.ejs', data);
}

export {showMainTrends}
