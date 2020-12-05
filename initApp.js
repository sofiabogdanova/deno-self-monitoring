import {adapterFactory, Application, engineFactory, Session, viewEngine} from "./deps.js";
import {router} from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';

const initApp = async (baseDir) => {
    const app = new Application();

    const session = new Session({framework: "oak"});
    await session.init();
    app.use(session.use()(session));

    const ejsEngine = engineFactory.getEjsEngine();
    const oakAdapter = adapterFactory.getOakAdapter();
    app.use(viewEngine(oakAdapter, ejsEngine, {
        viewRoot: baseDir + "views"
    }));

//session middleware
    app.use(middleware.accessMiddleware);

    app.use(middleware.errorMiddleware);
    app.use(middleware.requestTimingMiddleware);
    app.use(middleware.serveStaticFilesMiddleware);

    app.use(router.routes());
// app.use(router.allowedMethods());

    if (Deno.env.get('DENO_ENV') !== 'TEST') {
        let port = 7777;
        if (Deno.args.length > 0) {
            const lastArgument = Deno.args[Deno.args.length - 1];
            port = Number(lastArgument);
        }

        await app.listen({port: port});
    }

    return app;
}

export {initApp};
