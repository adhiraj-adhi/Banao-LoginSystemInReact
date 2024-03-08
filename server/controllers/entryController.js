// This controller contains controller related to login and registration stuffs
import User from "../db/models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Handling validation and errors:-
let errorMessage = {
    username: "",
    email: "",
    password: "",
    signInErr: "",
    unregisteredEmail: ""
}

function refresher() {
    errorMessage = {
        username: "",
        email: "",
        password: "",
        signInErr: "",
        unregisteredEmail: "",
        errorDuringPassRecovery:""
    }
}
const handleErrors = (error) => {
    refresher();
    if (error.message.includes('data validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {
            errorMessage[properties.path] = properties.message;
        })
    }
    if (error.message === 'Passwords do not match') {
        errorMessage.password = "Passwords do not match";
    }
    if (error.code === 11000) {
        errorMessage.email = 'Email Already Registered'
    }
    if (error.message === 'Invalid Credentials') {
        errorMessage.signInErr = 'Invalid Credentials'
    }
    if (error.message === 'Email Not Registered') {
        errorMessage.unregisteredEmail = 'Email Not Registered'
    }
    if( error.message === 'Link Has Been Tampered'){
        errorMessage.errorDuringPassRecovery = 'Link Has Been Tampered or Expired';
    }

    return errorMessage;
}




export const CreateUser = async (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }

    try {
        if (req.body.password === req.body.confPassword) {
            const result = await User.create(user);
            if (result) {
                res.status(201).json({
                    username: result.username,
                    email: result.email,
                });
            }
        } else {
            throw new Error("Passwords do not match");
        }
    } catch (error) {
        const errorMessage = handleErrors(error);
        res.status(500).json({ errorMessage })
    }
}


export const LoginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            if (user.password === req.body.password) {
                const token = jwt.sign({ id: user._id }, process.env.Secret_Key);
                console.log(token);
                res.status(200).json({
                    username: user.username,
                    email: user.email,
                    token: token
                })
            } else {
                throw new Error('Invalid Credentials');
            }
        } else {
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        const errorMessage = handleErrors(error);
        res.status(500).json({ errorMessage })
    }
}

export const ForgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            // sending email code:
            sendEmail(user._id, user.email, user.username)
            res.status(200).json({ message: "We sent you a recovery email" })
        } else {
            throw new Error("Email Not Registered");
        }
    } catch (error) {
        const errorMessage = handleErrors(error);
        res.status(500).json({ errorMessage });
    }
}


// function to send Verification Email 
const sendEmail = (id, email, name) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.Email,
            pass: process.env.Pass
        },
    });

    const token = jwt.sign({ id }, process.env.VERIFY_EMAIL, { expiresIn: '7m' })

    const mailOptions = {
        from: process.env.Email,
        to: email,
        subject: 'Verification Email',
        html: `<p> Hello ${name}, to verify your email please click on <a href="http://localhost:5173/recoverPassword/${token}">Verify</a></p>`
        // html: `<p> Hello ${name}, to verify your email please click on <a href="http://localhost:5173/recoverPassword">Verify</a></p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent" + info.response);
        }
    });
}

export const ChangePassword = async (req, res) => {
    try {
        const data = req.body.passwordData;
        if (data.password === data.confPassword) {
            let id;
            jwt.verify(req.body.token, process.env.VERIFY_EMAIL, (err, decoded) => {
                if (err) {
                    throw new Error("Link Has Been Tampered")
                }
                // If verification is successful, 'decoded' will contain the payload
                id = decoded.id;
            })
            const result = await User.findByIdAndUpdate(id, { password:data.password})
            if(result){
                res.status(200).json({message: "Updation Success"})
            }
        } else {
            throw new Error("Passwords do not match")
        }
    } catch (error) {
        const errorMessage = handleErrors(error);
        res.status(500).json({ errorMessage })
    }
}