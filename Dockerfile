FROM caddy:alpine

COPY caddy/Caddyfile /etc/caddy/Caddyfile
COPY public /public

CMD caddy start