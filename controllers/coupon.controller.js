import { Router } from 'express';

// Import models
import { Coupon, Store } from '../models/index.js';

// Import utilities
import { checkAuth, isAdmin, apiResp } from '../utils/index.js';

// Export the router
export const couponController = Router();

function checkInputs(req, res, next) {
    const body = req.body;

    if(req.url == '/add' && body.code && body.percentage && body.belongs) return next();
    else if(['/accept', '/remove'].includes(req.url) && body.id) return next();

    return apiResp["INVALID_DATA"](res)
}

/*
    POST Requests
*/
couponController.post('/add', checkInputs, checkAuth, async function(req, res) {
    const body = req.body;

    try {
        const storeFound = await Store.hasId(body.belongs);
        if(!storeFound) return apiResp["STORE_NOT_FOUND"](res);

        const couponCreation = new Coupon({
            code: body.code,
            percentage: +body.percentage, // parseInt(body.percentage) <=> +body.percentage
            belongs: body.belongs,

            description: body.description,

            addedBy: req.session.name
        });

        await couponCreation.save();

        res.json(couponCreation);
    } catch(err) {
        return apiResp["INVALID_DATA"](res)
    }
});

couponController.post('/remove', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;
    
    try {
        const couponTarget = await Coupon.deleteOne({ id: body.id });
        if(!couponTarget || couponTarget.deletedCount == 0) return apiResp["COUPON_NOT_FOUND"](res);
        
        res.json(couponTarget);
    } catch(err){
        return apiResp["INVALID_DATA"](res);
    }
});

couponController.post('/accept', checkInputs, isAdmin, async function(req, res) {
    const body = req.body;
    
    try {
        const couponTarget = await Coupon.findOne({ id: body.id });
        if(!couponTarget || couponTarget.length == 0) return apiResp["COUPON_NOT_FOUND"](res);

        couponTarget.acceptCoupon();
        couponTarget.save();

        res.json(couponTarget);
    } catch(err) {
        return apiResp["INVALID_DATA"](res)
    }
});