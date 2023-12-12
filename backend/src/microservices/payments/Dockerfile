FROM node:20.10.0-alpine
LABEL maintainer="Mattia Dei Rossi <885768@stud.unive.it>"

WORKDIR /payments
COPY package.json .
RUN npm install
COPY . .