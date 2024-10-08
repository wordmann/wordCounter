"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const PORT = Number(process.env.PORT) || 19607;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.static('client'));
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
const q_addRow = 'INSERT INTO counters (owner, word) VALUES ($1, $2) ON CONFLICT (owner, word) DO NOTHING;';
const q_incrementAmount = 'INSERT INTO words (counter_id, profname) VALUES ((SELECT id FROM counters WHERE word = $1 AND owner = $2 ), $3) RETURNING counter_id;';
const q_counter = 'SELECT * FROM COUNTERS WHERE owner = $1;';
const q_words = 'SELECT * FROM words WHERE counter_id = $1;';
// Function to add or increment word count
async function incrementOrAdd(req) {
    try {
        console.log('Running q_addRow:', q_addRow, req.owner, req.word);
        await db_1.default.query(q_addRow, [req.owner, req.word]);
        console.log('Running q_incrementAmount:', q_incrementAmount, req.word, req.owner, req.profname);
        const result = await db_1.default.query(q_incrementAmount, [req.word, req.owner, req.profname]);
        return [200, 'yay'];
    }
    catch (error) {
        console.error('Error executing queries:', error);
        return [503, 'ouch'];
    }
}
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
app.post("/api/addword", async (req, res) => {
    console.log(req.body);
    const respo = await incrementOrAdd(new addwordReq(req.body));
    res.status(respo[0]).send(respo[1]);
});
app.get("/api/counters/:uid", async (req, res) => {
    const params = req.params;
    try {
        const counters = await db_1.default.query(q_counter, [params.uid]);
        res.send(JSON.stringify(counters.rows));
    }
    catch (error) {
        console.log(error);
        res.status(404).send('No data yet!');
    }
});
app.get("/api/words/:cid", async (req, res) => {
    const params = req.params;
    try {
        const words = await db_1.default.query(q_words, [params.cid]);
        res.send(JSON.stringify(words.rows));
    }
    catch (error) {
        console.log(error);
        res.status(404).send('No data yet!');
    }
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
