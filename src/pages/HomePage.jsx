import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'
import moment from 'moment'

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
      .where('active', '==', true)
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
    localStorage.setItem('name', name)
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
        console.log(user)
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
    <div className="wrapper">
      <NavBar />
      <main className="homepage-main">
        <section className="login">
          <section>
            <p>Please Sign Up or Log In</p>
            <div>
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
            </div>
          </section>
        </section>

        <section className="peek-jobs">
          <header>Check out these jobs!</header>
          {jobs.map((job) => {
            return (
              <section className="homepage-job">
                <p className="job-title-hp">{job.jobTitle}</p>
                <p className="company-name-hp">{job.companyName}</p>
                <p className="location-hp">{job.location}</p>
                <div>
                  <p className="salary-hp">{job.estimatedSalary}</p>
                  <p className="time-hp">{moment(job.timestamp).fromNow()}</p>
                </div>
              </section>
            )
          })}
          <p className="peek-jobs-msg">Sign Up or Log in to view more</p>
        </section>
      </main>
    </div>
  )
}

export default HomePage
