# Flight Tickets

<a>
  <img src="documentation/img/unive.png" alt="logo" title="CaFoscari" align="right" height="100" />
</a>

Authors: 
- Mattia Dei Rossi - [885768@stud.unive.it](885768@stud.unive.it)
## How to run 
1. Create my_net network
```bash
docker network create my_net
```
2. Launch docker compose
```bash
docker compose up -d
```
3. Init mongodb_flight_tickets DB
```
docker exec -i mongodb_flight_tickets bash
./import.sh
```
4. Go to http://localhost:4200/ from your preferred browser

## Software Architecture
![Architecture](./documentation/Flight%20Tickets.png)

## Documents
- [Kata & Characteristics](./documentation/KataCharacteristics.pdf)
- [Software Architecture](./documentation/SW.pdf)
- [APIs](./backend/apidoc/index.html)

## Features
- [Create new Account](./documentation/features/Createanewadminaccount.pdf.pdf)
- [Delete user](./documentation/features/DeleteaUser.pdf.pdf)

- [Purchase tickets](./documentation/features/BookingandManagingFlights.pdf.pdf)
- [Multiple users](./documentation/features/MultipleUsers.pdf)
- [Make a refund](./documentation/features/Makearefund.pdf.pdf)
