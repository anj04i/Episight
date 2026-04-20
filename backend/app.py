from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# Initialize app
app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("model/best_model.pkl")

@app.route("/")
def home():
    return "Backend is running"

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract input
        growth_rate = float(data["growth_rate"])
        retail = float(data["retail"])
        workplaces = float(data["workplaces"])
        residential = float(data["residential"])

        # Prepare input
        features = np.array([[growth_rate, retail, workplaces, residential]])

        prediction = model.predict(features)[0]


        return jsonify({
            "prediction": float(prediction)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)



