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

/**
 * @api {get} /users get users
 * @apiName GetUsers
 * @apiGroup Users
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiSuccess {User[]} users users
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "_id": "6494c0b497dc9f6f342a87e1",
 *       "username": "admin",
 *       "role": "admin",
 *       "__v": 0
 *   },
 *   {
 *       "_id": "6494c3f0a5b2570281dac95f",
 *       "username": "client",
 *       "role": "client",
 *       "__v": 0
 *   }
 * ]
 * @apiVersion 1.0.0
 */
app.get('/users', (req: Request, res: Response) => {
    user.find({}, { digest: 0, salt: 0 }).then((users) => {
        return res.status(200).json(users);
    }).catch((reason) => {
        return res.status(404).json({ error: reason });
    })
});

/**
 * @api {post} /users add new user
 * @apiName AddUsers
 * @apiGroup Users
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiBody {User} user new user to add
 * 
 * @apiSuccess {String} username username of new user added
 * @apiVersion 1.0.0
 */
app.post('/users', (req, res) => {
    let u = new user(req.body);
    u.setPassword(req.body.password);
    u.save().then((data) => {
        return res.status(201).json({ username: u.username });
    }).catch((reason) => {
        return res.status(500).json({ error: reason });
    })
});

/**
 * @api {get} /users/:username get user with <username>
 * @apiName GetUser
 * @apiGroup Users
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiParam {String} username username of user to delete
 * @apiSuccess {User} user user with <username>
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 * {
 *  "_id": "6494c0b497dc9f6f342a87e1",
 *   "username": "admin",
 *   "role": "admin",
 *   "__v": 0
 * }
 * @apiVersion 1.0.0
 */
app.get('/users/:username', (req, res) => {
    user.findOne({ username: req.params.username }, { digest: 0, salt: 0 }).then((user) => {
        return res.status(200).json(user);
    }).catch((reason) => {
        return res.status(404).json({ error: reason });
    })
});

/**
 * @api {delete} /users/:username delete user with <username>
 * @apiName DelUser
 * @apiGroup Users
 * 
 * @apiHeader {String} Authorizaton Unique user token with Barer policy
 * @apiParam {String} username username of user to delete
 * 
 * @apiSuccess {Number} deletedCount deleted count should be 1
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 * 1
 * @apiVersion 1.0.0
 */
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