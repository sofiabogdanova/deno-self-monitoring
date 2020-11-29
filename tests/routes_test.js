import {path, superoak} from './deps.js'
import {config} from '../deps.js'
import {initApp} from '../initApp.js';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

let app;

async function getApp() {
    if (!app) {
        await config({path: __dirname + '/../.env.test', export: true});
        app = await initApp(__dirname + '/../');
    }

    return app;
}

Deno.test('GET to / should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/')
        .expect(200);
});

// statisticsController
Deno.test('GET to /behavior/summary should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/behavior/summary')
        .expect(200);
});

// router.post('/behavior/summary', statisticsController.allStatistics);
Deno.test('POST to /behavior/summary should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .post('/behavior/summary')
        .expect(200);
});

// reportingController
Deno.test('GET to /behavior/reporting should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/behavior/reporting')
        .expect(200);
});

Deno.test('GET to /behavior/summary/:form should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/behavior/summary/1')
        .expect(200);
});

Deno.test('POST to /behavior/reporting/morning should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .post('/behavior/reporting/morning', {})
        .expect(200);
});

Deno.test('POST to /behavior/reporting/evening should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .post('/behavior/reporting/evening', {})
        .expect(200);
});

// authController
Deno.test('GET to /behavior/summary should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/auth/login')
        .expect(200);
});

Deno.test('POST to /auth/login should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .post('/auth/login', {})
        .expect(200);
});

Deno.test('GET to /auth/register should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/auth/register')
        .expect(200);
});

Deno.test('POST to /behavior/summary should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .post('/auth/register', {})
        .expect(200);
});

Deno.test('GET to /auth/logout should be accessible', async () => {
    const app = await getApp()

    const request = await superoak(app);
    await request
        .get('/auth/logout')
        .expect(200);
});
