FROM node:20.10.0-alpine
LABEL maintainer="Mattia Dei Rossi <885768@stud.unive.it>"

WORKDIR /users
COPY package.json .
RUN npm install\
    && npm install typescript -g
COPY . .
RUN tsc