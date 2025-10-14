
docker-compose up --build

node server.mjs

docker-compose down
docker-compose up

docker-compose logs

docker-compose run nextjs npm install

++++++++++++++++++++++
docker-compose up --build
docker ps
to access your running Docker container:
docker exec -it <container_id> /bin/sh
docker exec -it 4f2481545064 /bin/sh
then run 
npm i dotenv
++++++++++++++++++
tree -L 3 -I 'node_modules|.next|.git|.vscode|public/assets|coverage|__tests__|dist'+

docker start nextjsproject1-nextjs-1
docker logs -f nextjsproject1-nextjs-1


# Show real-time CPU/memory usage of containers
docker stats

DOCKERFILE=Dockerfile.prod NODE_ENV=production docker compose up --build

npm cache clean --force
docker builder prune -a  

docker-compose down --volumes
docker system prune -af
docker volume prune

docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.prod.yml up --build


sudo chown -R $(whoami) .next

docker exec -it 22c8bc0b6648 /bin/sh
grep -R "FIREBASE_API_KEY" .next/static/chunks/

docker exec -it 8d7cb3f5314e /bin/sh -c 'env | grep NEXT_PUBLIC_FIREBASE_API_KEY'


---------------------------------------
docker image prune -a
docker builder prune --all --force

docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up
