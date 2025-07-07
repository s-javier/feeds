FROM alpine:3.22.0 AS build

RUN apk add --update --no-cache nodejs npm

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /root

COPY package*.json tsconfig*.json ./
COPY src ./src

RUN npm install && \
    npm run build && \
    npm prune --production

FROM ubuntu:24.10

WORKDIR /root
COPY --from=build /root/node_modules ./node_modules
COPY --from=build /root/dist ./dist

RUN apt update && \
    apt install -y nodejs && \
    apt clean && rm -rf /var/lib/apt/lists/*

CMD node dist/index.js
