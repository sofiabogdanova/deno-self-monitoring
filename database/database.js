import {Pool} from "../deps.js";
import {config} from "../config/config.js";

const POOL_CONNECTIONS = 20;
const dbPool = new Pool(config.database, POOL_CONNECTIONS, true);

const executeQuery = async (query, ...args) => {
    let client;
    try {
        client = await dbPool.connect();
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
        await client.release();
    }
}

export {executeQuery};
