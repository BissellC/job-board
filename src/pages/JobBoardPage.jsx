import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

const JobBoardPage = () => {
  const [jobs, setJobs] = useState([])

  //Populates an array of jobs and sets it as state
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
        setJobs(jobs)
      })
  }

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
              <section>
                <h2>{job.jobTitle}</h2>
                <p className="company-name">{job.companyName}</p>
                <p>{job.jobDescription}</p>
              </section>
            )
          })}
        </section>
      </main>
    </>
  )
}

export default JobBoardPage
