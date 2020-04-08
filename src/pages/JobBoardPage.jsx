import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'
import moment from 'moment'

const JobBoardPage = () => {
  const [jobs, setJobs] = useState([])
  const [newJobs, setNewJobs] = useState([])

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
  const getJobs = async () => {
    const jobs = []
    await firebase
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

    // awaits job fetch and shortens descriptions if they are too long
    const newJobs = jobs.map((job) => {
      if (job.jobDescription.length > 100) {
        const fixedDescription = {
          jobDescription: job.jobDescription.slice(0, 99) + '...',
        }
        console.log(job)
        return { ...job, ...fixedDescription }
      } else return { ...job }
    })
    setJobs(newJobs)
    console.log(jobs)
  }

  useEffect(() => {
    getJobs()
  }, [])

  return (
    <div className="job-board-wrapper">
      <NavBar />
      <Link className="post-job-button" to="/post-job">
        <p>Make a job posting</p>
      </Link>
      <main className="job-board-main">
        <section>
          {jobs.map((job) => {
            return (
              <Link to={`/job/${job.id}`}>
                <section>
                  <h2 className="job-title">{job.jobTitle}</h2>
                  <p className="company-name">{job.companyName}</p>
                  <p className="location">{job.location}</p>
                  <div>
                    <p className="description">{job.jobDescription}</p>
                    <p className="timestamp">
                      {moment(job.timestamp).fromNow()}
                    </p>
                  </div>
                </section>
              </Link>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default JobBoardPage
