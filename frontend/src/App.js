import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import FoodSearch from './pages/FoodSearch';
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/* Project Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<FoodSearch />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
