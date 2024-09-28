
docker-compose up --build

node server.mjs

docker-compose down

docker-compose logs

docker-compose run nextjs npm install

++++++++++++++++++++++
docker-compose up --build
to access your running Docker container:
docker exec -it <container_id> /bin/sh
docker exec -it b57fdf119a1a /bin/sh
then run 
npm i dotenv
++++++++++++++++++