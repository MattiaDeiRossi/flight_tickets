import * as express from "express"; 
import { Application, Request, Response, NextFunction } from 'express';
import { User, user } from './models/user';
import * as passport from 'passport';
import * as passportHTTP from 'passport-http';
import * as cors from 'cors';
import * as jwt from 'express-jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import * as colors from 'colors';
colors.enable();

const app = express();
app.use(express.json());
app.use(cors());
const auth = jwt.expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});

passport.use(new passportHTTP.BasicStrategy(
    function (username, password, done) {
        console.log("New login attempt from ".blue + username);
        user.findOne({ username: username }).then(
            (user) => {
                if (user.validatePassword(password)) {
                    return done(null, user);
                }
            }).catch((reason) => {
                return done(null, reason);
            })
    })
)

app.get('/', (req, res) => {
    res.status(200).json({ api_version: "1.0" });
});

app.get('/users', auth, (req: Request, res: Response) => {
    user.find({}, { digest: 0, salt: 0 }).then((users) => {
        return res.status(200).json(users);
    }).catch((reason) => {
        return res.status(404).json(reason);
    })
});

app.post('/users', (req, res, next) => {
    let u = new user(req.body);
    u.setPassword(req.body.password);
    u.save().then((data) => {
        return res.status(201).json(u.username);
    }).catch((reason) => {
        console.log(reason.name)
        return res.status(500).json(reason);
    })
});

app.delete('/users/:username', auth, (req, res, next) => {
    user.deleteOne({ username: req.params.username }).then(
        (data) => {
            return res.status(200).json(data.deletedCount);
        }).catch((reason) => {
            return res.status(404).json(reason);
        })
})

app.get('/login', passport.authenticate('basic', { session: false }), (req, res) => {
    console.log("Login granted".green, " Generating token...");
    let tokendata = {
        username: req.user.username,
        role: req.user.role,
        id: req.user.id
    };
    let token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
})


export { app };