import {executeQuery} from "../database/database.js";

const createUser = async (email, hash) => {
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
    const createdUser = await getUser(email);
    return createdUser.id;
}

const getUser = async (email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    if (res.rowCount === 0) {
        return null;
    }

    return res.rowsOfObjects()[0];
}

export {createUser, getUser}