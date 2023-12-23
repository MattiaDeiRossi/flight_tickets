import { Schema, Document, model } from 'mongoose';

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

export interface FlightDocument extends Document {
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

const FlightSchema = new Schema<FlightDocument>({
  _id: String,
  flight_date: String,
  flight_status: String,
  departure: {
    airport: String,
    timezone: String,
    iata: String,
    icao: String,
    terminal: String,
    gate: String,
    delay: String,
    scheduled: Date,
    estimated: Date,
    actual: Date,
    estimated_runway: Date,
    actual_runway: Date,
  },
  arrival: {
    airport: String,
    timezone: String,
    iata: String,
    icao: String,
    terminal: String,
    gate: String,
    baggage: String,
    delay: String,
    scheduled: Date,
    estimated: Date,
    actual: Date,
    estimated_runway: Date,
    actual_runway: Date,
  },
  airline: {
    name: String,
    iata: String,
    icao: String,
  },
  flight: {
    number: String,
    iata: String,
    icao: String,
    codeshared: String,
  },
  aircraft: String,
  live: String,
  // price: Number
});

const FlightModel = model<FlightDocument>('Flight', FlightSchema);

export default FlightModel;
