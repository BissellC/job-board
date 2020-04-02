import React from 'react'
import firebase from '../firebase'

const NavBar = () => {
  const signOut = (e) => {
    e.preventDefault()
    firebase.auth().signOut()
  }

  return (
    <nav>
      <header>
        <h1>Job Tree</h1>
      </header>
      <div onClick={signOut}>Log out</div>
    </nav>
  )
}

export default NavBar
