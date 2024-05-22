import { Router } from 'express';
import { User } from '../models/index.js';
import { checkAuth } from '../utils/index.js';

export const userController = Router();

function checkInputs(req, res, next) {
    const body = req.body;

    //console.log("body:", body);

    if(req.url == '/register') {
        if(body.username && body.password && body.email)
            return next();
    } else {
        if(body.username && body.password)
            return next();
    }


    return res.status(403).send({ status: "error", message: "Invalid data" });
}

userController.post('/register', checkInputs, async function(req, res) {
    const body = req.body;
    
    try {
        const userCreation = new User({
            username: body.username,
            password: body.password,
            email: body.email
        });

        await userCreation.save();

        res.json(userCreation);
    } catch(err) {
        return res.status(400).send({ type: "error", message: "Invalid data" });
    }
});

userController.post('/login', checkInputs, async function(req, res) {
    const body = req.body;

    try {
        const targetUser = await User.findUser(body.username);
        const correctPassword = await targetUser.passwordMatch(body.password);

        if(!correctPassword)
            return res.status(400).send({ type: "error", message: "Incorrect Username/Password" });

        const session = req.session;

        if(session.loggedIn) return res.status(400).send({ type: "error", message: "Invalid data" });

        session.loggedIn = true;
        session.role = targetUser.role;

        res.json(session);
    } catch(err) {
        return res.status(400).send({ type: "error", message: "Invalid data" });
    }
});

userController.post('/logout', checkAuth, async function(req, res) {
    req.session.destroy(function(err) {
        if(err) return res.status(400).send({ type: "error", message: "Invalid data" });

        res.redirect('/login');
    });
});