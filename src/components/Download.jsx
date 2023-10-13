import React from 'react'
import MidiWriter from 'midi-writer-js'
import { Chord } from 'tonal'

export default function Download(props) {

    const chordDuration = "1n"
    const chordRegisterValue = "4"

    function onDownloadClick(){
        const midiTrack = convertChordsToMidiTrack(props.modelChords)
        downloadMidi(midiTrack)
    }

    function convertChordsToMidiTrack(chords) {

        // Convert array of strings to array of Tonal Chords
        // This will allow us to get the individual notes of the chords
        const tonalChords = chords.map(chord => {
            return Chord.get(chord)
        })
        
        // Collect note names from Tonal Chords
        // In the future, this could be where we'll want to play with inversions / chord voicing
        const chordNoteNames = []
        tonalChords.forEach(chord => {
            // Append chord register value to each note value (ex: "A" + "4")
            chordNoteNames.push(chord.notes.map(note => {
                return note + chordRegisterValue
            }))
        })

        // For each tonal chord, add a note event to the midi track
        const track = new MidiWriter.Track()
        chordNoteNames.forEach(chord => {
            track.addEvent(
                new MidiWriter.NoteEvent({pitch: chord, duration: chordDuration})
            ), () => {
                return {sequential: false}
            }
        })

        return track
    }

    function downloadMidi(midiTrack) {

        // Create URI from midi track
        const write = new MidiWriter.Writer(midiTrack)
        const midiDataUri = write.dataUri()
        console.log(midiDataUri)

        // For automatic download
        const link = document.createElement("a")
        link.href = midiDataUri
        link.download = "output.midi"
        link.click()
    }
    
    return(
        <div>
            <button className="button-hollow" onClick={onDownloadClick}>Download MIDI</button>
        </div>
    )
}