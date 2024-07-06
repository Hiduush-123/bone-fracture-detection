from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load model
try:
    model = load_model(r'C:\Users\hp\Desktop\bone-fracture-detection\backend\model.h5', compile=False)
    print("Model loaded and compiled successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

# In-memory storage for predictions
predictions = []

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image)
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    try:
        image = Image.open(file.stream)
        image = preprocess_image(image)
        prediction = model.predict(image)
        predicted_class = 'non-fracture' if prediction[0][0] > 0.5 else 'fracture'
        predictions.append(predicted_class)
        return jsonify({"result": predicted_class})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/report', methods=['GET'])
def report():
    fractured_count = predictions.count('fracture')
    non_fractured_count = predictions.count('non-fracture')
    report_data = {
        "fractured": fractured_count,
        "non_fractured": non_fractured_count
    }
    return jsonify(report_data)

@app.route('/save-report', methods=['POST'])
def save_report():
    try:
        df = pd.DataFrame(predictions, columns=["Prediction"])
        report_path = "predictions.xlsx"
        df.to_excel(report_path, index=False)
        return send_file(report_path, as_attachment=True)
    except Exception as e:
        print(f"Error saving report: {e}")
        return jsonify({"error": "Error saving report"}), 500

if __name__ == "__main__":
    app.run(debug=True)
