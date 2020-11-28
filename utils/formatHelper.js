const format = (date) => {
    return date.getFullYear() + "-" +
        ('0' + (date.getMonth() + 1)).slice(-2) + "-" +
        ('0' + date.getDate()).slice(-2);
}

const currentTime = () => {
    const now = new Date();
    const hrs = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();
    return `${hrs}:${minutes}:${seconds}:${ms}`;
}

export {format, currentTime}
