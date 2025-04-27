import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login.css';
import '../css/toast.css';

const Login = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for toast messages
  const [toast, setToast] = useState({
    visible: false,
    type: '',
    title: '',
    message: ''
  });

  // Error message state
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing user data from localStorage on component mount
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = formData;

    if (!email || !password) {
      showToast("error", "Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log(user);
        
        // Store user data in localStorage
        localStorage.setItem("loggedInUser", user.email);
        localStorage.setItem("UserFName", user.firstName);
        localStorage.setItem("UserLName", user.lastName);
        localStorage.setItem("loggedInUserID", user.id);
        
        // Reset form
        setFormData({ email: '', password: '' });
        
        showToast("success", "Login Successful!", "Redirecting to your Dashboard.");

        // Redirect based on user type
        setTimeout(() => {
          navigate(user.userType === "ADMIN" ? "/admin" : "/dashboard");
        }, 2000);

      } else {
        const errorData = await response.json();
        console.log(errorData);
        setErrorMessage("Invalid Credentials");
        showToast("error", "Login Failed", "Invalid Credentials. Try Again.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Login Failed", "Server error. Try Again Later");
    }
  };

  return (
    <div className="login-container">
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
        <div className="left">
          <h2>Welcome Back users</h2>
          <p>   </p>
          <p>We are so excited to have you here. If you have already, Login to your an account to get access to exclusive offers, rewards, and discounts.</p>
          <Link to="/signup" className="signin-link">Don't have an account? Sign Up.</Link>
        </div>

        <div className="right">
          <h2>Login</h2>
          <p id="message" style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
          <form id="login-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              id="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="password" 
              id="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <Link to="/dashboard">
              <button type="submit">Login</button>
            </Link>
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;