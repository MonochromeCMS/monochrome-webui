FROM node:lts-slim as dev
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn

ARG VUE_APP_DOMAIN_NAME=localhost
ARG VUE_APP_PROTOCOL=http
ARG VUE_APP_TITLE=Monochrome
ARG VUE_APP_MEDIA_PATH=$(VUE_APP_PROTOCOL)://$(VUE_APP_DOMAIN_NAME)/media
ARG VUE_APP_API_PATH=$(VUE_APP_PROTOCOL)://$(VUE_APP_DOMAIN_NAME)/api
ARG VUE_APP_DESCRIPTION
ARG VUE_APP_SECRET

COPY . .
CMD ["yarn", "serve"]

FROM dev as build
RUN yarn build

FROM nginx:alpine as nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /srv
COPY --from=build /app/dist .
RUN mkdir /srv/media

FROM caddy:2-alpine as caddy
COPY ./Caddyfile /etc/caddy/Caddyfile
WORKDIR /srv
COPY --from=build /app/dist .
RUN mkdir /srv/media
