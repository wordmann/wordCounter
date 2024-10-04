DROP TABLE words;
DROP TABLE counters;

CREATE TABLE counters (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    owner TEXT NOT NULL
);

CREATE TABLE words (
    FOREIGN KEY (counter_id) REFERENCES counters(id)
    profname TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);



