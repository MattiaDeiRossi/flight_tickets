import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import colors from 'colors';
import { user } from "./models/user";
import { startDB } from "./db";
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

}
app.use(cors(cors_option));

app.get('/users', (req: Request, res: Response) => {
    user.find({}, { digest: 0, salt: 0 }).then((users) => {
        return res.status(200).json(users);
    }).catch((reason) => {
        return res.status(404).json({ error: reason });
    })
});

app.post('/users', (req, res) => {
    let u = new user(req.body);
    u.setPassword(req.body.password);
    u.save().then((data) => {
        return res.status(201).json({ username: u.username });
    }).catch((reason) => {
        return res.status(500).json({ error: reason });
    })
});

app.get('/users/:username', (req, res) => {
    user.findOne({ username: req.params.username }, { digest: 0, salt: 0 }).then((user) => {
        return res.status(200).json(user);
    }).catch((reason) => {
        return res.status(404).json({ error: reason });
    })
});

app.delete('/users/:username', (req, res) => {
    user.deleteOne({ username: req.params.username }).then(
        (data) => {
            return res.status(200).json({ count: data.deletedCount });
        }).catch((reason) => {
            return res.status(404).json({ error: reason });
        })
})

// const HOST: string = '0.0.0.0';
const PORT: number = 3001;

app.listen(PORT, () => {
    console.log(`Users Service listening at ${PORT}`.green);
});

startDB();

export default app;