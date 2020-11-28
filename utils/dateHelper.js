const format = (date) => {
    return date.toISOString().slice(0, 10);
}

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
        // const day = currentDate.getDate() - 1;
        // const month = currentDate.getMonth() + 1;
        // const year = currentDate.getFullYear();
        // return `${year}-${month}-${day}`;
    }

    previousWeek() {
        const currentDate = this.currentDate();
        currentDate.setTime(currentDate.getTime() - (currentDate.getDay() ? currentDate.getDay() : 7) * 24 * 60 * 60 * 1000);
        const end = format(currentDate);
        // let day = currentDate.getDate();
        // let month = currentDate.getMonth() + 1;
        // let year = currentDate.getFullYear();
        // const start = `${year}-${month}-${day}`;
        currentDate.setTime(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000);
        const start = format(currentDate);
        // day = currentDate.getDate();
        // month = currentDate.getMonth() + 1;
        // year = currentDate.getFullYear();
        // const end = `${year}-${month}-${day}`;
        return {
            start: start,
            end: end
        }
    }

    previousMonth() {
        const currentDate = this.currentDate();
        currentDate.setDate(0); // 0 will result in the last day of the previous month
        const end = format(currentDate);
        // let day = currentDate.getDate();
        // let month = currentDate.getMonth() + 1;
        // let year = currentDate.getFullYear();
        // const end = `${year}-${month}-${day}`;

        currentDate.setDate(1); // 1 will result in the first day of the month
        const start = format(currentDate);
        // day = currentDate.getDate();
        // month = currentDate.getMonth() + 1;
        // year = currentDate.getFullYear();
        // const start = `${year}-${month}-${day}`;

        return {
            start: start,
            end: end
        }
    }
}
