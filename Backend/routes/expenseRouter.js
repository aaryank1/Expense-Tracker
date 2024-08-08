import express from "express";
import { addExpense, getCategoricalExpenses, deleteExpense, editExpense, getExpenses } from "../controllers/expense.js";

const expenseRouter = express.Router();

expenseRouter.get('/expenses', getExpenses);
expenseRouter.get('/category/expenses', getCategoricalExpenses);
expenseRouter.post('/expense/:id', addExpense);
expenseRouter.patch('/expense/:id', editExpense);
expenseRouter.delete('/expense/:id', deleteExpense);

export default expenseRouter;