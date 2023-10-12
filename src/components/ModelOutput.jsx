import React from 'react'

export default function ModelOutput(props) {
    return (
        <>
            <h2>Random Chord Progression</h2>
            <p>{props.modelChords}</p>
        </>
    )
}