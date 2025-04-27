import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import UserSettings from './pages/settings';
import ProjectManagement from './pages/project';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/project" element={<ProjectManagement />} /> 
      </Routes>
    </Router>
  );
}

export default App;
