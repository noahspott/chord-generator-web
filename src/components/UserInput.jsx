import React from 'react'

export default function UserInput(props) {

    function handleForm(event) {
        props.setUserChords(event.target.value)
    }

    return(
        <>
            <form action="">
                <textarea 
                    name="userChords" 
                    placeholder="Write chords here."
                    onChange={handleForm}
                />
            </form>
            {/* Simple display of chords for user */}
            <p>{props.userChords == "" ? "CHORD DISPLAY" : props.userChords}</p>
        </>
    )
}