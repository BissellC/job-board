import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

const HomePage = () => {
  const [signUpEmail, setSignUpEmail] = useState()
  const [signUpPassword, setSignUpPassword] = useState()
  const [loginEmail, setLoginEmail] = useState()
  const [loginPassword, setLoginPassword] = useState()
  const [authStatus, setAuthStatus] = useState(false)

  const handleSignUp = (e) => {
    e.preventDefault()
    firebase
      .auth()
      .createUserWithEmailAndPassword(signUpEmail, signUpPassword)
      .catch(function (error) {
        let errorCode = error.code
        let errorMessage = error.message
      })
      .then((cred) => {
        console.log(cred)
      })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    firebase
      .auth()
      .signInWithEmailAndPassword(loginEmail, loginPassword)
      .catch(function (error) {
        let errorCode = error.code
        let errorMessage = error.message
      })
      .then(function () {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('logged in')
          }
        })
      })
  }
  const checkAuthState = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthStatus(true)
      } else {
        setAuthStatus(false)
      }
    })
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  return authStatus ? (
    <Redirect to={'/page'} />
  ) : (
    <>
      <NavBar />
      <main>
        <section className="login">
          <p>Please Sign Up or Log In</p>
          <section>
            <form onSubmit={handleSignUp}>
              Sign up
              <input
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="Email"
              ></input>
              <input
                type="password"
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Password"
              ></input>
              <button>Sign Up</button>
            </form>

            <form onSubmit={handleLogin}>
              Log in
              <input
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
              ></input>
              <input
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
              ></input>
              <button>Log in</button>
            </form>
          </section>
        </section>
      </main>
    </>
  )
}

export default HomePage
