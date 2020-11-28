const format = (date) => {
    return date.toISOString().slice(0, 10);
}

export {format}