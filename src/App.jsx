import { useState } from 'react'
import axios from 'axios'

// Components
import Download from './components/Download'
import UserInput from './components/UserInput'
import ModelOutput from './components/ModelOutput'

function App() {

  const serverUrl = 'http://127.0.0.1:5000'
  const randomEndPoint = '/random'
  
  const [userChords, setUserChords] = useState([])
  const [modelChords, setModelChords] = useState([])

  function getChords() {
    // make API call to get new chords
    axios.get(serverUrl + randomEndPoint)
      .then(response => {
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
        <ModelOutput 
          modelChords={modelChords}
          setModelChords={setModelChords}
        />
        <button onClick={getChords}>Generate</button>
      </div>
      <div className="card">
        <Download 
          modelChords={modelChords}
        />
      </div>
    </>
  )
}

export default App
