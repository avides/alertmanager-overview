FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm test && npm run build


FROM nginx:1.30-alpine

EXPOSE 80

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Writes config.json with the environment variables PRODUCTION_URL and TEST_URL on start
COPY docker/config.json.template /etc/alertmanager-overview/config.json.template
COPY --chmod=755 docker/40-config-json.sh /docker-entrypoint.d/40-config-json.sh

COPY --from=build /app/dist /usr/share/nginx/html
