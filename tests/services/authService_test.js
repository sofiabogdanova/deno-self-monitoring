import {assert, assertEquals, path} from '../deps.js'
import {createUser, deleteUser, getUser} from '../../services/authService.js'
import {config} from '../../deps.js'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
await config({path: __dirname + '/../../.env.test', export: true});

Deno.test({
    name: 'Create user should create user', async fn() {
        // arrange
        const email = 'test@test.com';
        const password = 'qwertz';

        let user = await getUser(email)

        assertEquals(user, null)

        // act
        await createUser(email, password)

        // assert
        user = await getUser(email)
        assert(user != null, 'No user was found in database!')
        assertEquals(user.email, email, 'Wrong user!')

        // teardown
        await deleteUser(email)
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'Get user should get user', async fn() {
        // arrange
        const email = 'test2@test.com';
        const password = 'qwertz';

        await createUser(email, password)

        // act
        const user = await getUser(email)

        // assert
        assert(user != null, 'No user was found in database!')
        assertEquals(user.email, email, 'Wrong user!')

        // teardown
        await deleteUser(email)
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'Get user should return null when user doesn\'t exist in database', async fn() {
        // arrange
        const email = 'notexistinguser@test.com';

        // act
        const user = await getUser(email)

        // assert
        assert(user === null, 'User has been found when shouldn\'t!')
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: 'Delete user should delete user', async fn() {
        // arrange
        const email = 'test1@test.com';
        const password = 'qwertz';

        let user = await getUser(email)
        assertEquals(user, null)

        await createUser(email, password)

        // act
        const affectedRows = await deleteUser(email)

        // assert
        assert(affectedRows > 0, 'Nothing was deleted!')
        user = await getUser(email)
        assert(user == null, 'No was found in database!')
    },
    sanitizeResources: false,
    sanitizeOps: false
})
