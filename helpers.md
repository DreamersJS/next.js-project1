
docker-compose up --build

node server.mjs

docker-compose down

docker-compose logs

docker-compose run nextjs npm install

++++++++++++++++++++++
docker-compose up --build
to access your running Docker container:
docker exec -it <container_id> /bin/sh
docker exec -it ae3fd548d6c7 /bin/sh
then run 
npm i dotenv
++++++++++++++++++
docker ps
tree -L 3 -I 'node_modules|.next|.git|.vscode|public/assets|coverage|__tests__|dist'