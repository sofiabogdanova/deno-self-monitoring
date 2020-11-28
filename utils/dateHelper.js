import {format} from './formatHelper.js'

export default class DateHelper {
    currentDate() {
        return new Date();
    }

    today() {
        return format(this.currentDate());
    }

    yesterday() {
        const currentDate = this.currentDate();
        currentDate.setDate(currentDate.getDate() - 1);
        return format(currentDate);
    }

    week() {
        const januaryFirst = new Date(this.currentDate().getFullYear(), 0, 1);
        return Math.ceil((((this.currentDate() - januaryFirst) / 86400000) + januaryFirst.getDay() + 1) / 7)-1;
    }

    previousWeek() {
        const currentDate = this.currentDate();
        currentDate.setTime(currentDate.getTime() - (currentDate.getDay() ? currentDate.getDay() : 7) * 24 * 60 * 60 * 1000);
        const end = format(currentDate);
        currentDate.setTime(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000);
        const start = format(currentDate);
        return {
            start: start,
            end: end
        }
    }

    weekByWeekNumber(weekNumber) {
        const currentDate = this.currentDate();
        let numOfDaysPastSinceLastMonday = eval(currentDate.getDay() - 1);
        currentDate.setDate(currentDate.getDate() - numOfDaysPastSinceLastMonday);
        let weekNoToday = this.week();
        let weeksInTheFuture = eval(weekNumber - weekNoToday);
        currentDate.setDate(currentDate.getDate() + eval(7 * weeksInTheFuture));
        const start = format(currentDate);
        currentDate.setDate(currentDate.getDate() + 6);
        const end = format(currentDate);
        return {start, end}
    }

    previousMonth() {
        const currentDate = this.currentDate();
        currentDate.setDate(0); // 0 will result in the last day of the previous month
        const end = format(currentDate);

        currentDate.setDate(1); // 1 will result in the first day of the month
        const start = format(currentDate);

        return {
            start: start,
            end: end
        }
    }

    monthByMonthNumber(month, year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        return {start, end};
    }
}

