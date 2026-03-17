FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Install redis + supervisord
RUN apt-get update \
 && apt-get install -y redis-server supervisor \
 && rm -rf /var/lib/apt/lists/*

RUN npm prune --omit=dev

# Now Redis is on localhost, not a separate container
ENV REDIS_HOST=127.0.0.1
ENV REDIS_PORT=6379

ENV NODE_ENV=production

EXPOSE 8000

# Supervisord config to manage both processes
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]