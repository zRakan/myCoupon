import express from 'express';
import mongoose from 'mongoose';

import session from 'express-session';

// Import utilities
import { isAdmin, log } from './utils/index.js';

const app = express();

// Express configurations
const PORT = 3000;

// Create static files
app.use('/static', express.static('static'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware(s)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
    name: 'myCoupon-ID',
    secret: 'This-is-SECRET!',
    
    resave: false,
    saveUninitialized: false
}));

// Views
import { Store, Coupon } from './models/index.js';
app.get('/', async function(req, res) {
    const storeList = await Store.find({}).select('name img id -_id');

    res.render('index', { title: "الرئيسية", user: req.session, stores: storeList });
});

app.get('/couponsList', isAdmin, async function(req, res) {
    let storeList = await Store.find({}).select('name img id -_id');
        storeList = storeList.reduce((obj, val) => ({ ...obj, [val.id]: { name: val.name, img: val.img } }), {});

    const notAcceptedCoupons = await Coupon.find({ accepted: false }).select('code description percentage belongs addedBy id -_id');

    res.render('couponsManage', { title: "لوحة تحكم", user: req.session, couponsList: notAcceptedCoupons, stores: storeList })
});

app.get('/coupons/:store_id', async function(req, res) {
    const storeId = req.params.store_id;
    if(!storeId) return res.redirect('/')

    const targetStore = await Store.findOne({ id: storeId }).select("id name img -_id")
    if(!targetStore) return res.redirect('/');

    const couponsList = await Coupon.find({ belongs: storeId, accepted: true }).select("code description percentage -_id");

    res.render('coupons', { title: targetStore.name, user: req.session, store: targetStore, coupons: couponsList });
})

app.get('/login', function(req, res) {
    if(req.session.loggedIn) return res.redirect('/');

    res.render('authentication', { title: "تسجيل الدخول", user: req.session });
});

app.get('/register', function(req, res) {
    if(req.session.loggedIn) return res.redirect('/');

    res.render('authentication', { title: "تسجيل حساب", user: req.session });
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

// Controller
import { couponController, storeController, userController } from './controllers/index.js';
app.use('/user', userController);
app.use('/coupon', couponController);
app.use('/store', storeController);

// Redirect all unknown routes to index page
app.use(function(req, res) {
    res.redirect('/');
})

// MongoDB
await mongoose.connect('mongodb://127.0.0.1:27017/myCoupon');

app.listen(PORT, function() {
    log(`Listening on: ${PORT}`);
})