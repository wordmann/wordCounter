
# contaprof

### Homemade word counter by bored studnets for bored students

## install and run

clone the rep
`git clone https://github.com/wordmann/wordCounter.git`

make sure you have 
NodeJS docker and docker-compose installed!

to run first do
`npm update`

then
`npm start`

docker is used to contain a postres db, you're gonna want to modify the docker port if necessary, modify it in `src/db.ts` and `docker-compose.yml`
also you need to setup the db, just execute the two sql CREATE TABLE commands in `sql/init words table.sql`, you can do so by starting the server, connecting to the postgres db using external tools (vscode extensions will do just fine) and running them queries :3 
<sub>also if you know how to do automatically send a pr</sub>