FROM node:14-alpine

RUN apk update\
    && apk add --no-cache\
    postgresql

WORKDIR /src

COPY package.json ./
COPY . .


EXPOSE 3000