import React, { useRef, useState } from 'react'
import "./Forms.css"
import axiosInstance from '../api/apiCalls';
import Profile from './Profile';

const Forms = () => {
    const [submitted, setSubmitted] = useState(false);
    const username = useRef("");
    const [showRegisterForm, setShowRegisterForm] = useState(true);
    const [showForgotPassForm, setShowForgotPassForm] = useState(false);

    // Regsiter Form Related Stuff:
    const [registerFormData, setRegisterFormData] = useState({
        username: "",
        email: "",
        password: "",
        confPassword: "",
    })
    const [registerFormError, setRegisterFormError] = useState({
        usernameError: "",
        emailError: "",
        passwordError: "",
    });
    const submitRegisterForm = (e) => {
        e.preventDefault();
        console.log(registerFormData);
        axiosInstance.post("/register", registerFormData)
            .then(response => {
                localStorage.setItem("banao", JSON.stringify(response.data.username))
                console.log(response.data);
                username.current = response.data.username;
                setSubmitted(true);
            })
            .catch(err => {
                console.log(err);
                // console.log(err.response.data.errorMessage.username);
                const error = err.response.data.errorMessage;
                console.log(error);
                setRegisterFormError({
                    usernameError: error.username,
                    emailError: error.email,
                    passwordError: error.password
                });
                console.log("Error Message", registerFormError);
            })
    }
    const collectRegisterFormData = (e) => {
        setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value })
    }


    // Login Form Related Stuff:
    const [loginFormData, setLoginFormData] = useState({
        username: "",
        password: "",
    })
    const [loginFormError, setLoginFormError] = useState("");
    const submitLoginForm = (e) => {
        e.preventDefault();
        console.log(loginFormData);
        axiosInstance.post("/login", loginFormData)
            .then(response => {
                localStorage.setItem("banao", JSON.stringify(response.data.username))
                console.log(response.data);
                username.current = response.data.username;
                setSubmitted(true);
            })
            .catch(err => {
                console.log(err);
                console.log(err.response.data);
                setLoginFormError(err.response.data.errorMessage.signInErr);
            })
    }
    const collectLoginFormData = (e) => {
        setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
    }

    // Forgot Password Form Related Stuff:
    const [forgotPassFormData, setForgotPassFormData] = useState({
        email: ""
    })
    const [responseData, setResponseData] = useState(""); // to show whether email is registered and if yes than whether recovery mail sent
    const submitForgotPassForm = (e) => {
        e.preventDefault();
        axiosInstance.post("/forgotPassword", forgotPassFormData)
            .then(response => {
                setResponseData(response.data.message)
            })
            .catch(err => {
                // console.log(err);
                setResponseData(err.response.data.errorMessage.unregisteredEmail)
            })
        console.log(forgotPassFormData);
    }
    const collectForgotPassFormData = (e) => {
        setForgotPassFormData({ ...forgotPassFormData, [e.target.name]: e.target.value })
    }

    return (
        <>
            {
                !submitted ? (
                    <div className='formContainer'>
                        {
                            !showForgotPassForm ? (
                                showRegisterForm ? (
                                    <div className="registerForm">
                                        <h3> Register Here </h3>
                                        <form onSubmit={submitRegisterForm}>
                                            <div className="field">
                                                <input
                                                    type="text"
                                                    name='username'
                                                    value={registerFormData.username}
                                                    onChange={collectRegisterFormData}
                                                    placeholder='Enter Username'
                                                />
                                                <p className='errorMessage'> {registerFormError.usernameError} </p>
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="email"
                                                    name='email'
                                                    value={registerFormData.email}
                                                    onChange={collectRegisterFormData}
                                                    placeholder='Enter Email'
                                                />
                                                <p className='errorMessage'> {registerFormError.emailError} </p>
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="password"
                                                    name='password'
                                                    value={registerFormData.password}
                                                    onChange={collectRegisterFormData}
                                                    placeholder='Enter Password'
                                                />
                                                <p className='errorMessage'> {registerFormError.passwordError} </p>
                                            </div>
                                            <div className="field">
                                                <input
                                                    type="password"
                                                    name='confPassword'
                                                    value={registerFormData.confPassword}
                                                    onChange={collectRegisterFormData}
                                                    placeholder='Confirm Password'
                                                />
                                                <p className='errorMessage'> {registerFormError.passwordError === "Passwords do not match" ? registerFormError.passwordError : ""} </p>
                                            </div>
                                            <input type="submit" value="Register" />
                                        </form>
                                        <p className='redirector'>Already A Member? <button onClick={() => setShowRegisterForm(prevState => !prevState)}> Click To Login </button> </p>
                                    </div>
                                ) : (<div className="loginForm">
                                    <h3> Login Here </h3>
                                    <p className='errorMessage'> {loginFormError} </p>
                                    <form onSubmit={submitLoginForm}>
                                        <div className="field">
                                            <input
                                                type="text"
                                                name="username"
                                                value={loginFormData.username}
                                                onChange={collectLoginFormData}
                                                placeholder='Enter Username'
                                            />
                                        </div>
                                        <div className="field">
                                            <input
                                                type="password"
                                                name="password"
                                                value={loginFormData.password}
                                                onChange={collectLoginFormData}
                                                placeholder='Enter Password'
                                            />
                                        </div>
                                        <input type="submit" value="Login" />
                                    </form>
                                    <p className='redirector'>New Here ? <button onClick={() => setShowRegisterForm(prevState => !prevState)}> Click To Register </button> </p>
                                    <button className='forgotPasswordBtn' onClick={() => setShowForgotPassForm(prevState => !prevState)}> Forgot Password </button>
                                </div>)
                            ) : (
                                <div className="forgotPassword">
                                    <p className='message'
                                        style={responseData === "Email Not Registered" ?
                                            { color: "red" } : { color: "green" }}
                                    > {responseData} </p>
                                    <form onSubmit={submitForgotPassForm}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={forgotPassFormData.email}
                                            onChange={collectForgotPassFormData}
                                            placeholder='Enter Registered Email' />
                                        <input type="submit" value="Get Recovery Mail" />
                                    </form>
                                    <button className='redirector' onClick={() => {
                                        setShowForgotPassForm(prevState => !prevState)
                                        setShowRegisterForm(false)
                                    }}>Click to login</button>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <Profile username={username.current} />
                )
            }
        </>
    )
}

export default Forms