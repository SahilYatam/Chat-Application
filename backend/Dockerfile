FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN apt-get update \
 && apt-get install -y redis-server \
 && rm -rf /var/lib/apt/lists/*

RUN npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 8000

CMD redis-server --daemonize yes && npm start