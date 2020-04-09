import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import firebase from '../firebase'
import tree from '../images/tree-icon.png'

const NavBar = (props) => {
  const [logOut, setLogOut] = useState(false)

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
          <img src={tree}></img>
          <h1>Job Tree</h1>
        </Link>
      </header>
      <div onClick={signOut}>Log Out</div>
    </nav>
  )
}

export default NavBar
