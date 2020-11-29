import {config} from './deps.js'
import {initApp} from "./initApp.js";

console.log(await config({export: true}));
await initApp('./');
