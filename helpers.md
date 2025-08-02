
docker-compose up --build

node server.mjs

docker-compose down

docker-compose logs

docker-compose run nextjs npm install

++++++++++++++++++++++
docker-compose up --build
docker ps
to access your running Docker container:
docker exec -it <container_id> /bin/sh
docker exec -it 0da5c45b2586 /bin/sh
then run 
npm i dotenv
++++++++++++++++++
tree -L 3 -I 'node_modules|.next|.git|.vscode|public/assets|coverage|__tests__|dist'+

docker start nextjsproject1-nextjs-1
docker logs -f nextjsproject1-nextjs-1
