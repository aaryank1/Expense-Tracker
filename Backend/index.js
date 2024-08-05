import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';
import bodyParser from 'body-parser';
import userRouter from './routes/authRoutes.js';
import expenseRouter from './routes/expenseRouter.js';
import incomeRouter from './routes/incomeRouter.js';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
connectDB();
app.use("/user", userRouter)            // .post('/user/register') OR .post('/user/login')
app.use("/spendwise", expenseRouter)    // .get('/spendwise/expenses) , .post('/spendwise/expense) , .put('/spendwise/expense) , .delete('/spendwise/expense)
app.use("/user", incomeRouter)

app.listen(port, () => {
    console.log(`Server is Live on Port ${port}`);
});