import * as statisticsService from '../../services/statisticsService.js';
import {today, yesterday} from '../../utils/dateHelper.js'

const data = {
    todayMood: {},
    yesterdayMood: {},
    displayText: {},
    authorized: false,
    email: null
};

const showMainTrends = async ({session, render}) => {
    const todayMood = await statisticsService.averageMoodForAll(today());
    const yesterdayMood = await statisticsService.averageMoodForAll(yesterday());

    const displayText = (todayMood > yesterdayMood) ?
        'Things are looking bright today! :)' : 'Things are looking gloomy today... :(';
    data.todayMood=todayMood;
    data.yesterdayMood=yesterdayMood;
    data.displayText=displayText;
    render('index.ejs', data);
}

export {showMainTrends}