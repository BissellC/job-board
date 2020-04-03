import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../firebase'

const NavBar = (props) => {
  const [logOut, setLogOut] = useState(false)
  const [userStatus, setUserStatus] = useState('Log out')
  const signOut = (e) => {
    e.preventDefault()
    firebase.auth().signOut().then(setLogOut(true))
  }

  return logOut ? (
    <Redirect to={'/'} />
  ) : (
    <nav>
      <header>
        <h1>Job Tree</h1>
      </header>
      <div onClick={signOut}>{userStatus}</div>
    </nav>
  )
}

export default NavBar
