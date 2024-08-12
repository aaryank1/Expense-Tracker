import incomeModel from "../models/incomeModel.js";
import mongoose from "mongoose";

const getUserIncome = async (req, res) => {
    const id = req.params.id;
    // const userId = new mongoose.Types.ObjectId(id);
    
    try {
        const getIncomeData = await incomeModel.findOne({userId: id});
        res.send(getIncomeData);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}


const addUserIncome = async (req, res) => {
    const userIncomeData = req.body;

    const userData = {
        userId: userIncomeData.userId,
        income: userIncomeData.income,
        startDate: userIncomeData.startDate
    }

    try {
        const addIncome = await incomeModel.create(userData);
        res.send(addIncome);
    } catch (error) {
        res.send(error);
    }
}

const updateUserIncome = async (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    try {
        const updateIncome = await incomeModel.findByIdAndUpdate({_id: id}, updates);
        res.send(updateIncome);
    } catch (error) {
        res.send(error)
    }
}

export { getUserIncome, addUserIncome, updateUserIncome }