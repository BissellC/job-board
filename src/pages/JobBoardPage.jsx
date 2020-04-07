import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'
import moment from 'moment'

const JobBoardPage = () => {
  const [jobs, setJobs] = useState([])

  //workaround to update user on signup
  const name = localStorage.getItem('name')
  const updateUser = () => {
    if (name) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.updateProfile({ displayName: name })
        }
      })
    }
  }

  //Populates an array of jobs and sets it as state
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
        setJobs(jobs)
      })
  }

  console.log(jobs)
  console.log(firebase.auth().currentUser)

  useEffect(() => {
    getJobs()
    updateUser()
  }, [])

  return (
    <>
      <NavBar />
      <Link to="/post-job">
        <p>Make a job posting</p>
      </Link>
      <main>
        <section>
          {jobs.map((job) => {
            return (
              <Link to={`/job/${job.id}`}>
                <section>
                  <h2>{job.jobTitle}</h2>
                  <p className="company-name">{job.companyName}</p>
                  <p>{job.jobDescription}</p>
                  <p>{moment(job.timestamp).fromNow()}</p>
                </section>
              </Link>
            )
          })}
        </section>
      </main>
    </>
  )
}

export default JobBoardPage