import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import pool from './db';
import cors from 'cors'

const PORT: number = Number(process.env.PORT) || 3001;

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors({origin : true}));

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
const q_addRow = 'INSERT INTO counters (owner, word) VALUES ($1, $2) ON CONFLICT (word, owner) DO NOTHING;';
const q_incrementAmount = 'INSERT INTO words (idcounter, profname) VALUES ((SELECT id FROM counters WHERE word = $1 AND owner = $2 ), $3) RETURNING idcounter;';
const q_counter = 'SELECT * FROM COUNTERS WHERE owner = $1;'

// Function to add or increment word count
async function incrementOrAdd(req: addwordReq): Promise<string> {
  try {
    // Insert or ignore (if word already exists in counters table)
    await pool.query(q_addRow, [req.owner, req.word]);

    // Insert profname and link to idcounter in words table
    const counter_id = await pool.query(q_incrementAmount, [req.word, req.owner, req.profname]);

    return JSON.stringify(counter_id.rows[0]);
  } catch (error) {
    console.error('Error executing queries:', error);
    return "error";
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

  res.send(respo)

})

app.get("/api/user/:uid", async (req, res) => {
	const params = req.params;

  const counters = await pool.query(q_counter, [params.uid])
	
  if (counters.rowCount == 0)
    res.status(404)

  res.send(JSON.stringify(counters.rows));
});



app.listen(PORT, (): void => {
  console.log(`Server listening on ${PORT}`);
});
