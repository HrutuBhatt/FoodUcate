
import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="banner">
        <div className="text-content">
          <h1>Your Personalized Food Guide</h1>
          <p>
            Eating the right food at the right time is essential for a healthy
            lifestyle. Discover what’s best for you based on your dietary
            preferences and nutritional needs.
          </p>
          
        </div>
      </div>
      <div className="food-waste-section">
        <div className="waste-text">
          <h2>Track Your Diet, Transform Your Health</h2>
          <p>
          Stay on top of your nutrition by monitoring your meals and making informed choices. 
          Build healthy habits and achieve your fitness goals with personalized diet tracking.
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default Home;