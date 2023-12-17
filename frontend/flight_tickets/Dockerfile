# Build stage
FROM node:20.10.0-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Deploy
FROM nginx
LABEL maintainer="Mattia Dei Rossi <885768@stud.unive.it>"
COPY --from=build /usr/src/app/dist/flight_tickets/browser /usr/share/nginx/html
EXPOSE 80