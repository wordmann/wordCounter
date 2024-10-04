"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const PORT = Number(process.env.PORT) || 3001;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)({ origin: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Custom data types
class addwordReq {
    constructor(req) {
        this.owner = req['owner'];
        this.profname = req['profname'];
        this.word = req['word'];
    }
}
// Quaries
const q_addRow = 'INSERT INTO counters (owner, word) VALUES ($1, $2) ON CONFLICT (word, owner) DO NOTHING;';
const q_incrementAmount = 'INSERT INTO words (idcounter, profname) VALUES ((SELECT id FROM counters WHERE word = $1 AND owner = $2 ), $3) RETURNING idcounter;';
const q_counter = 'SELECT * FROM COUNTERS WHERE owner = $1;';
// Function to add or increment word count
async function incrementOrAdd(req) {
    try {
        // Insert or ignore (if word already exists in counters table)
        await db_1.default.query(q_addRow, [req.owner, req.word]);
        // Insert profname and link to idcounter in words table
        const counter_id = await db_1.default.query(q_incrementAmount, [req.word, req.owner, req.profname]);
        return JSON.stringify(counter_id.rows[0]);
    }
    catch (error) {
        console.error('Error executing queries:', error);
        return "error";
    }
}
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
app.post("/api/addword", async (req, res) => {
    console.log(req.body);
    const respo = await incrementOrAdd(new addwordReq(req.body));
    res.send(respo);
});
app.get("/api/user/:uid", async (req, res) => {
    const params = req.params;
    const counters = await db_1.default.query(q_counter, [params.uid]);
    if (counters.rowCount == 0)
        res.status(404);
    res.send(JSON.stringify(counters.rows));
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
