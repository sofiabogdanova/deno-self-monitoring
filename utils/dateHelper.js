const today = () => {
    const currentDate = new Date();
    return format(currentDate);
}

const yesterday = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return format(currentDate);
}

const previousWeek = () => {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() - (currentDate.getDay() ? currentDate.getDay() : 7) * 24 * 60 * 60 * 1000);
    const end = format(currentDate);
    currentDate.setTime(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000);
    const start = format(currentDate);
    return {
        start: start,
        end: end
    }
}

const previousMonth = () => {
    const currentDate = new Date();
    currentDate.setDate(0); // 0 will result in the last day of the previous month
    const end = format(currentDate);

    currentDate.setDate(1); // 1 will result in the first day of the month
    const start = format(currentDate);

    return {
        start: start,
        end: end
    }
}

const monthByMonthNumber = (month, year) => {
    const start = new Date(year, month-1, 1);
    const end = new Date(2008, month, 0);
    return {start, end};
}

const weekByWeekNumber = (weekNumber) => {
    let currentDate = new Date();
    let numOfDaysPastSinceLastMonday = eval(currentDate.getDay()- 1);
    currentDate.setDate(currentDate.getDate() - numOfDaysPastSinceLastMonday);
    let weekNoToday = currentDate.getWeek();
    let weeksInTheFuture = eval( weekNumber - weekNoToday );
    currentDate.setDate(currentDate.getDate() + eval( 7 * weeksInTheFuture ));
    const start = format(currentDate);
    currentDate.setDate(currentDate.getDate() + 6);
    const end = format(currentDate);
    return {start, end}
}

const format = (date) => {
    return date.toISOString().slice(0, 10);
}

Date.prototype.getWeek = function() {
    const januaryFirst = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - januaryFirst) / 86400000) + januaryFirst.getDay()+1)/7);
}

export {today, yesterday, previousWeek, previousMonth, weekByWeekNumber, monthByMonthNumber}