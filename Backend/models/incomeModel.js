import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    income: {type: Number, required: true},
    startDate: {type: Date, required: true},
});

const incomeModel = mongoose.model('income', incomeSchema);

export default incomeModel;