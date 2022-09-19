FROM node:lts-slim as dev
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN --mount=type=cache,target=/cache/yarn \
  yarn --cache-folder /cache/yarn --frozen-lockfile

ARG DOMAIN_NAME=localhost
ARG PROTOCOL=http
ARG BASE_URL=/

ARG TITLE=Monochrome
ARG DESCRIPTION

ARG VITE_MEDIA_PATH=/media
ARG VITE_API_PATH=/api

ENV VITE_MEDIA_PATH=$VITE_MEDIA_PATH
ENV VITE_API_PATH=$VITE_API_PATH

COPY . .
CMD ["yarn", "dev", "--port=80", "--host=0.0.0.0"]

FROM dev as build
RUN yarn build

FROM flashspys/nginx-static as nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /srv
COPY --from=build /app/dist .
RUN mkdir /srv/media

FROM caddy:2-alpine as caddy
COPY ./Caddyfile /etc/caddy/Caddyfile
WORKDIR /srv
COPY --from=build /app/dist .
RUN mkdir /srv/media
