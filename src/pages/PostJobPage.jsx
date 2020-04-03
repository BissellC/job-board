import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

const PostJobPage = () => {
  const [jobTitle, setJobTitle] = useState()
  const [jobDescription, setJobDescription] = useState()
  const [companyName, setCompanyName] = useState()
  const [companyAddress, setCompanyAddress] = useState()
  const [estSalary, setEstSalary] = useState()
  const [id, setId] = useState()
  const [isJobPosted, setIsJobPosted] = useState(false)

  console.log(isJobPosted)
  console.log(id)

  const postJob = (e) => {
    e.preventDefault()

    firebase
      .firestore()
      .collection('postings')
      .add({
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        companyName: companyName,
        companyAddress: companyAddress,
        estimatedSalary: estSalary,
        timestamp: new Date().toISOString(),
      })
      .then((post) => {
        console.log(post)

        if (post) {
          setId(post.id)
        }
      })
  }

  useEffect(() => {
    if (id) {
      setIsJobPosted(true)
    }
  }, [id])

  return isJobPosted ? (
    <Redirect to={`/job-board/${id}`} />
  ) : (
    <>
      <NavBar />
      <main>
        <h1>Make a job posting</h1>
        <form onSubmit={postJob}>
          <input
            placeholder="Job Title"
            onChange={(e) => setJobTitle(e.target.value)}
          ></input>
          <input
            placeholder="Job Description"
            onChange={(e) => setJobDescription(e.target.value)}
          ></input>
          <input
            placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
          ></input>
          <input
            placeholder="Company Address"
            onChange={(e) => setCompanyAddress(e.target.value)}
          ></input>
          <input
            placeholder="Estimated Salary"
            onChange={(e) => setEstSalary(e.target.value)}
          ></input>
          <button>Post Job</button>
        </form>
      </main>
    </>
  )
}

export default PostJobPage
