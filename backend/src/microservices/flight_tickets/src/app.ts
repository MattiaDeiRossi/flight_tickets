import express from 'express';
import { Request, Response} from 'express';
import cors from 'cors';
import colors from 'colors';
import { startDB } from './db';
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
    origin: 'http://localhost:8081'
}
app.use(cors(cors_option));

app.get('/flights', (req: Request, res: Response) => {
   
});

app.get('/flights/:departure:/arrival', (req, res) => {

});

const HOST: string = '0.0.0.0';
const PORT: number = 3002;

app.listen(PORT, HOST, () => {
    console.log(`Flight tickets Service listening at http://${HOST}:${PORT}`.green);
});
startDB()

export default app;