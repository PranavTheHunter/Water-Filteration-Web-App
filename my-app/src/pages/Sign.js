import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import Cookies from 'js-cookie';  // Import js-cookie for handling cookies
import axios from 'axios';
import './Sign.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ph_num: '',
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    ph_num: '',
  });

  const navigate = useNavigate();  // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Basic validation logic
  const validate = () => {
    let isValid = true;
    const newError = { name: '', email: '', ph_num: '' };

    if (!formData.name) {
      newError.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newError.email = 'Valid email is required';
      isValid = false;
    }
    if (!formData.ph_num || formData.ph_num.length !== 10) {
      newError.ph_num = 'Phone number must be 10 digits';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form inputs
    if (validate()) {
      // Send formData via axios POST request
      axios.post('http://localhost:8081/Sign', formData)
        .then(res => console.log(res))
        .catch(err => console.log(err));

      // Set only the email cookie
      Cookies.set('email', formData.email, { expires: 7 });  // Cookie will expire in 7 days

      alert('Signup successful! Redirecting to home page.');

      // Clear the form fields after submission
      setFormData({
        name: '',
        email: '',
        ph_num: '',
      });

      // Redirect to the /home page after signup
      navigate('/home');
    }
  };

  return (
    <div className="signup-container">
      <header className="header">
        <h1 className="header-title">Sign Up</h1>
      </header>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          <span className="label-text">Name:</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="input-field"
          />
          {error.name && <span className="error-text">{error.name}</span>}
        </label>
        <label>
          <span className="label-text">Email:</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="input-field"
          />
          {error.email && <span className="error-text">{error.email}</span>}
        </label>
        <label>
          <span className="label-text">Phone:</span>
          <input
            type="text"
            name="ph_num"
            value={formData.ph_num}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            required
            className="input-field"
          />
          {error.ph_num && <span className="error-text">{error.ph_num}</span>}
        </label>
        <button type="submit" className="submit-button">Create Account</button>
      </form>
      <footer className="footer">
        <p>&copy; 2024 Your Brand - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Signup;
