import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import "./Forms.css"
import axiosInstance from '../api/apiCalls';

const RecoverPassword = () => {
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confPassword: ""
  })

  const [errorMessages, setErrorMessages] = useState({
    passwordError:"",
    linkError: ""
  })

  const collectPasswordData = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const { token } = useParams();
  function handleSubmit(e) {
    e.preventDefault();
    console.log(passwordData);
    axiosInstance.post("/changePassword", {passwordData: passwordData, token: token})
      .then(response => setIsPasswordUpdated(true))
      .catch(err => {
        if(err.response.data.errorMessage.password==="Passwords do not match"){
          setErrorMessages({...errorMessages, passwordError:"Passwords do not match"})
        } else {
          setErrorMessages({...errorMessages, linkError:err.response.data.errorMessage.errorDuringPassRecovery})
          setIsPasswordUpdated(true);
        }
      })
  }


  return (
    <>
      {
        !isPasswordUpdated ? (
          <div className='recoverPasswordForm'>
            <p className='errorMessage'> {errorMessages.passwordError} </p>
            <form onSubmit={handleSubmit}>
              <input
                type='password'
                name="password"
                value={passwordData.password}
                onChange={collectPasswordData}
                placeholder='Enter New Password'
              />
              <input
                type="password"
                name='confPassword'
                value={passwordData.confPassword}
                onChange={collectPasswordData}
                placeholder='Confirm New Password'
              />
              <input type="submit" value="Change Password" />
            </form>
          </div>
        ) : (
          <p style={errorMessages.linkError ? {color: "red"} : { color: "green", fontSize: "1rem" }}>{
            errorMessages.linkError ? errorMessages.linkError : "Password Updated Successfully...👍"
          }</p>
        )
      }
    </>
  )
}

export default RecoverPassword