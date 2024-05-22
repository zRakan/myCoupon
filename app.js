import express from 'express';
import mongoose from 'mongoose';

import session from 'express-session';

import path from 'path';

// Import utilities
import { log } from './utils.js';

const app = express();

// Express configurations
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

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

app.get('/', function(req, res, next) {
    res.send(`x`);
});

// Routers
import { couponController, storeController, userController } from './controllers/index.js';
app.use('/user', userController);
app.use('/coupon', couponController);
app.use('/store', storeController);

// MongoDB
await mongoose.connect('mongodb://127.0.0.1:27017/myCoupon');

app.listen(PORT, function() {
    log(`Listening on: ${PORT}`);
})