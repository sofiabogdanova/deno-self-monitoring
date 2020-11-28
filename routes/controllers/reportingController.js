import {validasaur} from "../../deps.js";
import * as reportingService from "../../services/reportingService.js";
import DateHelper from "../../utils/dateHelper.js"

const getData = async (session) => {
    const data = {
        today: "",
        email: "",
        userId: "",
        morningReportExists: false,
        eveningReportExists: false,
        errors: []
    };

    if (session) {
        const user = await session.get('user');
        data.email = user.email;
        data.userId = user.id;
        data.today = new DateHelper().today();
    }

    return data;
};

const morningValidationRules = {
    sleepDuration: [validasaur.required, validasaur.isNumeric, validasaur.minNumber(0)],
    sleepQuality: [validasaur.isInt, validasaur.numberBetween(1,5)],
    eatingRegularity: [validasaur.isInt, validasaur.numberBetween(1,5)],
    eatingQuality: [validasaur.isInt, validasaur.numberBetween(1,5)],
    mood: [validasaur.isInt, validasaur.numberBetween(1,5)]
};

const eveningValidationRules = {
    exerciseTime: [validasaur.required, validasaur.isNumeric, validasaur.minNumber(0)],
    studyingTime: [validasaur.required, validasaur.isNumeric, validasaur.minNumber(0)],
    sleepQuality: [validasaur.isInt, validasaur.numberBetween(1,5)],
    mood: [validasaur.isInt, validasaur.numberBetween(1,5)]
};

const showReporting = async ({render, session}) => {
    const data = await getData(session);

    data.eveningReportExists = await checkIfReportExists(data.today, data.userId, 'evening_info');
    data.morningReportExists = await checkIfReportExists(data.today, data.userId, 'morning_info');

    render('report.ejs', data);
};

const showReportingForm = async ({render, params, session}) => {
    const form = params.form;
    const data = await getData(session);

    if (form === 'morning') {
        render('morning.ejs', data);
    } else if (form === 'evening') {
        render('evening.ejs', data);
    } else {
        render('report.ejs', data);
    }
}

const postMorningReporting = async ({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    const data = await getData(session);

    const morningReport = morningReportModel(params, data.userId);

    const [passes, errors] = await validasaur.validate(morningReport, morningValidationRules);
    Object.keys(errors).forEach((attribute) => {
        Object.values(errors[attribute]).forEach((err) => {
            data.errors.push(err)
        })
    });

    if (!passes) {
        render('morning.ejs', data);
        return;
    }

    await reportingService.postMorningReport(morningReport);
    redirectToReporting(response);
};

const postEveningReporting = async ({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    const data = await getData(session);

    const eveningReport = eveningReportModel(params,data. userId);

    const [passes, errors] = await validasaur.validate(eveningReport, eveningValidationRules);
    Object.keys(errors).forEach((attribute) => {
        Object.values(errors[attribute]).forEach((err) => {
            data.errors.push(err)
        })
    });

    if (!passes) {
        render('evening.ejs', data);
        return;
    }

    await reportingService.postEveningReport(eveningReport);
    redirectToReporting(response);
};

const morningReportModel = (params, userId) => {
    return {
        sleepDuration: +(params.get('sleepDuration')),
        sleepQuality: +(params.get('sleepQuality')),
        mood: +params.get('mood'),
        day: params.get('day'),
        userId: userId
    };
}

const eveningReportModel = (params, userId) => {
    return {
        exerciseTime: +params.get('exerciseTime'),
        studyingTime: +params.get('studyingTime'),
        eatingRegularity: +params.get('eatingRegularity'),
        eatingQuality: +params.get('eatingQuality'),
        mood: +params.get('mood'),
        day: params.get('day'),
        userId: userId
    };
}

const redirectToReporting = (response) => {
    response.redirect('/behavior/reporting');
};

const checkIfReportExists = async(day, userId, type) => {

    const report = type === 'morning_info' ?
        await reportingService.getMorningReport(day, userId, type):
        await reportingService.getEveningReport(day, userId, type);

    return report !== null;
}

export {showReporting, showReportingForm, postMorningReporting, postEveningReporting};
