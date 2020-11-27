import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "./app.js";

Deno.test("GET to / with Cookie 'message=blabla' should return 'blabla'", async () => {
    const testClient = await superoak(app);
    let response = await testClient.get("/")
        .set('Cookie', 'message=blabla')
        .send()
        .expect('blabla');
});

Deno.test("GET to / without Cookie message should return 'Hello!'", async () => {
    const testClient = await superoak(app);
    let response = await testClient.get("/")
        .send()
        .expect('Hello!');
});