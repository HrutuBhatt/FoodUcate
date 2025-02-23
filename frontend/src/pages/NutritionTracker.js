import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
const NutrientTracker = () => {
  const [selectedNutrient, setSelectedNutrient] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [nutrients, setNutrients] = useState([]);
  const [foodEntries, setFoodEntries] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const nutrientOptions = ["calories", "total_fat", "protein", "carbohydrate", "fiber", "sodium", "cholesterol", "vitamin_a", "vitamin_b12", "vitamin_b6", "vitamin_c", "vitamin_d", "sugars"];

  const token = localStorage.getItem("token"); // JWT Token

  useEffect(() => {
    fetchNutrients();
    fetchFoodEntries();
  }, []);

  // Fetch nutrient goals
  const fetchNutrients = async () => {
    const response = await fetch("http://localhost:5000/nutrients", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setNutrients(data);
    }
  };

  // Fetch food consumption data
  const fetchFoodEntries = async () => {
    const response = await fetch("http://localhost:5000/user_food", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setFoodEntries(data);
    }
  };

  // Add nutrient goal
  const handleAddNutrient = async () => {
    if (!selectedNutrient || !maxAmount) {
      setMessage("Please select a nutrient and enter a valid value.");
      return;
    }

    const response = await fetch("http://localhost:5000/add_nutrient", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nutrient_name: selectedNutrient, max_amount: parseFloat(maxAmount) }),
    });

    if (response.ok) {
      setMessage("Nutrient goal added successfully.");
      setSelectedNutrient("");
      setMaxAmount("");
      fetchNutrients(); // Refresh data
    } else {
      setMessage("Failed to add nutrient goal.");
    }
  };

  // Add food entry
  const handleAddFood = async () => {
    if (!foodName || !quantity) {
      setMessage("Please enter food name and quantity.");
      return;
    }

    const response = await fetch("http://localhost:5000/add_food", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ food_name: foodName, quantity: parseFloat(quantity) }),
    });

    if (response.ok) {
      setMessage("Food entry added successfully.");
      setFoodName("");
      setQuantity("");
      fetchFoodEntries(); // Refresh food data
    } else {
      setMessage("Failed to add food entry.");
    }
  };

  // Chart Data
  const chartData = {
    labels: nutrients.map((n) => n.nutrient_name),
    datasets: [
      {
        label: "Consumed",
        data: nutrients.map((n) => n.curr_amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Remaining",
        data: nutrients.map((n) => n.max_amount - n.curr_amount),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2>Nutrient & Food Tracker</h2>
      {/* Add Nutrient Goal */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-md-4">
          <select className="form-select" value={selectedNutrient} onChange={(e) => setSelectedNutrient(e.target.value)}>
            <option value="">Select Nutrient</option>
            {nutrientOptions.map((nutrient, index) => (
              <option key={index} value={nutrient}>{nutrient}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Max Value" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={handleAddNutrient}>Add Nutrient</button>
        </div>
      </div>

      {/* Nutrient Progress Chart */}
      {nutrients.length > 0 && (
        <div className="mt-4">
          <h4>Nutrient Progress</h4>
          <Bar data={chartData} />
        </div>
      )}

      {/* Add Food Entry */}
      <div className="row g-3 align-items-center mt-4">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Food Name" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Quantity (grams/ml)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-success w-100" onClick={handleAddFood}>Add Food</button>
        </div>
      </div>

      {/* Food List */}
      {foodEntries.length > 0 && (
        <div className="mt-4">
          <h4>Food Consumption</h4>
          <ul className="list-group">
            {foodEntries.map((food, index) => (
              <li key={index} className="list-group-item">
                {food.food_name} - {food.quantity} g/ml
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <p className="alert alert-info mt-3">{message}</p>}
    </div>
  );
};

export default NutrientTracker;
