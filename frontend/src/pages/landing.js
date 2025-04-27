import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/landing.css';
import finalImage from '../assets/final.jpg'; 

const LandingPage = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="landing-container">
      <header>
        <Link to="/" className="logo" aria-label="WorkSphere Home">WorkSphere</Link>
        <button 
          className={`menu-toggle ${menuActive ? 'open' : ''}`} 
          onClick={toggleMenu}
        >
          ☰
        </button>
        <nav className={menuActive ? 'active' : ''}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="bttn">Log In</Link></li>
            <li><Link to="/signup" className="btn">Sign Up for Free</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Boost Your Team's Productivity</h2>
          <p>WorkSphere is your all-in-one platform for seamless task management and team collaboration. Assign tasks, track progress, and communicate effortlessly—all in one powerful workspace.</p>
          <Link to="/signup" className="btn">Get Started for Free</Link>
        </div>
        <div className="hero-image">
          <img src={finalImage} alt="WorkSphere task management dashboard" loading="lazy" />
        </div>
      </section>

      <section className="features">
        <h2>Why Choose WorkSphere?</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3>Kanban Boards</h3>
            <p>Organize and manage your workflow with a flexible drag-and-drop Kanban system.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Collaboration</h3>
            <p>Chat, comment, and share files instantly to keep everyone on the same page.</p>
          </div>
          <div className="feature-card">
            <h3>Automated Notifications</h3>
            <p>Stay updated with smart alerts for task deadlines, assignments, and mentions.</p>
          </div>
          <div className="feature-card">
            <h3>Seamless Integrations</h3>
            <p>Connect WorkSphere with your favorite tools like Slack, Google Drive, and more.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 WorkSphere. All rights reserved.</p>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>
      </footer>
    </div>
  );
};

export default LandingPage;
