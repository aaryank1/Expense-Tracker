import express from "express";
import { addExpense, deleteExpense, editExpense, getExpenses } from "../controllers/expense.js";

const expenseRouter = express.Router();

expenseRouter.get('/expenses', getExpenses);
expenseRouter.post('/expense/:id', addExpense);
expenseRouter.patch('/expense/:id', editExpense);
expenseRouter.delete('/expense/:id', deleteExpense);

export default expenseRouter;