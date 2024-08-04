import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: {type: String, required:true},
    category: {type: String, required:true},
    amount: {type: Number, required:true},
},
{
    timestamps: true,
})

const expenseModel = mongoose.model('expense', expenseSchema);

export default expenseModel;