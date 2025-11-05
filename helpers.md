docker-compose start
docker compose up --build --force-recreate
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

# Show real-time CPU/memory usage of containers
docker stats

sudo chown -R $(whoami) .next
---------------------------------------
npm cache clean --force

docker-compose down --volumes
docker-compose down --volumes --remove-orphans

docker system prune -af
docker system prune -af --volumes
docker builder prune -af
docker image prune -af
docker volume prune -f
docker network prune -f


docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up

docker compose -f docker-compose.prod.yml up -d

-------------------------------------------------
temp docker:
docker run --rm -it -v $(pwd):/app -w /app node:20 npm install
docker run --rm -it -v "$PWD":/app -w /app node:18 bash -c "npm install"
docker run --rm -it -v "$PWD":/app -w /app node:18 bash
