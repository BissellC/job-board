import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

import moment from 'moment'

const JobPage = (props) => {
  const [job, setJob] = useState({})
  const [user, setUser] = useState({})
  const [toggleApply, setToggleApply] = useState(true)
  const [appliedMessage, setAppliedMessage] = useState('')
  const [removeMessage, setRemoveMessage] = useState('')
  const [appliedUsers, setAppliedUsers] = useState([])

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

  //Set posting to inactive if user created it
  const removePosting = () => {
    if (user.email == job.createdBy) {
      firebase
        .firestore()
        .collection('postings')
        .doc(props.match.params.id)
        .update({
          active: false,
        })
      setRemoveMessage('Posting has been deactivated')
    } else {
      setRemoveMessage(
        'You cannot delete this post because you did not create it'
      )
    }
  }

  //fetch emails of users who applied if you created it
  const getApplied = () => {
    if (user.email == job.createdBy) {
      setAppliedUsers(job.appliedEmails)
    }
  }

  useEffect(() => {
    getJob()
    getUser()
    getApplied()
  }, [])

  return (
    <>
      <NavBar />
      <main className="job-page-main">
        <section className="job-info">
          <h1>{job.jobTitle}</h1>
          <p className="description">{job.jobDescription}</p>
          <p>{job.companyName}</p>
          <p>{job.location}</p>
          <p>Job type: {job.jobType}</p>
          <p>Estimated Salary: {job.estimatedSalary}</p>
          <p>Posted {moment(job.timestamp).fromNow()}</p>
        </section>
        <div className="button-wrapper">
          <section className="apply">
            <button className="apply-button" onClick={() => applyEmail()}>
              Apply now
            </button>
            <p>{appliedMessage}</p>
          </section>
          <section className="remove">
            <button onClick={() => removePosting()}>Remove posting</button>
            <p>{removeMessage}</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default JobPage
