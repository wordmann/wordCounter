
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