#!/bin/sh
# Writes the Alertmanager URLs for the page, runs on container start before nginx
set -eu
envsubst '${PRODUCTION_URL} ${TEST_URL}' < /etc/alertmanager-overview/config.json.template > /usr/share/nginx/html/config.json
