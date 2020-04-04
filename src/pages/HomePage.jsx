import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

const HomePage = () => {
  const [signUpEmail, setSignUpEmail] = useState()
  const [signUpPassword, setSignUpPassword] = useState()
  const [loginEmail, setLoginEmail] = useState()
  const [loginPassword, setLoginPassword] = useState()
  const [name, setName] = useState()
  const [phone, setPhone] = useState()
  const [authStatus, setAuthStatus] = useState()
  const [jobs, setJobs] = useState([])

  //Populates an array of jobs and sets the first 5 as state
  const getJobs = () => {
    const jobs = []
    firebase
      .firestore()
      .collection('postings')
      .get()
      .then((postings) => {
        postings.forEach((job) => {
          jobs.push(job.data())
        })
        setJobs(jobs.slice(0, 4))
      })
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    firebase
      .firestore()
      .collection('users')
      .add({
        name: name,
        phone: phone,
        email: signUpEmail,
        timestamp: Math.round(new Date().getTime() / 1000),
      })
      .then(
        firebase
          .auth()
          .createUserWithEmailAndPassword(signUpEmail, signUpPassword)
      )
  }

  const handleLogin = (e) => {
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
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
    setAuthStatus(false)
    checkAuthState()
    getJobs()
  }, [])

  return authStatus ? (
    <Redirect to={'/job-board'} />
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              ></input>
              <input
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
              ></input>
              <input
                type="email"
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="Email"
                required
              ></input>
              <input
                type="password"
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Password"
                required
              ></input>
              <button>Sign Up</button>
            </form>

            <form onSubmit={handleLogin}>
              Log in
              <input
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
                required
              ></input>
              <input
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                required
              ></input>
              <button>Log in</button>
            </form>
          </section>
        </section>

        <section className="peek-jobs">
          <p>Check out these jobs!</p>
          {jobs.map((job) => {
            return (
              <section className="homepage-job">
                <h2>{job.jobTitle}</h2>
                <p>{job.companyName}</p>
                <p>{job.estimatedSalary}</p>
              </section>
            )
          })}
        </section>
      </main>
    </>
  )
}

export default HomePage
