import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
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
        <Link to="/">
          <h1>Job Tree</h1>
        </Link>
      </header>
      <div onClick={signOut}>{userStatus}</div>
    </nav>
  )
}

export default NavBar
