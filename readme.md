PROD:
docker-compose down
git pull
[npm i]
docker-compose up -d

DEV:
docker-compose up -f docker-compose-dev.yaml
