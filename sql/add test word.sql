ALTER TABLE counters ADD CONSTRAINT unique_word_owner UNIQUE (word, owner);


SELECT * FROM words;