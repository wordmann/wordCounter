DROP TABLE words;
DROP TABLE counters;

CREATE TABLE counters (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    owner TEXT NOT NULL,
    UNIQUE (owner, word)
);

CREATE TABLE words (
    counter_id INTEGER NOT NULL,               -- Foreign key must have a type
    profname TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (counter_id) REFERENCES counters(id) -- Foreign key declaration
);
