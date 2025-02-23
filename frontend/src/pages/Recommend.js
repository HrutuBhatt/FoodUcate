import React, { useState } from "react";

const DietRecommendation = () => {
    const [formData, setFormData] = useState({
        Age: "",
        Gender: "Male",
        Weight_kg: "",
        Height_cm: "",
        Disease_Type: "Hypertension",
        Severity: "Moderate",
        Physical_Activity_Level: "Active",
        Daily_Caloric_Intake: "",
        Cholesterol_mgdL: "",
        Blood_Pressure_mmHg: "",
        Glucose_mgdL: "",
        Preferred_Cuisine: "Mexican",
        Weekly_Exercise_Hours: "",
    });
    const [prediction, setPrediction] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await await fetch("http://localhost:5000/predict",{
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
              
            });
            const result = await response.json();
            console.log("Diet Recommendation:", result.prediction);
            setPrediction(result.prediction)
        } catch (error) {
            console.error("Error fetching prediction", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Diet Recommendation System</h2>
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Age:</label>
                    <input type="number" className="form-control" name="Age" value={formData.Age} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Weight (kg):</label>
                    <input type="number" className="form-control" name="Weight_kg" value={formData.Weight_kg} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Height (cm):</label>
                    <input type="number" className="form-control" name="Height_cm" value={formData.Height_cm} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Gender:</label>
                    <select className="form-select" name="Gender" value={formData.Gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Disease Type:</label>
                    <select className="form-select" name="Disease_Type" value={formData.Disease_Type} onChange={handleChange}>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Obesity">Obesity</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Severity:</label>
                    <select className="form-select" name="Severity" value={formData.Severity} onChange={handleChange}>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Mild">Mild</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Physical Activity Level:</label>
                    <select className="form-select" name="Physical_Activity_Level" value={formData.Physical_Activity_Level} onChange={handleChange}>
                        <option value="Sedentary">Sedentary</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Active">Active</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Preferred Cuisine:</label>
                    <select className="form-select" name="Preferred_Cuisine" value={formData.Preferred_Cuisine} onChange={handleChange}>
                        <option value="Mexican">Mexican</option>
                        <option value="Indian">Indian</option>
                        <option value="Italian">Italian</option>
                        <option value="Chinese">Chinese</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Daily Caloric Intake:</label>
                    <input type="number" className="form-control" name="Daily_Caloric_Intake" value={formData.Daily_Caloric_Intake} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Cholesterol (mg/dL):</label>
                    <input type="number" className="form-control" name="Cholesterol_mgdL" value={formData.Cholesterol_mgdL} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Blood Pressure (mmHg):</label>
                    <input type="number" className="form-control" name="Blood_Pressure_mmHg" value={formData.Blood_Pressure_mmHg} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Glucose (mg/dL):</label>
                    <input type="number" className="form-control" name="Glucose_mgdL" value={formData.Glucose_mgdL} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Weekly Exercise Hours:</label>
                    <input type="number" className="form-control" name="Weekly_Exercise_Hours" value={formData.Weekly_Exercise_Hours} onChange={handleChange} required />
                </div>
                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary">Get Recommendation</button>
                </div>
            </form>
            {prediction && <h3 className="text-center mt-4">Recommended Diet: {prediction}</h3>}
        </div>
        
    );
};

export default DietRecommendation;
