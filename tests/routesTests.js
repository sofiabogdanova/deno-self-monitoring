import {superoak} from './deps.js'
import {initApp} from '../initApp.js';

Deno.test('GET to / should return HTTP OK', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/')
        .expect(200);
});

// statisticsController
Deno.test('GET to /behavior/summary should return HTTP Unauthorized', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/behavior/summary')
        .expect(401);
});

// router.post('/behavior/summary', statisticsController.allStatistics);

// reportingController
Deno.test('GET to /behavior/reporting should return HTTP Unauthorized', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/behavior/reporting')
        .expect(401);
});

Deno.test('GET to /behavior/summary/:form should return HTTP Unauthorized', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/behavior/summary/1')
        .expect(401);
});

// router.post('/behavior/reporting/morning', reportingController.postMorningReporting);
// router.post('/behavior/reporting/evening', reportingController.postEveningReporting);

// authController
Deno.test('GET to /behavior/summary should return HTTP OK', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/auth/login')
        .expect(200);
});
// router.post('/auth/login', authController.authenticate)

Deno.test('GET to /auth/register should return HTTP OK', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/auth/register')
        .expect(200);
});
// router.post('/auth/register', authController.register)

Deno.test('GET to /auth/logout should return HTTP OK', async () => {
    const app = await initApp('../')

    const request = await superoak(app);
    await request
        .get('/auth/logout')
        .expect(200);
});
