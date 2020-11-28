import {superoak, path} from './deps.js'
import {initApp} from '../initApp.js';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

Deno.test('GET to / should return HTTP OK', async () => {
    console.log(__dirname + '\\..\\')

    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/')
        .expect(200);
});

// statisticsController
Deno.test('GET to /behavior/summary should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/behavior/summary')
        .expect(401);
});

// router.post('/behavior/summary', statisticsController.allStatistics);
Deno.test('POST to /behavior/summary should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .post('/behavior/summary')
        .expect(401);
});

// reportingController
Deno.test('GET to /behavior/reporting should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/behavior/reporting')
        .expect(401);
});

Deno.test('GET to /behavior/summary/:form should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/behavior/summary/1')
        .expect(401);
});

Deno.test('POST to /behavior/reporting/morning should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .post('/behavior/reporting/morning', {})
        .expect(401);
});

Deno.test('POST to /behavior/reporting/evening should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .post('/behavior/reporting/evening', {})
        .expect(401);
});

// authController
Deno.test('GET to /behavior/summary should return HTTP OK', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/auth/login')
        .expect(200);
});

Deno.test('POST to /auth/login should return HTTP OK', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .post('/auth/login', {})
        .expect(200);
});

Deno.test('GET to /auth/register should return HTTP OK', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/auth/register')
        .expect(200);
});

Deno.test('POST to /behavior/summary should return HTTP Unauthorized', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .post('/auth/register', {})
        .expect(200);
});

Deno.test('GET to /auth/logout should return HTTP OK', async () => {
    const app = await initApp(__dirname + '\\..\\')

    const request = await superoak(app);
    await request
        .get('/auth/logout')
        .expect(200);
});
