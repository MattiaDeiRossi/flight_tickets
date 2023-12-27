import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import colors from 'colors';
import { startDB } from './db';
import FlightModel, { FlightDocument } from './models/flights';
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

}
app.use(cors(cors_option));
startDB();

/**
 * @api {get} /flights get flights
 * @apiName GetFlights
 * @apiGroup Flights
 *
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiSuccess {Flight[]} flights flights
 * @apiVersion 1.0.0
 */
app.get('/flights', (req: Request, res: Response) => {
    FlightModel.find({}).then((flights) => {
        return res.status(200).json(flights);
    }).catch((reason) => {
        return res.status(404).json({ error: reason });
    })
});

/**
 * @api {get} /flights/:departure/:arrival get flights with <departure>, <arrival>
 * @apiName GetFlightDA
 * @apiGroup Flights
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiParam {String} departure departure of flights
 * @apiParam {String} arrival arrival of flights
 * 
 * @apiSuccess {Flight[]} flights flights
 * @apiVersion 1.0.0
 */
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

/**
 * @api {get} /flights/:departure/:arrival/:departureDate get flights with <departure>, <arrival>, <departureDate>
 * @apiName GetFlightDAD
 * @apiGroup Flights
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiParam {String} departure departure of flights
 * @apiParam {String} arrival arrival of flights
 * @apiParam {String} departureDate departureDate of flights
 * 
 * @apiSuccess {Flight[]} flights flights
 * @apiVersion 1.0.0
 */
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

// const HOST: string = '0.0.0.0';
const PORT: number = 3002;

app.listen(PORT, () => {
    console.log(`Flight tickets Service listening at ${PORT}`.green);
});

export default app;