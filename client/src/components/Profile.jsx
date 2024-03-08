import React from 'react'

const Profile = (props) => {
  return (
    <div>
        <h3 style={{color: "green"}}> Welcome {props.username} </h3>
        {/* Or, we can even get using
        <h3 style={{color: "green"}}> Welcome {localStorage.getItem("banao")} </h3> */}
    </div>
  )
}

export default Profile