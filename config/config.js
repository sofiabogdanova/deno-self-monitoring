let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database = {};
} else {
    config.database = {
        hostname: "suleiman.db.elephantsql.com",
        database: "bysnwcfb",
        user: "bysnwcfb",
        password: "883ohGW1AxK6g-EIwBZLbgbjPmBaekIa",
        port: 5432
    };
}

export { config }; 