import * as express from "express";
import { Application, Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import * as colors from 'colors';
import { user } from "./models/user";
import { startDB } from "./db";
colors.enable();

const app = express();
app.use(express.json());
const cors_option = {
    origin: 'http://localhost:8081'
}
app.use(cors(cors_option));

app.get('/users', (req: Request, res: Response) => {
    user.find({}, { digest: 0, salt: 0 }).then((users) => {
        return res.status(200).json(users);
    }).catch((reason) => {
        return res.status(404).json({ reason: reason });
    })
});

app.post('/users', (req, res) => {
    let u = new user(req.body);
    u.setPassword(req.body.password);
    u.save().then((data) => {
        return res.status(201).json(u.username);
    }).catch((reason) => {
        console.log(reason.name)
        return res.status(500).json({ reason: reason });
    })
});

app.get('/users/:username', (req, res) => {
    user.findOne({ username: req.params.username }, { digest: 0, salt: 0 }).then((user) => {
        return res.status(200).json(user);
    }).catch((reason) => {
        return res.status(404).json({ reason: reason });
    })
});

app.delete('/users/:username', (req, res) => {
    user.deleteOne({ username: req.params.username }).then(
        (data) => {
            return res.status(200).json(data.deletedCount);
        }).catch((reason) => {
            return res.status(404).json({ reason: reason });
        })
})

const HOST = '0.0.0.0';
const PORT = '3001';

app.listen(PORT, HOST, () => {
    console.log(`Users Service listening at http://${HOST}:${PORT}`.green);
});

startDB();