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
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Preferred Cuisine:</label>
                    <select className="form-select" name="Preferred_Cuisine" value={formData.Preferred_Cuisine} onChange={handleChange}>
                        <option value="Mexican">Mexican</option>
                        <option value="Indian">Indian</option>
                        <option value="Mediterranean">Mediterranean</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Daily Caloric Intake:</label>
                    <input type="number" className="form-control" name="Daily_Caloric_Intake" value={formData.Daily_Caloric_Intake} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Cholesterol (mg/dL):</label>
                    <input type="number" className="form-control" name="Cholesterol_mg_dL" value={formData.Cholesterol_mg_dL} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Blood Pressure (mmHg):</label>
                    <input type="number" className="form-control" name="Blood_Pressure_mmHg" value={formData.Blood_Pressure_mmHg} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Glucose (mg/dL):</label>
                    <input type="number" className="form-control" name="Glucose_mg_dL" value={formData.Glucose_mg_dL} onChange={handleChange} required />
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