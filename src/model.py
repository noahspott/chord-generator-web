import re
import numpy as np
import tensorflow as tf
from typing import List

path_to_file = './assets/musicxml_all_keys.txt'
text = open(path_to_file, 'r').read()
songs = text.splitlines()
chords_per_song = [re.findall(r"'(.*?)'", song) for song in songs]
vocab = sorted(set(chord for song in chords_per_song for chord in song))
vocab_with_pad = vocab + ['<PAD>']
char2idx = {u: i for i, u in enumerate(vocab_with_pad)}
idx2char = np.array(vocab_with_pad)
chords_as_int = [[char2idx[chord] for chord in song_chords] for song_chords in chords_per_song]

X_data = []
y_data = []

for song in chords_as_int:
    for window_size in range(2, len(song) + 1):  # Start with a window of size 2 and increase
        for i in range(len(song) - window_size + 1):
            X_data.append(song[i:i + window_size - 1])
            y_data.append(song[i + window_size - 1])

# Padding the sequences so they have the same length
X_data = tf.keras.preprocessing.sequence.pad_sequences(X_data, padding='post', value=char2idx['<PAD>'])

# Converting the targets to numpy array
y_data = np.array(y_data)

# Load model
from tensorflow.keras.models import load_model

model_path = "./models/chord_generator_all_keys_2023_10_17_bi-directional"
model = load_model(model_path)

# Helper function for generate_sequence
def predict_chord(sequence, temperature=0.8):
    sequence_as_int = [char2idx[chord] for chord in sequence]
    input_data = tf.keras.preprocessing.sequence.pad_sequences([sequence_as_int], padding='post', maxlen=X_data.shape[1], value=char2idx['<PAD>'])
    prediction = model.predict(input_data)[0]

    # Apply temperature scaling to the prediction
    prediction = np.log(prediction) / temperature
    exp_preds = np.exp(prediction)
    prediction = exp_preds / np.sum(exp_preds)

    # Sample from the prediction distribution
    predicted_idx = np.random.choice(len(prediction), p=prediction)

    return idx2char[predicted_idx]

# Generates a sequence of chords and returns it as a List[str]
def generate_sequence(seed_chords, sequence_length) -> List[str]:
    generated_sequence = seed_chords.copy()

    for _ in range(sequence_length - len(seed_chords)):
        next_chord = predict_chord(generated_sequence[-X_data.shape[1]:])  # Call predict_chord
        generated_sequence.append(next_chord)

    return generated_sequence

# from music21 import stream, chord, harmony, metadata, volume

# def generate_midi_from_chords(chord_list, filename):
#     # Create a stream for chords
#     chord_stream = stream.Stream()

#     # Set some metadata (optional)
#     m = metadata.Metadata()
#     m.title = "Generated Chord Sequence"
#     m.composer = "JazzGenius9000"
#     chord_stream.metadata = m

#     # Define the volume level
#     desired_velocity = 32  # MIDI velocity range is 0-127. 64 is 50% of the maximum velocity.

#     # Add chords to the stream
#     for ch_symbol in chord_list:
#         # Convert chord symbol to chord object
#         ch = harmony.ChordSymbol(ch_symbol)
#         c = ch.pitches
#         chord_obj = chord.Chord(c)

#         # Set the volume/velocity for each note in the chord
#         for note in chord_obj:
#             note.volume = volume.Volume(velocity=desired_velocity)

#         # Transpose the chord up an octave
#         chord_obj = chord_obj.transpose(12)

#         # Set the duration to whole note
#         chord_obj.duration.quarterLength = 4.0  # A whole note is 4 quarter notes

#         chord_stream.append(chord_obj)

#     # Write to a MIDI file
#     mf = chord_stream.write('midi', fp=filename)
