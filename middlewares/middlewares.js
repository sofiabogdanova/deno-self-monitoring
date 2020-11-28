import {currentTime} from '../utils/formatHelper.js'

const errorMiddleware = async (context, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
}

const requestTimingMiddleware = async ({request, session}, next) => {
    const time = currentTime();
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    let userInfo = 'not authenticated';
    const user = await session.get('user');
    if (user) {
        userInfo = `by user_id = ${user.id}`;
    }

    console.log(`Time ${time}: ${request.method} ${request.url.pathname} - ${ms} ms (${userInfo})`);
}

// const serveStaticFilesMiddleware = async(context, next) => {
//     if (context.request.url.pathname.startsWith('/static')) {
//         const path = context.request.url.pathname.substring(7);
//
//         await send(context, path, {
//             root: `${Deno.cwd()}/static`
//         });
//
//     } else {
//         await next();
//     }
// }

const accessMiddleware = async ({request, response, session}, next) => {
    if (request.url.pathname.startsWith('/behavior')) {
        if (session && await session.get('authenticated')) {
            await next();
        } else {
            response.status = 302;
            response.redirect('/auth/login');
        }
    } else {
        await next();
    }
}

export {errorMiddleware, requestTimingMiddleware, accessMiddleware /*, serveStaticFilesMiddleware*/};