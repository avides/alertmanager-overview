# alertmanager-overview
[![Docker Pulls](https://img.shields.io/docker/pulls/avides/alertmanager-overview.svg)](https://hub.docker.com/r/avides/alertmanager-overview)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=avides_alertmanager-overview&metric=alert_status)](https://sonarcloud.io/dashboard?id=avides_alertmanager-overview)

Alertmanager-Overview is a simple [Alertmanager](https://prometheus.io/docs/alerting/alertmanager/) overview page which lists all active alerts with auto refresh. It will also display different styles for active (with background color red) and silenced (with background color grey) alerts. An Alertmanager that cannot be reached is shown with background color orange.

Each alert shows an icon for its level (label `level`: `fatal`, `error`, `warn`, `info`), hovering the icon shows the annotation `description`. Each alert shows how long it has been firing (tooltip: start time), silenced alerts additionally show the end and the creator of their silence (tooltip: comment). Active alerts link to the form for a new silence in their Alertmanager, silenced alerts link to their silence and all alerts link to their rule in Prometheus (`generatorURL`). The favicon shows the number of alerts per Alertmanager (an orange `?` if it cannot be reached), it turns red on active `error` alerts and blinks red and black on active `fatal` alerts.

The current version of Alertmanager-Overview is designed for two Alertmanagers running: one for production environment and one for test environment. The URLs are set by the environment variables `PRODUCTION_URL` and `TEST_URL`. The URLs may not contain quotes (`"` or `'`). The Alertmanagers must allow cross-origin requests (Alertmanager does this by default).

## Requirements

- Docker
- Alertmanager (0.16 or newer, API v2) for production environment
- Alertmanager (0.16 or newer, API v2) for test environment

## Usage

Set up your variables in the placeholder and run the following command on your docker server:
```
docker run \
-d \
--name=alertmanager-overview \
-e PRODUCTION_URL=http://my-alertmanager-for-production.example.com \
-e TEST_URL=http://my-alertmanager-for-test.example.com \
-p 80:80 \
avides/alertmanager-overview:latest
```

### Build & Test

The application is written in TypeScript with Vue 3 and built with Vite. The Docker build runs the tests and the build, so only Docker is needed:

```
docker build -t alertmanager-overview-dev .

docker run \
-d \
--name=alertmanager-overview \
-e PRODUCTION_URL=http://my-alertmanager-for-production.example.com \
-e TEST_URL=http://my-alertmanager-for-test.example.com \
-p 80:80 \
alertmanager-overview-dev

docker logs -f alertmanager-overview

docker exec -it alertmanager-overview /bin/sh
```

With a local Node.js installation:

```
npm ci
npm test
npm run build
```
