import * as express from "express";
import * as passport from 'passport';
import * as passportHTTP from 'passport-http';
import * as jwt from 'express-jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import * as cors from 'cors';
import * as httpProxy from 'http-proxy';
import * as colors from 'colors';
import { user } from "./users/models/user";
import { startDB } from "./db";
colors.enable();

const app = express();
const users_service = 'http://localhost:3001';
const flight_tickets_service = 'http://localhost:3002';
const proxyA = httpProxy.createProxyServer({ target: users_service, changeOrigin: true });
const proxyB = httpProxy.createProxyServer({ target: flight_tickets_service, changeOrigin: true });

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
                } else {
                    return done(null, "Invalid credentials");
                }
            }).catch((reason) => {
                return done(null, reason);
            })
    })
)

app.get('/', (req, res) => {
    res.status(200).json({ api_version: "1.0" });
});

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

app.post('/register', (req, res) => {
    fetch(`${users_service}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    }).then((response) => {
        res.status(response.status).json(response);
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});

app.get('/api/users', auth, (req, res) => {
    proxyA.web(req, res);
});

app.get('/api/tickets', auth, (req, res) => {
    proxyB.web(req, res);
});

const HOST = process.env.GATEWAY_HOST;
const PORT = process.env.GATEWAY_PORT;

app.listen(PORT, HOST, () => {
    console.log(`API Gateway listening at http://${HOST}:${PORT}`.green);
});

startDB();
