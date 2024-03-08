import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name must be provided"],
        minlength: [3, "Name must be atleast 3 characters long"],
        trim: true
    },
    email : {
        type : String,
        unique : true,
        required : [true, "Email must be provided"],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid Email"
        }
    }, 
    password : {
        type : String,
        trim: true,
        required : [true, "Password must be provided"],
        minlength : [5, "Password must be 5 characters long"]
    }
})

const User = mongoose.model("data", userSchema);

export default User;