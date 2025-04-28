import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/dashboard';
import MyCalendar from './pages/MyCalendar.js'
import { DarkModeProvider } from './contexts/DarkModeContext';
import Project from './pages/project1.js';

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
