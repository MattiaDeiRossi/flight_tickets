#!/bin/bash

mongoimport --db='flight_tickets_db' --collection='flights' --file='/tmp/flight_data.json' --jsonArray --username='root' --password='example' --authenticationDatabase=admin