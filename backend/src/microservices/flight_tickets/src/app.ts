import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import colors from 'colors';
import { startDB } from './db';
import FlightModel from './models/flights';
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
    origin: 'http://localhost:8081'
}
app.use(cors(cors_option));
startDB();

app.get('/flights', (req: Request, res: Response) => {
    FlightModel.find({}).then((flights) => {
        return res.status(200).json(flights);
    }).catch((reason) => {
        return res.status(404).json({ error: reason });
    })
});

app.get('/flights/:departure/:arrival', (req, res) => {
    const { departure, arrival } = req.params;
    FlightModel.find({
        'departure.airport': departure,
        'arrival.airport': arrival,
    }).then((flights) => {
        if (flights.length === 0) {
            return res.status(404).json({ error: 'No flights found' });
        }

        return res.status(200).json(flights);
    }).catch((reason) => {
        return res.status(500).json({ error: 'Internal Server Error' });
    })
});

app.get('/flights/:departure/:arrival/:departureDate', (req: Request, res: Response) => {
    const { departure, arrival, departureDate } = req.params;
    FlightModel.find({
        'departure.airport': departure,
        'arrival.airport': arrival,
        'flight_date': departureDate
    }).then((flights) => {
        if (flights.length === 0) {
            return res.status(404).json({ error: 'No flights found' });
        }

        return res.status(200).json(flights);
    }).catch((reason) => {
        return res.status(500).json({ error: 'Internal Server Error' });
    })
});

const HOST: string = '0.0.0.0';
const PORT: number = 3002;

app.listen(PORT, HOST, () => {
    console.log(`Flight tickets Service listening at http://${HOST}:${PORT}`.green);
});

export default app;