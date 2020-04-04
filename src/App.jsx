import React from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import JobBoardPage from './pages/JobBoardPage'
import PostJobPage from './pages/PostJobPage'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import JobPage from './pages/JobPage'
import firebase from './firebase'

/*firebase.firestore().collection('tests').add({
  userName: 'Bob',
  age: 42,
})*/

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route exact path="/job-board" component={JobBoardPage}></Route>
        <Route exact path="/job/:id" component={JobPage}></Route>
        <Route exact path="/post-job" component={PostJobPage}></Route>
        <Route path="*" component={NotFound}></Route>
      </Switch>
    </Router>
  )
}

export default App
