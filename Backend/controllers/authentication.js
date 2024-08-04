import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

const saltRounds = 10;

const addUser = async (req, res) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        let password = req.body.password;

        const checkUser = await userModel.findOne({username: username});
        const checkEmail = await userModel.findOne({email: email});
        if(checkUser){
            res.json({success: false, message:"This Username already exists. Please try using numbers and special characters."});
        }
        else if(checkEmail){
            res.json({success: false, message:"Email Already Exists. Try Logging In"});
        }
        else{
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if(err){
                    console.log("Error Hashing the Password");
                    res.json({success: false, message: "Error Hashing the Password"})
                }
                else{
                    password=hash;

                    const userData = {
                        username,
                        email,
                        password
                    }
                    const addUser = await userModel(userData);
                    await addUser.save();

                    const getUser = await userModel.findOne({username: username});
                    
                    res.json({success: true, message: "User added Successfully", username: username, userId: getUser._id}).status(201);
                }
            });
        }
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Error Registering User"});
    }
}

const loginUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const checkUser = await userModel.findOne({email: email});
        if(!checkUser){
            res.status(404).send("User Does not Exist. Check for Spelling Errors or Try Signing In");
        }
        else{
            const dbHashedPassword = checkUser.password;

            bcrypt.compare(password, dbHashedPassword, async (err, result) => {
                if(err){
                    res.json({success: false, message: "Error Comparing Password. Please Try Again"});
                }
                else{
                    if(result){
                        res.json({success: true, message: "Valid User", username: checkUser.username, userId: checkUser._id});
                    }
                    else{
                        res.json({success: false, message: "Incorrect Password. Please Try Again"});
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export {addUser, loginUser};