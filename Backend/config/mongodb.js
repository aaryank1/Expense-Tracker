import mongoose, { connect } from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("Connection Established");
    }
    catch(error){
        console.log("Error connecting to the Database", error);
    }
}
export default connectDB;