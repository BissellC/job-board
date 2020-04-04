import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

const JobPage = (props) => {
  const [job, setJob] = useState({})

  //retrieve data by id
  const getJob = () => {
    firebase
      .firestore()
      .collection('postings')
      .doc(props.match.params.id)
      .get()
      .then((job) => {
        if (job.exists) {
          setJob(job.data())
        } else {
          Promise.reject('Posting does not exist')
        }
      })
  }

  useEffect(() => {
    getJob()
  }, [])

  return (
    <>
      <NavBar />
      <main>
        <h1>{job.jobTitle}</h1>
        <h2>{job.companyName}</h2>
        <p>{job.companyAddress}</p>
        <p>Job type: {job.jobType}</p>
        <p>Estimated Salary: {job.estimatedSalary}</p>
        <p>{job.jobDescription}</p>
      </main>
    </>
  )
}

export default JobPage
