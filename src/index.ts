import bodyParser from 'body-parser';
import express, { Request, response, Response } from 'express';
import pool from './db';
import cors from 'cors'
import internal from 'stream';

const PORT: number = Number(process.env.PORT) || 19607;

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors({origin : true}));

app.use(express.static('client'))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Custom data types
class addwordReq {
  owner: string
  profname: string
  word: string

  constructor(req: any) {

    this.owner = req['owner']
    this.profname = req['profname']
    this.word = req['word']

  }
}

// Quaries
const q_addRow = 'INSERT INTO counters (owner, word) VALUES ($1, $2) ON CONFLICT (owner, word) DO NOTHING;';
const q_incrementAmount = 'INSERT INTO words (counter_id, profname) VALUES ((SELECT id FROM counters WHERE word = $1 AND owner = $2 ), $3) RETURNING counter_id;';
const q_counter = 'SELECT * FROM COUNTERS WHERE owner = $1;'
const q_words = 'SELECT * FROM words WHERE counter_id = $1;'

// Function to add or increment word count
async function incrementOrAdd(req: addwordReq): Promise<[number, string]> {
  try {

    console.log('Running q_addRow:', q_addRow, req.owner, req.word);
    await pool.query(q_addRow, [req.owner, req.word]);

    console.log('Running q_incrementAmount:', q_incrementAmount, req.word, req.owner, req.profname);
    const result = await pool.query(q_incrementAmount, [req.word, req.owner, req.profname]);


    return [200, 'yay'];
  } catch (error) {
    console.error('Error executing queries:', error);
    return [503, 'ouch'];
  }
}

app.get("/api", (req: Request, res: Response): void => {
    res.json({ message: "Hello from server!" });

});

app.post("/api/addword", async (req: Request, res: Response): Promise<void> => {

  console.log(req.body)

  const respo = await incrementOrAdd(
    new addwordReq(req.body)
  )

  res.status(respo[0]).send(respo[1])

})

app.get("/api/counters/:uid", async (req, res) => {
	const params = req.params;


  try {
    const counters = await pool.query(q_counter, [params.uid])
    res.send(JSON.stringify(counters.rows));
  } catch (error) {
    console.log(error)
    res.status(404).send('No data yet!')
  }

});

app.get("/api/words/:cid", async (req, res) => {
	const params = req.params;


  try {
    const words = await pool.query(q_words, [params.cid])
    res.send(JSON.stringify(words.rows));
  } catch (error) {
    console.log(error)
    res.status(404).send('No data yet!')
  }

});


app.listen(PORT, (): void => {
  console.log(`Server listening on ${PORT}`);
});
