import { Router } from 'express';
import { Store } from '../models/index.js';

import { isAdmin } from '../utils/index.js';

export const storeController = Router();

function checkInputs(req, res, next) {
    const body = req.body;

    if(req.url == '/create') {
        if(body.name && body.img) return next();
    } else if(req.url == '/remove') {
        if(body.id) return next();
    }

    return res.status(403).send({ status: "error", message: "Invalid data" });
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
        return res.status(403).send({ status: "error", message: "Invalid data" });
    }
});

storeController.post('/remove', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;

    try {
        const removed = await Store.deleteOne({ id: body.id });
        if(!removed || removed.deletedCount == 0) return res.status(403).send({ status: "error", message: "Store not found" });

        res.json(removed);
    } catch(err) {
        return res.status(403).send({ status: "error", message: "Invalid data" });
    }
});