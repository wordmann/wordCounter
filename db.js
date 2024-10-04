"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'user',
    host: 'localhost',
    database: 'wordcounter',
    password: 'password',
    port: 5432,
});
exports.default = pool;
