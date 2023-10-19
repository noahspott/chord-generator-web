from flask import Flask, jsonify
from flask_cors import CORS
import model

app = Flask(__name__)
CORS(app)

# Returns a random chord progression
@app.route("/random")
def random_chord_progression():

    seed_chords = []
    sequence_length = 4

    # get predictions from model
    predictions = ["Am7", "G", "C", "Fmaj7"]
    predictions = model.generate_sequence(seed_chords, sequence_length)

    print('Random Chord Progression Requested!')
    print(f'Returning Predictions: {predictions}')

    return jsonify({"chord_progression": predictions})