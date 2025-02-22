from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import google.generativeai as genai
from io import BytesIO
from pymongo import MongoClient
import pandas as pd
from methods import *
from models import signup
from static.secret import API_KEY
import re, joblib
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

import numpy as np
app = Flask(__name__)
CORS(app) 

df = pd.read_csv(r"D:\FoodUcate\FoodUcate\backend\static\nutrition.csv")
selected_columns = ["name", "serving_size", "calories", "total_fat", "protein", "carbohydrate", "fiber", "sodium", "cholesterol", "vitamin_a", "vitamin_b12", "vitamin_b6", "vitamin_c", "vitamin_d", "sugars"]

#Database
client = MongoClient("mongodb://localhost:27017/")
db = client["fooducate_db"]

users = db["users"]
nutrients = db["nutrients"]
food_consumed = db["consumption"]

# Secret key for JWT
app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)

# Bcrypt for password hashing
bcrypt = Bcrypt(app)

#configuration of gemini API
genai.configure(api_key=API_KEY)
@app.route('/getFoodDetails', methods=['POST'])
def get_food_nutrients():
    # keyword -> food_name
    data = request.json
    keyword = data.get('food')
    print(keyword)
    results = df[df["name"].str.contains(keyword, case=False, na=False)][selected_columns]
    if not results.empty:
        first_result = results.iloc[0].to_dict()  # Convert only the first row to a dictionary
        print(first_result)
        print(jsonify(first_result))
        return jsonify(first_result)
    return jsonify({"error": "No matching foods found"}), 404

#cleaning data
def clean_nutrient_values(value):
    if isinstance(value,str):
        return float(value.replace("mg","").replace("g","").replace("mcg","").replace("IU","").replace("mc","").replace(" ","").strip())
    return value

numeric_columns = [ "calories", "total_fat", "protein", "carbohydrate", "fiber", "sodium", "cholesterol", "vitamin_a", "vitamin_b12", "vitamin_b6", "vitamin_c", "vitamin_d", "sugars"]  # Add more if needed
for col in numeric_columns:
    df[col] = df[col].apply(clean_nutrient_values)

#filtering foods based on nutrients provided
@app.route("/filter_nutrient", methods=['POST'])
def filter_nutrient():
    data = request.json

    filters = {}   
    # Extract query parameters (e.g., sodium=2.5,less & protein=5,greater)
    for key, value in data.items():
        try:
            for nutrient, value in data.items():
                threshold, condition = float(value["value"]), value["condition"]
                if nutrient in df.columns and condition in ["less", "greater"]:
                    filters[nutrient] = (threshold, condition)
                else:
                    return jsonify({"error": f"Invalid condition '{condition}' for {nutrient}"}), 400
        except (ValueError, KeyError, TypeError):
            return jsonify({"error": "Invalid JSON format. Use {'nutrient': {'value': <number>, 'condition': 'less/greater'}}"}), 400

    if not filters:
        return jsonify({"error": "No valid filtering parameters provided"}), 400

    # Apply multiple filters dynamically
    filtered_df = df.copy()
    for nutrient, (threshold, condition) in filters.items():
        if condition == "less":
            filtered_df = filtered_df[filtered_df[nutrient] <= threshold]
        else:  #"greater"
            filtered_df = filtered_df[filtered_df[nutrient] >= threshold]

    if not filtered_df.empty:
        return jsonify(filtered_df[["name"] + list(filters.keys())].to_dict(orient="records"))
    return jsonify({"error": "No matching foods found"}), 404
 

# calculate nutrtional requirements based on various factors
@app.route("/calculate", methods=['POST'])
def get_nutrition():
    try:
        data = request.get_json()

        # Extract parameters from request
        age = data.get("age")
        gender = data.get("gender")
        weight = data.get("weight")
        height = data.get("height")
        activity_level = data.get("activity_level")
        condition = data.get("condition")

        # Validate input
        if not all([age, gender, weight, height, activity_level]):
            return jsonify({"error": "Missing required fields"}), 400

        # Calculate nutrient requirements
        nutrition_data = calculate_nutrient_requirements(
            age, gender, weight, height, activity_level, condition
        )

        return jsonify({
            "status": "success",
            "data": nutrition_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def recognize_food(image_path):
    model =  genai.GenerativeModel("gemini-1.5-flash")
    with open(image_path, "rb") as img_file:
        img = Image.open(img_file)  # Convert bytes to PIL Image
        img = img.convert("RGB")  # Ensure it's in RGB mode
    response = model.generate_content(["1.List the nutritional value of this food item, and state is it healthy or not. 2. How much should we consume.", img])
    return response.text

def format_responses(text):
    formatted_text = re.sub(r'\*\*(.*?)\*\*', r'\n\1\n', text)
    formatted_text = formatted_text.replace("**", "\n ")
    formatted_text = formatted_text.replace("- -", "-")  # Fix duplicate bullets
    formatted_text = formatted_text.replace("-  ", "- ")  # Remove extra spaces

    return formatted_text.replace("*", "")

@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image= request.files["image"]
    image_path = "./static/uploaded_images/temp.jpg"
    image.save(image_path)

    # Recognize food name using Gemini
    food_info = recognize_food(image_path)

    # Search dataset for food nutrition details   
    if not food_info:
        return jsonify({"error": "Food not found in database"}), 404

    return jsonify(format_responses(food_info))

@app.route('/signup', methods=['POST'])
def signup_route():
    data = request.json
    return signup(data["username"], data["password"])

@app.route('/login', methods=['POST'])
def login_route():
    data = request.json
    print(data["username"], data["password"])
    username = data["username"]
    password = data["password"]
    user = users.find_one({"username": username})  
    if user and user["password"]== password:  
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid username or password"}), 401

dt_classifier = joblib.load(r"D:\FoodUcate\FoodUcate\backend\static\pkl\diet_recommendation_model.pkl")
le_dict = joblib.load(r"D:\FoodUcate\FoodUcate\backend\static\pkl\label_encoders.pkl")
scaler = joblib.load(r"D:\FoodUcate\FoodUcate\backend\static\pkl\scaler.pkl")
feature_columns = [
    "Age", "Gender", "Weight_kg", "Height_cm", "Disease_Type", "Severity",
    "Physical_Activity_Level", "Daily_Caloric_Intake", "Cholesterol_mg/dL",
    "Blood_Pressure_mmHg", "Glucose_mg/dL", "Preferred_Cuisine", "Weekly_Exercise_Hours",
    "Adherence_to_Diet_Plan"
]

#Diet Recommendation function

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # print("Hello")
        data = request.json  # Receive data from frontend
        
        # Convert categorical inputs using stored encoders
        for col in le_dict.keys():
            if col in data:
                try:
                    data[col] = le_dict[col].transform([data[col]])[0]
                except ValueError:
                    return jsonify({"error": f"Invalid value for {col}: {data[col]}"})
        
        # Convert data into numpy array
        input_data = np.array([data[col] for col in feature_columns]).reshape(1, -1)

        # Scale numerical features
        input_data = scaler.transform(input_data)

        # Predict diet recommendation
        prediction_encoded = dt_classifier.predict(input_data)[0]
        prediction = le_dict["Diet_Recommendation"].inverse_transform([prediction_encoded])[0]
        print(prediction)
        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}) 
    


##DATABASE OPERATIONS
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = bcrypt.generate_password_hash(data.get("password")).decode("utf-8")

    if users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    user_id = users.insert_one({"username": username, "password": password}).inserted_id
    return jsonify({"message": "User registered", "user_id": str(user_id)}), 201


#  Login User & Get Token
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users.find_one({"username": data.get("username")})

    if user and bcrypt.check_password_hash(user["password"], data.get("password")):
        access_token = create_access_token(identity=str(user["_id"]))
        return jsonify({"token": access_token, "user_id": str(user["_id"])}), 200

    return jsonify({"error": "Invalid credentials"}), 401


###  **Nutrient Tracking Endpoints**

#  Add Nutrient Goal
@app.route("/add_nutrient", methods=["POST"])
@jwt_required()
def add_nutrient():
    user_id = get_jwt_identity()
    data = request.json
    nutrient_name = data.get("nutrient_name")
    max_amount = data.get("max_amount")

    nutrient_id = nutrients.insert_one({
        "user_id": ObjectId(user_id),
        "nutrient_name": nutrient_name,
        "max_amount": max_amount,
        "curr_amount": 0
    }).inserted_id

    return jsonify({"message": "Nutrient goal added", "nutrient_id": str(nutrient_id)}), 201


#  Get User Nutrient Data
@app.route("/nutrients", methods=["GET"])
@jwt_required()
def get_nutrients():
    user_id = get_jwt_identity()
    user_nutrients = list(nutrients.find({"user_id": ObjectId(user_id)}, {"_id": 0}))
    return jsonify(user_nutrients), 200


### **Food Consumption Tracking Endpoints**

#  Add Food Entry
@app.route("/add_food", methods=["POST"])
@jwt_required()
def add_food():
    user_id = get_jwt_identity()
    data = request.json
    food_name = data.get("food_name")
    quantity = data.get("quantity")

    food_id = food_consumed.insert_one({
        "user_id": ObjectId(user_id),
        "food_name": food_name,
        "quantity": quantity,
        "date": datetime.utcnow()
    }).inserted_id

    return jsonify({"message": "Food entry added", "food_id": str(food_id)}), 201


# Get User's Food Entries
@app.route("/user_food", methods=["GET"])
@jwt_required()
def get_user_food():
    user_id = get_jwt_identity()
    foods = list(food_consumed.find({"user_id": ObjectId(user_id)}, {"_id": 0}))
    return jsonify(foods), 200

if __name__ == "__main__":
    app.run(debug=True)