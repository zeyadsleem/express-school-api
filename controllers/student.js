import Joi from "joi";
import jwt from 'jsonwebtoken'
import { hashPassword } from "../utils/helper.js";
import {
    INVALID_REQUEST_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
    NOT_FOUND_STUDENT_ERROR_MESSAGE,
} from "../constants/index.js";
import studentModel from "../models/Student.js";

export const registerStudent = async (req, res) => {
    const { name, email, password, birthday, city } = req.body;

    const bodySchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        birthday: Joi.string().required(),
        city: Joi.string().required()
    })

    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
        res.statusCode = INVALID_REQUEST_STATUS_CODE;
        res.send(validationResult.error.details[0].message);
        return
    }

    try {
        const newStudent = new studentModel({
            name,
            email,
            password: hashPassword(password),
            birthday,
            city
        })

        await newStudent.save();

        res.send(newStudent);
    } catch (error) {
        res.send(error.message);
    }
};

export const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    const student = await studentModel.findOne({ email });

    if (!student) {
        res.statusCode = 401;
        res.send(NOT_FOUND_STUDENT_ERROR_MESSAGE)
    } else {
        if (student.password === hashPassword(password)) {
            const token = jwt.sign({ sub: student._id }, 'secret', { expiresIn: 30 })
            res.send(token)
        } else {
            res.statusCode = 403;
            res.send('Wrong password')
        }
    }
};

export const getStudent = async (req, res) => {
    const conditions = {};

    try {
        const token = req.headers.authorization;

        if (!token) {
            res.statusCode = 401;
            res.send('You do not have Permission!')
        }

        const decodedToken = jwt.decode(token);

        const student = await studentModel.findById(decodedToken.sub);

        if (!student) {
            res.statusCode = 401;
            res.send('You do not have Permission!')
            return
        }
    } catch (error) {
        res.statusCode = 401;
        console.log(error.message);
    }

    const data = await studentModel.find(conditions)

    res.send(data);
};

export const updateStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.findById(id);

        if (!student) {
            res.statusCode = NOT_FOUND_STATUS_CODE;
            res.send(NOT_FOUND_STUDENT_ERROR_MESSAGE)
        } else {
            const { birthday, city } = req.body;

            if (birthday, city) {
                student.birthday = birthday;
                student.city = city;
                student.save();
            }
            res.send(student);
        }
    } catch (error) {
        res.statusCode = INVALID_REQUEST_STATUS_CODE;
        res.send('Error getting teacher data');
    }
};

export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.findById(id);

        if (!student) {
            res.statusCode = NOT_FOUND_STATUS_CODE;
            res.send(NOT_FOUND_STUDENT_ERROR_MESSAGE)
        } else {
            return studentModel.remove();
        }
    } catch (error) {
        res.statusCode = INVALID_REQUEST_STATUS_CODE;
        res.send('Error getting teacher data');
    }
};
