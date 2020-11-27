import { Application } from "./deps.js";
import { Session } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

//session middleware
app.use(async({request, response, session}, next) => {
    if (request.url.pathname.startsWith('/behavior')) {
        if (session && await session.get('authenticated')) {
            await next();
        } else {
            response.status = 401;
        }
    } else {
        await next();
    }
});

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);

app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port: 7777 });
}

export default app;