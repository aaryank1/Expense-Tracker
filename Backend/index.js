import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

connectDB();


app.listen(port, () => {
    console.log(`Server is Live on Port ${port}`);
});