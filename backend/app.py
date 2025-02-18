from flask import Flask, request, jsonify
import google.generativeai as genai
from pymongo import MongoClient
import pandas as pd
from methods import *
from models import login, signup
app = Flask(__name__)

df = pd.read_csv(r"D:\FoodUcate\FoodUcate\backend\static\nutrition.csv")
selected_columns = ["name", "serving_size", "calories", "total_fat", "protein", "carbohydrate", "fiber", "sodium", "cholestrol", "vitamin_a", "vitamin_b12", "vitamin_b6", "vitamin_c", "vitamin_d", "sugars"]

#configuration of gemini API
genai.configure(api_key="AIzaSyDg6u-euPuvPvNtJ9lQKxEJWNuI85OuRYo")
@app.route('/getFoodDetails', methods=["GET"])
def get_food_nutrients():
    # keyword -> food_name
    keyword = request.args.get("food")
    results = df[df["name"].str.contains(keyword, case=False, na=False)][selected_columns]

    if not results.empty:
        return jsonify(results.to_dict(orient="records"))  # Return all matching items
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
@app.route("/filter_nutrient", methods=["POST"])
def filter_nutrient():
    filters = {}   
    # Extract query parameters (e.g., sodium=2.5,less & protein=5,greater)
    for key, value in request.args.items():
        try:
            nutrient, threshold, condition = key, float(value.split(",")[0]), value.split(",")[1]
            if nutrient in df.columns and condition in ["less", "greater"]:
                filters[nutrient] = (threshold, condition)
        except (ValueError, IndexError):
            return jsonify({"error": f"Invalid format for {key}. Use format 'value,condition' (e.g., sodium=2.5,less)"}), 400

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
    model =  genai.GenerativeModel("gemini-pro-vision")
    with open(image_path, "rb") as img:
        response = model.generate_content(["Give name of the food item in one word.", img.read()])
    return response.text.strip()

@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image= request.files["image"]
    image_path = "./static/uploaded_images/temp.jpg"
    image.save(image_path)

    # Recognize food name using Gemini
    food_name = recognize_food(image_path)

    # Search dataset for food nutrition details
    food_info = df[df["name"].str.contains(food_name, case=False, na=False)]
    
    if food_info.empty:
        return jsonify({"error": "Food not found in database"}), 404

    return jsonify(food_info.to_dict(orient="records"))

@app.route('/signup', methods=['POST'])
def signup_route():
    data = request.json
    return signup(data["username"], data["password"])

@app.route('/login', methods=['POST'])
def login_route():
    data = request.json
    return login(data["username"], data["password"])


if __name__ == "__main__":
    app.run(debug=True)