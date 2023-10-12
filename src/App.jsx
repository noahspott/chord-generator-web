import { useState } from 'react'
import './App.css'
import UserInput from './components/UserInput'
import ModelOutput from './components/ModelOutput'
import axios from 'axios'

function App() {
  
  // userChords will be set in the UserInput component
  const [userChords, setUserChords] = useState([])
  const [modelChords, setModelChords] = useState([])

  function handleGenerate() {

    // make API call to get new chords
    axios.get('http://127.0.0.1:5000/random')
      .then(response => {
        console.log(response.data)
        setModelChords(response.data.chord_progression)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <>
      <h1>AI Chord Generator</h1>
      <div className="card">
        {/* <UserInput 
          userChords={userChords}
          setUserChords={setUserChords}
        /> */}
        <button onClick={handleGenerate}>Generate</button>
        <ModelOutput 
          modelChords={modelChords}
          setModelChords={setModelChords}
        />
      </div>
      
    </>
  )
}

export default App
