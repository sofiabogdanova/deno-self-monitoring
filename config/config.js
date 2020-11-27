let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database = {
        hostname: "suleiman.db.elephantsql.com",
        database: "gtkemmpz",
        user: "gtkemmpz",
        password: "EOOLlgeXgpwzhJEZKZFltVNmgcNKQ3rG",
        port: 5432
    };
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