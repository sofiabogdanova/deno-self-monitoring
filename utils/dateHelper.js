const today = () => {
    const currentDate = new Date();
    return format(currentDate);
    // const day = currentDate.getDate();
    // const month = currentDate.getMonth() + 1;
    // const year = currentDate.getFullYear();
    // return `${year}-${month}-${day}`;
}

const yesterday = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return format(currentDate);
    // const day = currentDate.getDate() - 1;
    // const month = currentDate.getMonth() + 1;
    // const year = currentDate.getFullYear();
    // return `${year}-${month}-${day}`;
}

const previousWeek = () => {
    const currentDate = new Date();
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

const previousMonth = () => {
    const currentDate = new Date();
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

const format = (date) => {
    return date.toISOString().slice(0, 10);
}

export {today, yesterday, previousWeek, previousMonth}