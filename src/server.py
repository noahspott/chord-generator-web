from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Returns a random chord progression
@app.route("/random")
def random_chord_progression():
    
    # get predictions from model
    predictions = ["A", "B", "C", "D"]

    return jsonify({"chord_progression": predictions})