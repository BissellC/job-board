import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

import moment from 'moment'

const JobPage = (props) => {
  const [job, setJob] = useState({})
  const [user, setUser] = useState({})
  const [toggleApply, setToggleApply] = useState(true)
  const [appliedMessage, setAppliedMessage] = useState('')

  var functions = firebase.functions()

  const jobQuery = firebase
    .firestore()
    .collection('postings')
    .doc(props.match.params.id)

  //retrieve data by id
  const getJob = () => {
    jobQuery.get().then((job) => {
      if (job.exists) {
        setJob(job.data())
      } else {
        Promise.reject('Posting does not exist')
      }
    })
  }

  const getUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      }
    })
  }

  const applyEmail = () => {
    //add user email to job document
    jobQuery.update({
      appliedEmails: firebase.firestore.FieldValue.arrayUnion(user.email),
    })
    setAppliedMessage(
      'Thanks for applying ' +
        user.displayName +
        ', check your email to confirm application!'
    )
    //call cloud function
    if (toggleApply) {
      const callable = functions.httpsCallable('applyEmail')
      return callable({
        email: user.email,
        userName: user.displayName,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
      })
    }
    //prevents spam clicking of apply
    setToggleApply(false)
  }

  useEffect(() => {
    getJob()
    getUser()
  }, [])

  return (
    <>
      <NavBar />
      <main>
        <section className="job-info">
          <h1>{job.jobTitle}</h1>
          <h2>{job.companyName}</h2>
          <p>{job.companyAddress}</p>
          <p>Job type: {job.jobType}</p>
          <p>Estimated Salary: {job.estimatedSalary}</p>
          <p>{job.jobDescription}</p>
          <p>{moment(job.timestamp).fromNow()}</p>
        </section>
        <section className="apply">
          <button className="apply-button" onClick={() => applyEmail()}>
            Apply now
          </button>
          <p>{appliedMessage}</p>
        </section>
      </main>
    </>
  )
}

export default JobPage
