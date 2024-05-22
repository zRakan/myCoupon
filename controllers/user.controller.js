import { Router } from 'express';
import { User } from '../models/index.js';
import { checkAuth, apiResp } from '../utils/index.js';

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


    return apiResp["INVALID_DATA"](res);
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
        return apiResp["INVALID_DATA"](res);
    }
});

userController.post('/login', checkInputs, async function(req, res) {
    const body = req.body;

    try {
        const targetUser = await User.findUser(body.username);
        const correctPassword = await targetUser.passwordMatch(body.password);

        if(!correctPassword) return apiResp["USER_NOT_FOUND"](res);

        const session = req.session;
        if(session.loggedIn) return apiResp["INVALID_DATA"](res);

        session.loggedIn = true;
        session.role = targetUser.role;

        res.json(session);
    } catch(err) {
        return apiResp["INVALID_DATA"](res);
    }
});

userController.post('/logout', checkAuth, async function(req, res) {
    req.session.destroy(function(err) {
        if(err) return apiResp["INVALID_DATA"](res);

        res.redirect('/login');
    });
});