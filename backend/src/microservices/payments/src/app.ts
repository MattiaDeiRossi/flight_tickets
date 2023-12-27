import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import colors from 'colors';
import { startDB } from './db';
import { FlightUserPaymentModel } from './models/payment';
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(cors_option));

/**
 * @api {get} /payments get payments
 * @apiName GetPayments
 * @apiGroup Payments
 *
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiSuccess {FlightUserPayment[]} payments payments
 * @apiVersion 1.0.0
 */
app.get('/payments', (req: Request, res: Response) => {
  FlightUserPaymentModel.find({}).then((payments) => {
    return res.status(200).json(payments);
  }).catch((reason) => {
    return res.status(404).json({ error: reason });
  })
});

/**
 * @api {post} /payments add new payment
 * @apiName AddPayment
 * @apiGroup Payments
 *
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiBody {FlightUserPayment} payment new payment to add
 * 
 * @apiSuccess {json} result {result: true}
 * @apiVersion 1.0.0
 * 
 */
app.post('/payments', (req, res) => {
  let f = new FlightUserPaymentModel(req.body);
  f.save().then(() => {
    return res.status(201).json({ result: true });
  }).catch((reason) => {
    return res.status(500).json({ error: reason });
  })
})

/**
 * @api {put} /payments/:flightId modify payments with <flightId>
 * @apiName PutPaymentByFlightId
 * @apiGroup Payments
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiParam {String} flightId flightId of flight to get
 * 
 * @apiSuccess {json} result {result: true}
 * @apiVersion 1.0.0
 * 
 */
app.put('/payments/:flightId', (req: Request, res: Response) => {
  FlightUserPaymentModel.findOne({ flightId: req.params.flightId }).then((payment) => {
    if (payment) {
      payment.isPaid = req.body.isPaid;
      payment.save();
      return res.status(200).json({ result: true });
    } else {
      return res.status(500).json({ error: `Flight ${req.params.flightId} is not updated` });
    }
  }).catch((reason) => {
    return res.status(404).json({ error: reason });
  })
});

/**
 * @api {delete} /payments/:flightId delete payment with <flightId>
 * @apiName DelPayment
 * @apiGroup Payments
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiParam {String} flightId flightId of flight to delete
 * 
 * @apiSuccess {Number} deletedCount deleted count should be 1
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 * 1
 * @apiVersion 1.0.0
 */
app.delete('/payments/:flightId', (req: Request, res: Response) => {
  FlightUserPaymentModel.deleteOne({ flightId: req.params.flightId }).then(
    (data) => {
      return res.status(200).json({ count: data.deletedCount });
    }).catch((reason) => {
      return res.status(404).json({ error: reason });
    })
});

// const HOST: string = '0.0.0.0';
const PORT: number = 3003;

app.listen(PORT, () => {
  console.log(`Payments Service listening at ${PORT}`.green);
});

startDB();
export default app;