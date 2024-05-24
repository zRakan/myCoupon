import { model, Schema } from 'mongoose';
import { uniqueId } from '../utils/index.js';

const couponsSchema = new Schema({
    id: {
        type: String,
        unique: true,
        _id: true,
    },

    code: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    percentage: {
        type: Number,
        required: true
    },

    belongs: {
        type: String,
        required: true
    },

    accepted: {
        type: Boolean,
        default: false
    },

    addedBy: {
        type: String
    }
});

couponsSchema.methods.acceptCoupon = function() {
    this.accepted = true;
}

couponsSchema.pre('save', function() {
    if(this.isNew)
        this.id = uniqueId(10);
});

export const Coupon = new model("Coupons", couponsSchema);