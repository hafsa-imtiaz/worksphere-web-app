import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import UserSettings from './pages/settings'; 
import Dashboard from './pages/dashbaord';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
