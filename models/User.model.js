import { Schema, model } from 'mongoose';
import validator from 'validator';

import bcrypt from 'bcryptjs';
// bCrypt configuration
const saltRounds = 10;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    
    email: {
        type: String,
        required: true,
        trim: true,

        validate(value) {
            if(!validator.isEmail(value))
                throw new Error("Email is invalid")
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    role: {
        type: String,
        default: "user"
    }
});

userSchema.statics.findUser = async function(username) {
    const user = await this.findOne({ username });
    return user;
}

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.emailTaken = async function(email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};
  
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.passwordMatch = async function(password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

userSchema.methods.isAdmin = function() {
    const user = this;
    return user.role == 'admin';
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password, saltRounds);

    next();
});

export const User = model("Users", userSchema);