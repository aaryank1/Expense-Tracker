import expenseModel from "../models/expenseModel.js";

const getExpenses = async (req, res)=>{
    const { userId } = req.body;
    try {
        const expenses = await expenseModel.find({userId: userId});
    res.send(expenses);
    } catch (error) {
        res.send(error)
    }
}

const addExpense = async (req, res)=>{
    const userExpense = req.body;
    try{
        const addExpense = await expenseModel(userExpense);
        await addExpense.save();

        res.send("Expense Added Successfully");
    }
    catch(error){
        res.send(error);
    }
}

export {getExpenses, addExpense}