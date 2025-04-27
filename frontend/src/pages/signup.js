import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import both Link and useNavigate
import '../css/signup.css';
import '../css/toast.css';

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: 'MALE',
    password: '',
    confirmPassword: ''
  });

  // State for toast messages
  const [toast, setToast] = useState({
    visible: false,
    type: '',
    title: '',
    message: ''
  });

  useEffect(() => {
    // Remove logged in user data on component mount (equivalent to page load)
    localStorage.removeItem("loggedInUser");
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  // Show toast message
  const showToast = (type, title, message) => {
    setToast({
      visible: true,
      type,
      title,
      message
    });

    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Handle sign in button click
  const handleSignInClick = (e) => {
    e.preventDefault();
    navigate('/login'); // Navigate programmatically to login page
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Error", "Passwords do not match. Try again.");
      return;
    }

    // Prepare user data without confirmPassword
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dob: formData.dob,
      gender: formData.gender.toUpperCase(),
      password: formData.password
    };

    try {
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        showToast("success", "Signup Successful", "Welcome to WorkSphere. Redirecting to login page...");

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          dob: '',
          gender: 'MALE',
          password: '',
          confirmPassword: ''
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login'); // Use navigate instead of window.location.href
        }, 2000);
      } else {
        const errorData = await response.text();
        showToast("error", "Signup Failed", "Error: " + errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Signup Failed", "Server error. Try Again Later");
    }
  };

  return (
    <div className="body-container">
      {/* Toast Container */}
      <div id="toast-container" className={toast.visible ? 'show' : ''}>
        {toast.visible && (
          <div className={`toast ${toast.type}`}>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        )}
      </div>

      <div className="container">
        {/* Left Side (Welcome Section) */}
        <div className="left">
          <h2>Come join us!</h2>
          <p>
            We are so excited to have you here. If you haven't already, create an account
            to get access to exclusive offers, rewards, and discounts.
          </p>

          {/* Option 1: Direct button with onClick handler */}
          <button 
            className="signin-button" 
            onClick={handleSignInClick}
            style={{ cursor: 'pointer' }}
          >
            Already have an account? Sign in.
          </button>
          

        </div>

        {/* Right Side (Signup Form) */}
        <div className="right">
          <h2>Signup</h2>
          <form id="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" style={{ cursor: 'pointer' }}>Signup</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;