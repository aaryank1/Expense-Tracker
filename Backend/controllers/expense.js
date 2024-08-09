import mongoose from "mongoose";
import expenseModel from "../models/expenseModel.js";

const getExpenses = async (req, res)=>{
    const { userId } = req.query;
    try {
        const expenses = await expenseModel.find({userId: userId});
        
        res.send(expenses);
    } catch (error) {
        res.send(error)
    }
}

const getCategoricalExpenses = async (req, res) =>{
    const { userId } = req.query;
    let objectId;
    try {
        objectId = new mongoose.Types.ObjectId(userId);
      const results = await expenseModel.aggregate([
        { $match : { userId: objectId }},
        { $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" }
        }}
      ]);

      res.send(results);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Server Error'});
    }
}

const addExpense = async (req, res)=>{
    const userId = req.params.id
    const userExpense = req.body;

    const expenseData = {
        userId: userId,
        title: userExpense.title,
        category: userExpense.category,
        amount: userExpense.amount
    }

    try{
        const addExpense = await expenseModel(expenseData);
        await addExpense.save();

        res.send("Expense Added Successfully");
    }
    catch(error){
        res.send(error);
    }
}

const editExpense = async (req, res) => {
    const expenseId = req.params.id;
    const updates = req.body;

    try {
        const updateExpense = await expenseModel.findByIdAndUpdate({_id: expenseId}, updates, {new: true});

        if(!updateExpense){
            return res.send("No user found");
        }

        res.send(updateExpense);
    } catch (error) {
        console.log(error);
    }
}

const deleteExpense = async (req, res) => {
    const expenseId = req.params.id;

    try {
        const deleteExpense = await expenseModel.findByIdAndDelete({_id: expenseId})
        if(!deleteExpense){
            return res.send("No such expense");
        }

        res.send(deleteExpense);
    } catch (error) {
        console.log(error);
    }
}

export {getExpenses, getCategoricalExpenses, addExpense, editExpense, deleteExpense}