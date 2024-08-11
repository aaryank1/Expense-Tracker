import mongoose from "mongoose";
import expenseModel from "../models/expenseModel.js";


const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
};

const startOfMonth = getStartOfMonth();
const endOfMonth = getEndOfMonth();

const getExpenses = async (req, res)=>{
    const { userId } = req.query;
    try {
        const expenses = await expenseModel.find({userId: userId,
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        
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
        { $match : { userId: objectId,
            createdAt:{
                $gte: startOfMonth,
                $lte: endOfMonth
            }
         }},
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

const getTotalExpense = async (req, res) => {
    const { userId } = req.query;
    let objectId = new mongoose.Types.ObjectId(userId);
    try{
        const result = await expenseModel.aggregate([
            { $match: { userId: objectId, 
                createdAt:{
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
             }},
            { $group: {
                _id: "$userId",
                totalExpense: { $sum: "$amount" }
            }}
        ]);
        res.send(result);
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

export {getExpenses, getCategoricalExpenses, getTotalExpense, addExpense, editExpense, deleteExpense}