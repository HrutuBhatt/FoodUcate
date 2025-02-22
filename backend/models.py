from pymongo import MongoClient
from flask import jsonify

client = MongoClient("mongodb://localhost:27017/")  
db = client["fooducate_db"]  # Database name

users = db["users"]
nutrients = db["nutrients"]
food_consumed = db["consumption"]



def signup(username, password):
    # Check if user already exists
    if users.find_one({"username": username}):  
        return jsonify({"error": "User already exists"}), 400

    user = {
        "username": username,
        "password": password  
    }
    users.insert_one(user)
    return jsonify({"message": "User created successfully"}), 200

# def login(username, password):

#     user = users.find_one({"username": username})  
#     if user and user["password"]== password:  
#         return jsonify({"message": "Login successful"}), 200
#     return jsonify({"error": "Invalid username or password"}), 401

# def add_nutrient(user_id, nutrient_name):
