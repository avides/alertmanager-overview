FROM nginx:1.15-alpine

EXPOSE 80

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY src/*.html /usr/share/nginx/html/
COPY src/*.css /usr/share/nginx/html/
COPY src/*.js /usr/share/nginx/html/

COPY docker/entrypoint.sh /
RUN chmod +x entrypoint.sh
CMD ["/entrypoint.sh"]
