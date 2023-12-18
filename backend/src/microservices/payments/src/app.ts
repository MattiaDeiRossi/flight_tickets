import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import colors from 'colors';
import { startDB } from './db';
import FlightUserPaymentModel from '../models/payment';
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
  origin: 'http://localhost:8080'
}
app.use(cors(cors_option));
startDB();

app.post('/payments/', (req: Request, res: Response) => {
  let f = new FlightUserPaymentModel(req.body);
  f.setPaid(true);
  f.save().then(() => {
    return res.status(201).json({ result: true });
  }).catch((reason) => {
    return res.status(500).json({ error: reason });
  })
})



app.get('/payments/:flightId', (req: Request, res: Response) => {
  FlightUserPaymentModel.findOne({ flightId: req.params.flightId }).then((payment)=>{
    if(payment){
      return res.status(200).json({ result: true });
    }else{
      return res.status(500).json({ error: `Flight ${req.params.flightId} is not paid` });
    }
  })
});

// const HOST: string = '0.0.0.0';
const PORT: number = 3003;

app.listen(PORT, () => {
  console.log(`Payments Service listening at ${PORT}`.green);
});

export default app;