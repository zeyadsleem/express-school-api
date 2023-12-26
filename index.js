import express from 'express';
import mongoose from 'mongoose';
import teacherRouter from './routes/teacher.js';
import studentRouter from './routes/student.js';
import { undefinedRequestMiddleware } from './middlewares/undefinedRequest.js';
import env from 'dotenv';


env.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const DATABASE_URL = process.env.NODE_ENV === 'production' ? process.env.PROD_DATABASE_URL : process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
});

app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);

app.use(undefinedRequestMiddleware);

app.listen(3000, () => console.log('Server is running on port 3000...'));

