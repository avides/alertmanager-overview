FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm test && npm run build


FROM nginx:1.30-alpine

EXPOSE 80

# The nginx image renders the template with the environment variables PRODUCTION_URL and TEST_URL on start
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html
