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

app.get('/payments', (req: Request, res: Response) => {
  FlightUserPaymentModel.find({}).then((payments) => {
    return res.status(200).json(payments);
  }).catch((reason) => {
    return res.status(404).json({ error: reason });
  })
});

app.post('/payments', (req, res) => {
  console.log(req.body)
  let f = new FlightUserPaymentModel(req.body);
  f.setPaid(true);
  f.save().then(() => {
    return res.status(201).json({ result: true });
  }).catch((reason) => {
    return res.status(500).json({ error: reason });
  })
})

app.get('/payments/:flightId', (req: Request, res: Response) => {
  FlightUserPaymentModel.findOne({ flightId: req.params.flightId }).then((payment) => {
    if (payment) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(500).json({ error: `Flight ${req.params.flightId} is not paid` });
    }
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