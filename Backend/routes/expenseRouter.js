import express from "express";
import { addExpense, getCategoricalExpenses, deleteExpense, editExpense, getExpenses, getTotalExpense } from "../controllers/expense.js";

const expenseRouter = express.Router();

expenseRouter.get('/expenses', getExpenses);
expenseRouter.get('/category/expenses', getCategoricalExpenses);
expenseRouter.get('/total/expense', getTotalExpense);
expenseRouter.post('/expense/:id', addExpense);
expenseRouter.patch('/expense/:id', editExpense);
expenseRouter.delete('/expense/:id', deleteExpense);

export default expenseRouter;