#!/bin/sh
sed -i "s;{{PRODUCTION_URL}};$PRODUCTION_URL;g" /usr/share/nginx/html/index.html
sed -i "s;{{PRODUCTION_URL}};$PRODUCTION_URL;g" /usr/share/nginx/html/favicon.js
sed -i "s;{{TEST_URL}};$TEST_URL;g" /usr/share/nginx/html/index.html
sed -i "s;{{TEST_URL}};$TEST_URL;g" /usr/share/nginx/html/favicon.js

echo "Starting Nginx"
nginx -g 'daemon off;'
