import express from "express";
import { addExpense, getExpenses } from "../controllers/expense.js";

const homeRouter = express.Router();

homeRouter.get('/expenses', getExpenses)
homeRouter.post('/expense', addExpense);

export default homeRouter;