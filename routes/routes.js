import { Router } from "../deps.js";
import * as reportingController from "./controllers/reportingController.js";
import * as authController from "./controllers/authController.js";
import * as trendController from "./controllers/trendController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as helloApi from "./apis/helloApi.js";

const router = new Router();

// router.get('/', hello);
//
// router.get('/api/hello', helloApi.getHello);
// router.post('/api/hello', helloApi.setHello);

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

export { router };