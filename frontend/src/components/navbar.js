import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'; 

//Navigation bar

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          FoodUCate
        </Link>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link active">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link active">
                Search
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/scan" className="nav-link active">
                Scan Food
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recommend" className="nav-link active">
                Recommendation
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/track" className="nav-link active">
                Diet Track
              </Link>
            </li>
            <li className="nav-item">
              {token ? (
                <button className="nav-link active" onClick={handleLogout}>Logout</button>
              ) : (
                <Link className="nav-link active" to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
