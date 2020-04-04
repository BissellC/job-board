import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'
import moment from 'moment'

const JobBoardPage = () => {
  const [jobs, setJobs] = useState([])

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

  useEffect(() => {
    getJobs()
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
