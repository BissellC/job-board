import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: 'AIzaSyBGQO7k6KY0xw7LaMdpMWbdHno0dX7yWUE',
  authDomain: 'job-board-60d33.firebaseapp.com',
  databaseURL: 'https://job-board-60d33.firebaseio.com',
  projectId: 'job-board-60d33',
  storageBucket: 'job-board-60d33.appspot.com',
  messagingSenderId: '685552334982',
  appId: '1:685552334982:web:b8cb4f32af983a59357907',
  measurementId: 'G-Q05FGFV6YG',
}

firebase.initializeApp(firebaseConfig)

export default firebase
