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
  const [jobType, setJobType] = useState()
  const [id, setId] = useState()
  const [isJobPosted, setIsJobPosted] = useState(false)

  const postJob = (e) => {
    e.preventDefault()

    firebase
      .firestore()
      .collection('postings')
      .add({
        id: '',
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        companyName: companyName,
        companyAddress: companyAddress,
        estimatedSalary: estSalary,
        jobType: jobType,
        timestamp: new Date().toISOString(),
      })
      .then((post) => {
        if (post) {
          //update object's id for linking to job page on the job board
          firebase.firestore().collection('postings').doc(post.id).update({
            id: post.id,
          })
          setId(post.id)
        }
      })
  }
  //When Job is posted redirect to the posting
  useEffect(() => {
    if (id) {
      setIsJobPosted(true)
    }
  }, [id])

  return isJobPosted ? (
    <Redirect to={`/job/${id}`} />
  ) : (
    <>
      <NavBar />
      <main>
        <h1>Make a job posting</h1>
        <form onSubmit={postJob}>
          <input
            placeholder="Job Title"
            onChange={(e) => setJobTitle(e.target.value)}
            required
          ></input>
          <input
            placeholder="Job Description"
            onChange={(e) => setJobDescription(e.target.value)}
            required
          ></input>
          <input
            placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
            required
          ></input>
          <input
            placeholder="Company Address"
            onChange={(e) => setCompanyAddress(e.target.value)}
            required
          ></input>
          <select
            placeholder="Job Type"
            onChange={(e) => setJobType(e.target.value)}
            required
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
          </select>
          <input
            placeholder="Estimated Salary"
            onChange={(e) => setEstSalary(e.target.value)}
            required
          ></input>
          <button>Post Job</button>
        </form>
      </main>
    </>
  )
}

export default PostJobPage
