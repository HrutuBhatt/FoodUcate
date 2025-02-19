import React, {useState} from "react";

const FoodSearch = ()=>{
    const [food, setFood] = useState("milk");
    const [foodResults, setFoodResults] = useState(null);
    const [filters, setFilters] = useState([{ nutrient: "", value: "", condition: "less"}]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [error, setError] = useState("");
  
    // Function to handle food search
    const handleSearch = async () => {
      setError("");
      try {
        const response = await fetch("http://localhost:5000/getFoodDetails", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ food:food }),
        });
  
        const data = await response.json();
        if (response.ok) {
            console.log(data)
          setFoodResults(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Error fetching nutrient details");
        // console.log(error)
      }
    };
  
    // Function to handle nutrient filtering
    const handleFilter = async () => {
      setError("");
      const filterData = {};
      filters.forEach((filter) => {
        if (filter.nutrient && filter.value) {
          filterData[filter.nutrient] = { value: parseFloat(filter.value), condition: filter.condition };
        }
      });
  
      try {
        const response = await fetch("http://localhost:5000/filter_nutrient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filterData),
        });
  
        const data = await response.json();
        if (response.ok) {
          setFilteredResults(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to fetch filtered results");
      }
    };
  
    // Add a new filter input row
    const addFilter = () => {
      setFilters([...filters, { nutrient: "", value: "", condition: "less" }]);
    };
  
    return (
      <div className="container mt-4">
        <h2 className="text-center text-primary">Food & Nutrient Search</h2>
  
        {/* Food Search Input */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter food name"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
       
        {/* Display Search Results */}
        {foodResults && (
          <div className="mt-3">
            <h4>Food Search Results</h4>
            <ul className="list-group">
                {Object.entries(foodResults)
                .filter(([key]) => key !== "name") // Exclude name from the list
                .map(([key, value]) => (
                  <li key={key} className="list-group-item">
                    <strong>{key}: </strong>
    
                     {value}
                  </li>
                ))}
            </ul>
          </div>
        )}
  
        {/* Nutrient Filter Section */}
        <div className="mt-4">
          <h4>Filter by Nutrient</h4>
          {filters.map((filter, index) => (
            <div className="row mb-2" key={index}>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter nutrient (e.g., sodium)"
                  value={filter.nutrient}
                  onChange={(e) => {
                    const newFilters = [...filters];
                    newFilters[index].nutrient = e.target.value;
                    setFilters(newFilters);
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => {
                    const newFilters = [...filters];
                    newFilters[index].value = e.target.value;
                    setFilters(newFilters);
                  }}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filter.condition}
                  onChange={(e) => {
                    const newFilters = [...filters];
                    newFilters[index].condition = e.target.value;
                    setFilters(newFilters);
                  }}
                >
                  <option value="less">Less than</option>
                  <option value="greater">Greater than</option>
                </select>
              </div>
            </div>
          ))}
  
          <button className="btn btn-secondary me-2" onClick={addFilter}>
            + Add Filter
          </button>
          <button className="btn btn-success" onClick={handleFilter}>
            Apply Filters
          </button>
        </div>
  
        {/* Display Filtered Results */}
        {filteredResults.length > 0 && (
          <div className="mt-3">
            <h4>Filtered Results</h4>
            <ul className="list-group">
              {filteredResults.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.name} - {JSON.stringify(item)}
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Error Message */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    );
}

export default FoodSearch;
