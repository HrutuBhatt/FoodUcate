def calculate_nutrient_requirements(age, gender, weight, height, activity_level, condition=None):
    # Calculate BMR
    if gender == "Male":
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

    # Activity factor mapping
    activity_factors = {
        "Sedentary": 1.2,
        "Light": 1.375,
        "Moderate": 1.55,
        "Heavy": 1.725,
        "Athlete": 1.9
    }

    # Calculate Total Daily Energy Expenditure (TDEE)
    tdee = bmr * activity_factors.get(activity_level, 1.2)

    # Default Macronutrient Values
    protein = weight * 0.8  # g/kg
    carbs = (tdee * 0.5) / 4  # 50% of calories from carbs
    fats = (tdee * 0.3) / 9  # 30% of calories from fats
    sodium = 2300  # mg (default)
    cholesterol = 300  # mg (default)
    potassium = 3500  # mg (default)
    fiber = 25  # g (default)

    # Adjustments Based on Conditions
    if condition == "Diabetes":
        carbs *= 0.8
        fiber += 5
        sodium = 1500

    elif condition == "Hypertension":
        sodium = 1500
        potassium = 4700
        cholesterol = 200

    elif condition == "Kidney Disease":
        protein *= 0.6
        sodium = 1500
        potassium = 2000
        cholesterol = 200

    elif condition == "Heart Disease":
        fats *= 0.8
        cholesterol = 150
        sodium = 1500
        fiber += 5

    elif condition == "Obesity":
        tdee *= 0.85
        carbs = (tdee * 0.4) / 4
        fats = (tdee * 0.25) / 9
        protein = weight * 1.2

    return {
        "Calories (kcal)": round(tdee, 2),
        "Protein (g)": round(protein, 2),
        "Carbohydrates (g)": round(carbs, 2),
        "Fats (g)": round(fats, 2),
        "Sodium (mg)": sodium,
        "Cholesterol (mg)": cholesterol,
        "Potassium (mg)": potassium,
        "Fiber (g)": fiber
    }


