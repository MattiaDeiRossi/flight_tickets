import express from 'express';
import passport from 'passport';
import passportHTTP from 'passport-http';
import * as jwt from 'express-jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import cors from 'cors';
import colors from 'colors';
import { user } from "./models/user";
import { startDB } from "./db";
import { createProxyMiddleware } from 'http-proxy-middleware';

colors.enable();

const app = express();
const users_service = 'http://users:3001';
const flight_tickets_service = 'http://flights:3002';
const payments_service = 'http://payments:3003';

const proxyA = createProxyMiddleware({
    target: users_service, changeOrigin: true,
    pathRewrite: {
        '^/api/users': '',
    }, onProxyReq: (proxyReq, req: Request, res) => {
        if ((req.method == "POST" || req.method == "PUT") && req.body) {
            let body = req.body;
            let newBody = '';
            try {
                newBody = JSON.stringify(body);
                proxyReq.setHeader('content-length', Buffer.byteLength(newBody, 'utf8'));
                proxyReq.write(newBody);
                proxyReq.end();
            } catch (e) {
                console.log('Stringify err', e)
            }
        }
    },
});
const proxyB = createProxyMiddleware({
    target: flight_tickets_service, changeOrigin: true,
    pathRewrite: {
        '^/api/flights': '',
    }, onProxyReq: (proxyReq, req: Request, res) => {
        if ((req.method == "POST" || req.method == "PUT") && req.body) {
            let body = req.body;
            let newBody = '';
            try {
                newBody = JSON.stringify(body);
                proxyReq.setHeader('content-length', Buffer.byteLength(newBody, 'utf8'));
                proxyReq.write(newBody);
                proxyReq.end();
            } catch (e) {
                console.log('Stringify err', e)
            }
        }
    },
});
const proxyC = createProxyMiddleware({
    target: payments_service, changeOrigin: true,
    pathRewrite: {
        '^/api/payments': '',
    }, onProxyReq: (proxyReq, req: Request, res) => {
        if ((req.method == "POST" || req.method == "PUT") && req.body) {
            let body = req.body;
            let newBody = '';
            try {
                newBody = JSON.stringify(body);
                proxyReq.setHeader('content-length', Buffer.byteLength(newBody, 'utf8'));
                proxyReq.write(newBody);
                proxyReq.end();
            } catch (e) {
                console.log('Stringify err', e)
            }
        }
    }
});

app.use(express.json());
const cors_option = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(cors_option));
const secret = 'my_secret';
const auth = jwt.expressjwt({
    secret: secret,
    algorithms: ["HS256"]
});

passport.use(new passportHTTP.BasicStrategy(
    function (username, password, done) {
        console.log("New login attempt from ".blue + username);
        user.findOne({ username: username }).then(
            (user) => {
                if (!user) {
                    return done(null, false, { error: "Invalid user" });
                }
                if (user.validatePassword(password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { error: "Invalid password" });
                }
            }).catch((reason) => {
                return done({ error: reason });
            })
    })
)

app.get('/', (req, res) => {
    res.status(200).json({ api_gateway_version: "1.0" });
});

app.get('/login', passport.authenticate('basic', { session: false }), (req, res) => {
    console.log("Login granted".green, " Generating token...");
    let tokendata = {
        username: req.user.username,
        role: req.user.role,
        id: req.user.id
    };
    let token_signed = jsonwebtoken.sign(tokendata, secret, { expiresIn: '1h' });
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
})

app.post('/register', (req, res) => {
    let u = new user(req.body);
    u.setPassword(req.body.password);
    u.save().then((data) => {
        return res.status(201).json(u.username);
    }).catch((reason) => {
        console.log(reason.name)
        return res.status(500).json({ reason: reason });
    })

});


app.use('/api/users', auth, proxyA);
app.use('/api/flights', auth, proxyB);
app.use('/api/payments', auth, proxyC);

// const HOST: string = '0.0.0.0';
const PORT: number = 8081;

app.listen(PORT, () => {
    console.log(`API Gateway listening at ${PORT}`.green);
});

startDB();

export default app;