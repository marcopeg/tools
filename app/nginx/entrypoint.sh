#!/bin/sh

# Replace environment variables in nginx.conf
#envsubst '$NGINX_GRAPHQL_ENDPOINT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp \
#  && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Replace environment variables in nginx.conf
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Execute the CMD passed to the entrypoint
exec "$@"
