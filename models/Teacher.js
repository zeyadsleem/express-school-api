import { hashPassword } from '../utils/helper.js'
import shortId from 'shortid'
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const teacherSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    birthday: String,
    city: String,
    salt: String
})

teacherSchema.pre('save', function(next) {
    if (!this.salt) {
        this.salt = shortId.generate();
    }

    if (this.password) {
        this.password = hashPassword(this.password)
    }

    next();
});

const teacherModel = new model('Teacher', teacherSchema);


export default teacherModel;
