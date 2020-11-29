import {Pool} from "../deps.js";

const POOL_CONNECTIONS = 20;
let dbPool;

const getClient = async () => {
    if (!dbPool) {
        dbPool = new Pool({}, POOL_CONNECTIONS, true);
    }

    return await dbPool.connect()
}

const executeQuery = async (query, ...args) => {
    let client;
    try {
        client = await getClient();
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
        await client.release();
    }
}

export {executeQuery};
