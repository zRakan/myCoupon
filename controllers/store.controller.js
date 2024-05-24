import { Router } from 'express';
import { Store } from '../models/index.js';

import { isAdmin, apiResp } from '../utils/index.js';

export const storeController = Router();

function checkInputs(req, res, next) {
    const body = req.body;

    if(req.url == '/remove' && body.id) return next();

    return apiResp["INVALID_DATA"](res);
}

storeController.get('/create', isAdmin, async function(req, res) {
    res.render('storeCreation', { title: "انشاء متجر جديد", user: req.session });
});

storeController.get('/edit/:store_id', isAdmin, async function(req, res) {
    const storeId = req.params.store_id;
    if(!storeId) return res.redirect('/');

    const targetStore = await Store.findOne({ id: storeId }).select('name id -_id');

    res.render('storeEditor', { title: "تعديل المتجر", user: req.session, store: targetStore });
});

// Import multer & path
import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
const STORAGE = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'static/assets/images/');
    },

    filename: function(req, file, cb) {
        cb(null, `IMAGE_${Date.now()}_${req.body.name}${path.extname(file.originalname)}`);
    }
});

const UPLOAD = multer({ storage: STORAGE });

storeController.post('/create', isAdmin, UPLOAD.single('img'), async function(req, res) {
    const body = req.body;
    const file = req.file;

    try {
        const store = new Store({
            name: body.name,
            img: `/static/assets/images/${file.filename}`
        });

        await store.save();

        return res.redirect('/');
    } catch(err) {
        return apiResp["INVALID_DATA"](res);
    }
});

storeController.post('/edit', isAdmin, UPLOAD.single('img'), async function(req, res) {
    const body = req.body;
    const file = req.file;

    try {
        // Remove old logo of the removed store
        const targetStore = await Store.findOne({ id: body.id }).select("img -_id");
        const IMG_PATH = `.${targetStore.img}`;

        await fs.unlink(IMG_PATH);

        await Store.updateOne({ id: body.id }, {
            name: body.name,
            img: `/static/assets/images/${file.filename}`
        });

        return res.redirect('/');
    } catch(err) {
        console.log(err);
        return apiResp["INVALID_DATA"](res);
    }
});

storeController.post('/remove', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;

    try {
        // Remove logo of the removed store
        const targetStore = await Store.findOne({ id: body.id }).select("img -_id");
        const IMG_PATH = `.${targetStore.img}`;

        await fs.unlink(IMG_PATH);

        // Remove the store data
        const removed = await Store.deleteOne({ id: body.id });
        if(!removed || removed.deletedCount == 0) return apiResp["STORE_NOT_FOUND"](res);

        return res.json(removed);
    } catch(err) {
        return apiResp["INVALID_DATA"](res);
    }
});