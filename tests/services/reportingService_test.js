import {assert, assertEquals, path} from '../deps.js'
import {
    deleteEveningReport,
    deleteMorningReport,
    getEveningReport,
    getMorningReport,
    postEveningReport,
    postMorningReport
} from '../../services/reportingService.js'
import {createUser, deleteUser} from "../../services/authService.js";
import {config} from '../../deps.js'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
await config({path: __dirname + '/../../.env.test', export: true});

Deno.test({
    name: 'getMorningReport should return null when no data has been found', async fn() {
        // assert
        const report = await getMorningReport('2020-01-15', -1)

        // assert
        assertEquals(report, null)
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'postMorningInfo should persist morning report correctly', async fn() {
        // arrange
        const email = 'testMorningReport1@test.com';
        const userId = await createUser(email, '12345')
        const day = '2020-01-15';

        try {
            const morningInfo = {
                sleepDuration: '8',
                sleepQuality: '100',
                mood: '5',
                day: day,
                userId: userId
            }

            // act
            await postMorningReport(morningInfo)
            const actual = await getMorningReport(day, userId)

            // assert
            assertEquals(actual, morningInfo)
        } finally {
            // teardown
            await deleteMorningReport(day, userId)
            await deleteUser(email)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'deleteMorningInfo should delete morning report correctly', async fn() {
        // arrange
        const email = 'testMorningReport2@test.com';
        const userId = await createUser(email, '12345')
        const day = '2020-01-15';

        try {
            const morningInfo = {
                sleepDuration: '8',
                sleepQuality: '100',
                mood: '5',
                day: day,
                userId: userId
            }

            await postMorningReport(morningInfo)
            let report = await getMorningReport(day, userId)

            assert(report != null, 'Can not find any report to delete!')

            // act
            await deleteMorningReport(day, userId)
            report = await getMorningReport(day, userId)

            // assert
            assertEquals(report, null, 'Report was not deleted!')
        } finally {
            // teardown
            await deleteUser(email)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'getEveningReport should return null when no data has been found', async fn() {
        // assert
        const report = await getEveningReport('2020-01-15', -1)

        // assert
        assertEquals(report, null)
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'postEveningInfo should persist morning report correctly', async fn() {
        // arrange
        const email = 'testMorningReport3@test.com';
        const userId = await createUser(email, '12345')
        const day = '2020-01-15';

        try {
            const eveningInfo = {
                studyingTime: '8',
                eatingRegularity: '5',
                eatingQuality: '5',
                mood: '5',
                day: day,
                userId: userId
            }

            // act
            await postEveningReport(eveningInfo)
            const actual = await getEveningReport(day, userId)

            // assert
            assertEquals(actual, eveningInfo)
        } finally {
            // teardown
            await deleteEveningReport(day, userId)
            await deleteUser(email)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'deleteEveningInfo should delete morning report correctly', async fn() {
        // arrange
        const email = 'testMorningReport4@test.com';
        const userId = await createUser(email, '12345')
        const day = '2020-01-15';

        try {
            const eveningInfo = {
                studyingTime: '8',
                eatingRegularity: '5',
                eatingQuality: '5',
                mood: '5',
                day: day,
                userId: userId
            }

            await postEveningReport(eveningInfo)
            let report = await getEveningReport(day, userId)

            assert(report != null, 'Can not find any report to delete!')

            // act
            await deleteEveningReport(day, userId)
            report = await getEveningReport(day, userId)

            // assert
            assertEquals(report, null, 'Report was not deleted!')
        } finally {
            // teardown
            await deleteUser(email)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})
