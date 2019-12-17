# alertmanager-overview
[![Docker Pulls](https://img.shields.io/docker/pulls/avides/alertmanager-overview.svg)](https://hub.docker.com/r/avides/alertmanager-overview)

Alertmanager-Overview is a simple [Alertmanager](https://prometheus.io/docs/alerting/alertmanager/) overview page which lists all active alerts with auto refresh. It will also display different styles for active (with background color red) and silenced (with background color grey) alerts.

The current version of Alertmanager-Overview is designed for two Alertmanagers running: one for production environment and one for test environment. The URLs are set by the environment variables `PRODUCTION_URL` and `TEST_URL`. Allowed URLs may not contain the symbol `;`.

## Requirements

- Docker
- Alertmanager for production environment
- Alertmanager for test environment

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

The following commands are useful if you want to run the code locally.

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
