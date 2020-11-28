import {superoak} from './deps.js'
import {initApp} from '../initApp.js';

Deno.test('GET to / should HTTP OK', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/')
        .expect(200);
});


/*import { Application, Router } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";

const router = new Router();
router.get("/", (ctx) => {
    ctx.response.body = "Hello Deno!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

Deno.test("it should support the Oak framework", async () => {
    const request = await superoak(app);
    await request.get("/").expect("Hello Deno!");
});*/
