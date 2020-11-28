import {Router} from "../deps.js";
import * as reportingController from "./controllers/reportingController.js";
import * as authController from "./controllers/authController.js";
import * as trendController from "./controllers/trendController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as timeHelper from "../utils/dateHelper.js"

const router = new Router();

// router.get('/', hello);
//
// router.get('/api/hello', helloApi.getHello);
// router.post('/api/hello', helloApi.setHello);

const test = async ({request}) => {
    const body = request.body();
    const params = await body.value;

    const weekDatePicker = params.get('week'); //2020-w48
    const monthDatePicker = params.get('month');//2020-11

    const year = Number(monthDatePicker.substring(0,3));
    const month = Number(monthDatePicker.substring(5));
    const week = Number(weekDatePicker.substring(6));

    const weekPeriod = timeHelper.weekByWeekNumber(week);
    const monthPeriod = timeHelper.monthByMonthNumber(month, year);
}


// function getDateOfWeek(w, y) {
//     var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
//
//     return new Date(y, 0, d);
// }


router.get('/', trendController.showMainTrends);

router.get('/behavior/summary', statisticsController.allStatisticsDefault);
router.post('/behavior/summary', statisticsController.allStatistics);

router.get('/behavior/reporting', reportingController.showReporting);

router.get('/behavior/reporting/:form', reportingController.showReportingForm);

router.post('/behavior/reporting/morning', reportingController.postMorningReporting);
router.post('/behavior/reporting/evening', reportingController.postEveningReporting);

router.get('/auth/login', authController.showLoginForm)
router.post('/auth/login', authController.authenticate)

router.get('/auth/register', authController.showRegisterForm)
router.post('/auth/register', authController.register)

router.get('/auth/logout', authController.logout)

router.post('/auth/register/test', test)
export {router};
