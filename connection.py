from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for development

# MongoDB setup
ca = certifi.where()
load_dotenv()
MONGO_URL = os.getenv('MONGODB_URL')
client = MongoClient(MONGO_URL, tlsCAFile=ca)
Users_db = client.Users
coll = Users_db.UserCredentials

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    user = coll.find_one({'email': email})
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found. Please sign up first.'}), 404
    
    if user['password'] != password:
        return jsonify({'success': False, 'message': 'Incorrect password'}), 401
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'user': {
            'name': user['name'],
            'email': user['email']
        }
    })

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if coll.find_one({'email': email}):
        return jsonify({'success': False, 'message': 'Email already in use'}), 409

    coll.insert_one({
        'name': name,
        'email': email,
        'password': password
    })

    return jsonify({
        'success': True,
        'message': 'Registration successful'
    })

if __name__ == '__main__':
    app.run(debug=True)