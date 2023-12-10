import * as express from "express";
import { Application, Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import * as colors from 'colors';
colors.enable();

// const app = express();
// app.use(express.json());
// const cors_option = {
//     origin: 'http://localhost:8081'
// }
// app.use(cors(cors_option));

// app.get('/flights', (req: Request, res: Response) => {

// });

// const HOST = '0.0.0.0';
// const PORT = '3002';

// app.listen(PORT, HOST, () => {
//     console.log(`Flight Tickets Service listening at http://${HOST}:${PORT}`.green);
// });