FROM mongo
ENV MONGO_INITDB_ROOT_USERNAME: root
ENV MONGO_INITDB_ROOT_PASSWORD: example
ENV MONGO_INITDB_DATABASE: flight_tickets_db

COPY flight_data.json /tmp/flight_data.json
COPY import.sh /docker-entrypoint-initdb.d/

ADD init-mongo.js /docker-entrypoint-initdb.d/