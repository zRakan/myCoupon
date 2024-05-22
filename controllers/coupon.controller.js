import { Router } from 'express';

// Import models
import { Coupon, Store } from '../models/index.js';

// Import utilities
import { checkAuth, isAdmin } from '../utils/index.js';

// Export the router
export const couponController = Router();

function checkInputs(req, res, next) {
    const body = req.body;

    if(req.url == '/add' && body.code && body.percentage && body.belongs) return next();
    else if(['/accept', '/remove'].includes(req.url) && body.id) return next();

    return res.status(403).send({ status: "error", message: "Invalid data" });
}

/*
    GET Requests
*/
couponController.get('/list/:store_id', async function(req, res) {
    const storeId = req.params.store_id;
    if(!storeId) return res.status(403).send({ status: "error", message: "Store not found" });
    
    const couponsList = await Coupon.find({ belongs: storeId, accepted: true }).select("code percentage -_id"/* { "code": 1, "percentage": 1, '_id': 0 }*/);

    res.json(couponsList);
});


/*
    POST Requests
*/
couponController.post('/add', checkInputs, checkAuth, async function(req, res) {
    const body = req.body;

    try {
        const storeFound = await Store.hasId(body.belongs);
        if(!storeFound) return res.status(403).send({ status: "error", message: "Store not found" });

        const couponCreation = new Coupon({
            code: body.code,
            percentage: +body.percentage, // parseInt(body.percentage) <=> +body.percentage
            belongs: body.belongs
        });

        await couponCreation.save();

        res.json(couponCreation);
    } catch(err) {
        return res.status(403).send({ status: "error", message: "Invalid data" });
    }
});

couponController.post('/remove', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;
    
    try {
        const couponTarget = await Coupon.deleteOne({ id: body.id });
        if(!couponTarget || couponTarget.deletedCount == 0) return res.status(403).send({ status: "error", message: "Coupon not found" });

        res.json(couponTarget);
    } catch(err) {
        return res.status(403).send({ status: "error", message: "Invalid data" });
    }
});

couponController.post('/accept', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;
    
    try {
        const couponTarget = await Coupon.findOne({ id: body.id });
        if(!couponTarget || couponTarget.length == 0) return res.status(403).send({ status: "error", message: "Coupon not found" });

        couponTarget.acceptCoupon();
        couponTarget.save();

        res.json(couponTarget);
    } catch(err) {
        return res.status(403).send({ status: "error", message: "Invalid data" });
    }
});