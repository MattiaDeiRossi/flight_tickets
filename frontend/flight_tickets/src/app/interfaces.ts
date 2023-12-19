export interface User {
  password: string,
  username: string,
  role: string
};

interface Airport {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string | null;
  gate: string | null;
  delay: string | null;
  scheduled: Date;
  estimated: Date;
  actual: Date | null;
  estimated_runway: Date | null;
  actual_runway: Date | null;
}

interface Airline {
  name: string;
  iata: string | null;
  icao: string | null;
}

interface Flight {
  number: string | null;
  iata: string | null;
  icao: string | null;
  codeshared: string | null;
}

export interface FlightDocument{
  _id: string;
  flight_date: string;
  flight_status: string | null;
  departure: Airport;
  arrival: Airport;
  airline: Airline;
  flight: Flight;
  aircraft: string | null;
  live: string | null;
  price: number
}



export enum ROLES {
  ADMIN = "admin",
  CLIENT = "client",
}

export interface FlightUserPayment {
  userId: string;
  flightId: string;
  isPaid: boolean;
}