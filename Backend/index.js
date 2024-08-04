import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';
import bodyParser from 'body-parser';
import userRouter from './routes/authRoutes.js';
import homeRouter from './routes/homeRouter.js';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(bodyParser.urlencoded({extended:true}));
connectDB();
app.use("/user", userRouter)                // .post('/user/register') OR .post('/user/login')
app.use("/spendwise", homeRouter)           // .get('/spendwise/expenses) OR .post('/spendwise/expense)

app.listen(port, () => {
    console.log(`Server is Live on Port ${port}`);
});