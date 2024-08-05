import express from "express";
import { addUserIncome, getUserIncome, updateUserIncome } from "../controllers/IncomeController.js";

const incomeRouter = express.Router();

incomeRouter.get('/income/:id', getUserIncome);
incomeRouter.post('/income', addUserIncome);
incomeRouter.patch('/income/:id', updateUserIncome);

export default incomeRouter