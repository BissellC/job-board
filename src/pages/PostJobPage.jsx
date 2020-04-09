import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../components/NavBar'
import firebase from '../firebase'

const PostJobPage = () => {
  const [jobTitle, setJobTitle] = useState()
  const [jobDescription, setJobDescription] = useState()
  const [companyName, setCompanyName] = useState()
  const [estSalary, setEstSalary] = useState()
  const [jobType, setJobType] = useState('full time')
  const [location, setLocation] = useState()
  const [id, setId] = useState()
  const [isJobPosted, setIsJobPosted] = useState(false)
  const [user, setUser] = useState({})

  const getUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      }
    })
  }

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
        location: location,
        estimatedSalary: estSalary,
        jobType: jobType,
        active: true,
        appliedEmails: [],
        timestamp: new Date().toISOString(),
        createdBy: user.email,
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

  useEffect(() => {
    getUser()
  }, [])

  return isJobPosted ? (
    <Redirect to={`/job/${id}`} />
  ) : (
    <>
      <NavBar />
      <main className="post-job-main">
        <h1>Make a job posting</h1>
        <form onSubmit={postJob}>
          <input
            placeholder="Job Title"
            onChange={(e) => setJobTitle(e.target.value)}
            required
          ></input>
          <textarea
            placeholder="Job Description"
            onChange={(e) => setJobDescription(e.target.value)}
            required
          ></textarea>
          <input
            placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
            required
          ></input>
          <input
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
            className="location"
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
