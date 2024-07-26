import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import bcrypt
from pymongo import MongoClient
from bson.objectid import ObjectId
import tensorflow as tf
from PIL import Image
import numpy as np
from datetime import datetime
import pandas as pd
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Print statements to verify execution
print("Starting Flask app...")

# MongoDB client setup with increased timeout settings
try:
    client = MongoClient(
        'mongodb+srv://xilkasmohamed827:xamdiyaa@cluster0.3of2cfo.mongodb.net/?retryWrites=true&w=majority',
        socketTimeoutMS=300000,  # Set socket timeout to 5 minutes
        connectTimeoutMS=300000,  # Set connection timeout to 5 minutes
        serverSelectionTimeoutMS=300000,  # Set server selection timeout to 5 minutes
        ssl=True,  # Enable SSL
        tlsAllowInvalidCertificates=True  # For debugging purposes only, allow invalid certificates
    )
    db = client['test']
    users_collection = db['users']
    patients_collection = db['patients']
    print("MongoDB client setup complete.")
except Exception as e:
    print("Error setting up MongoDB client:", e)

# Load your model
try:
    model = tf.keras.models.load_model(r'C:\Users\pc\Desktop\bone-fracture-detection\backend\model.h5', compile=False)
    print("Model loaded.")
except Exception as e:
    print("Error loading model:", e)

# Helper function to convert ObjectId to string
def convert_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, list):
        return [convert_to_str(i) for i in obj]
    if isinstance(obj, dict):
        return {k: convert_to_str(v) for k, v in obj.items()}
    return obj

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password').encode('utf-8')

        if not email or not password:
            return jsonify({'error': 'Missing email or password'}), 400

        user = users_collection.find_one({'email': email})
        if user and bcrypt.checkpw(password, user['password'].encode('utf-8')):
            return jsonify({'token': 'dummy-token-for-demo'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        print("Error in login:", e)
        return jsonify({'error': 'An error occurred during login'}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']
        patient_name = request.form.get('patientName')
        patient_address = request.form.get('patientAddress')
        patient_contact = request.form.get('patientContact')
        patient_gender = request.form.get('patientGender')
        patient_id = request.form.get('patientId')
        date = datetime.now().strftime("%Y-%m-%d")

        if not file:
            return jsonify({'error': 'No file uploaded'}), 400

        # Process image
        img = Image.open(file.stream)
        img = img.convert("RGB")  # Ensure image has 3 channels
        img = img.resize((224, 224))  # Adjust the size as per your model requirement
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict using the model
        prediction = model.predict(img_array)
        result = 'Non-fractured' if prediction[0][0] > 0.5 else 'fractured'

        # Save the prediction
        patients_collection.insert_one({
            'patient_name': patient_name,
            'patient_address': patient_address,
            'patient_contact': patient_contact,
            'patient_gender': patient_gender,
            'patient_id': patient_id,
            'prediction': result,
            'date': date
        })

        return jsonify({'result': result})
    except Exception as e:
        print("Error in predict:", e)
        return jsonify({'error': 'An error occurred during prediction'}), 500

@app.route('/save-report', methods=['POST'])
def save_report():
    try:
        reports = list(patients_collection.find({}))
        if not reports:
            return jsonify({'error': 'No predictions to save'}), 400

        # Create a DataFrame from reports
        df = pd.DataFrame([convert_to_str(report) for report in reports])
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Sheet1')
        output.seek(0)

        return send_file(output, download_name='predictions.xlsx', as_attachment=True)
    except Exception as e:
        print("Error in save-report:", e)
        return jsonify({'error': 'An error occurred during report generation'}), 500

@app.route('/report', methods=['GET'])
def report():
    try:
        fractured = patients_collection.count_documents({'prediction': 'fractured'})
        non_fractured = patients_collection.count_documents({'prediction': 'Non-fractured'})  # Ensure this matches the actual prediction result

        report_data = {
            "fractured": fractured,
            "non_fractured": non_fractured,
            "predictions": [convert_to_str(prediction) for prediction in patients_collection.find({})]
        }
        return jsonify(report_data)
    except Exception as e:
        print("Error in report:", e)
        return jsonify({'error': 'An error occurred during report retrieval'}), 500

@app.route('/report-by-date', methods=['POST'])
def report_by_date():
    try:
        data = request.get_json()
        print("Received data:", data)

        start_date_str = data.get('startDate')
        end_date_str = data.get('endDate')

        if not start_date_str or not end_date_str:
            print("Invalid date range")
            return jsonify({'error': 'Invalid date range'}), 400

        # Parse the date strings, ignoring time information
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        except ValueError as e:
            print("Date format error:", e)
            return jsonify({'error': 'Invalid date format'}), 400

        filtered_predictions = list(patients_collection.find({
            'date': {'$gte': start_date.strftime("%Y-%m-%d"), '$lte': end_date.strftime("%Y-%m-%d")}
        }))

        # Print filtered predictions for debugging
        print("Filtered predictions:", filtered_predictions)

        fractured = len([p for p in filtered_predictions if p['prediction'].lower() == 'fractured'])
        non_fractured = len([p for p in filtered_predictions if p['prediction'].lower() == 'non-fractured'])

        # Convert ObjectId to string
        filtered_predictions = [convert_to_str(prediction) for prediction in filtered_predictions]

        report_data = {
            "fractured": fractured,
            "non_fractured": non_fractured,
            "predictions": filtered_predictions
        }

        # Save the report to an Excel file
        df = pd.DataFrame(filtered_predictions)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Sheet1')
        output.seek(0)

        return send_file(output, download_name='predictions.xlsx', as_attachment=True)
    except Exception as e:
        print("Error in report-by-date:", e)
        return jsonify({'error': 'An error occurred during report generation by date'}), 500

@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        patients = list(patients_collection.find({}))
        for patient in patients:
            patient['_id'] = str(patient['_id'])
        return jsonify(patients), 200
    except Exception as e:
        print("Error fetching patients:", e)
        return jsonify({'error': 'An error occurred while fetching patients'}), 500

@app.route('/patient/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        patient = patients_collection.find_one({'patient_id': patient_id})
        if patient:
            patient['_id'] = str(patient['_id'])  # Convert ObjectId to string
            return jsonify(patient), 200
        else:
            return jsonify({'error': 'Patient not found'}), 404
    except Exception as e:
        print("Error fetching patient data:", e)
        return jsonify({'error': 'An error occurred while fetching patient data'}), 500

if __name__ == '__main__':
    print("Running the app...")
    app.run(debug=True)
