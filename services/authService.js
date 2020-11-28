import {executeQuery} from "../database/database.js";
import {bcrypt} from "../deps.js";

const createUser = async (email, password) => {
    const hash = await bcrypt.hash(password);
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

const deleteUser = async (email) => {
    const res = await executeQuery('DELETE FROM users WHERE email = $1;', email)
    return res.rowCount;
}

export {createUser, getUser, deleteUser}
