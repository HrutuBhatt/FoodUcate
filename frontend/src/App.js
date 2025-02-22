import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import FoodSearch from './pages/FoodSearch';
import ScanFood from './pages/ScanFood';
import DietRecommendation from './pages/Recommend';
import PrivateRoute from './auth/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import NutritionTracker from './pages/NutritionTracker';
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/* Project Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<FoodSearch />} />
          <Route path="/scan" element={<ScanFood />} />
          <Route path="/recommend" element={<DietRecommendation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/track" element={<NutritionTracker />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
