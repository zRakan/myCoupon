import { model, Schema } from 'mongoose';
import { uniqueId } from '../utils/index.js';


const storeSchema = new Schema({
    id: {
        type: String,
        unique: true,
        _id: true,
    },

    name: {
        type: String,
        required: true
    },

    img: {
        type: String,
        required: true
    }
});

storeSchema.statics.hasId = async function(id) {
    const targetStore = await this.findOne({ id });

    return !!targetStore;
}

storeSchema.pre('save', async function() {
    if(this.isNew)
        this.id = uniqueId(8);
});

export const Store = new model("Stores", storeSchema);