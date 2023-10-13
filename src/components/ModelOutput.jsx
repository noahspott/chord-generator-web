import React from 'react'

export default function ModelOutput(props) {

    const chordsElement = props.modelChords.map((chord, index) => {
        return <div key={index} className="chord-card">{chord}</div>
    })

    return (
        <>
            <h2>AI Generated Chord Progression</h2>
            <div className="chord-container">
                {chordsElement}
            </div>
        </>
    )
}