import { Router } from 'express';
import { Store } from '../models/index.js';

import { isAdmin, apiResp } from '../utils/index.js';

export const storeController = Router();

function checkInputs(req, res, next) {
    const body = req.body;

    if(req.url == '/create' && body.name && body.img) return next();
    else if(req.url == '/remove' && body.id) return next();

    return apiResp["INVALID_DATA"](res);
}

storeController.post('/create', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;

    try {
        const store = new Store({
            name: body.name,
            img: body.img
        });

        await store.save();

        return res.json(store);
    } catch(err) {
        return apiResp["INVALID_DATA"](res);
    }
});

storeController.post('/remove', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;

    try {
        const removed = await Store.deleteOne({ id: body.id });
        if(!removed || removed.deletedCount == 0) return apiResp["STORE_NOT_FOUND"](res);

        res.json(removed);
    } catch(err) {
        return apiResp["INVALID_DATA"](res);
    }
});