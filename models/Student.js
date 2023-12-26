import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const studentSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    birthday: String,
    city: String
})

const studentModel = new model('Student', studentSchema)

export default studentModel;
