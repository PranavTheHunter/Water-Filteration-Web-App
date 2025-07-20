import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import Cookies from 'js-cookie';  // Import js-cookie for handling cookies
import axios from 'axios';  // Import axios for making HTTP requests
import './login.css'; // Importing the CSS file for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [ph_num, setPhNum] = useState(''); // State for phone number
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for login
    const loginData = {
      email: email,
      ph_num: ph_num,
    };

    // Handle login logic
    axios.post('http://localhost:8081/Login', loginData)
      .then(response => {
        if (response.data === 'error') {
          // If there's an error, redirect to the sign-in page
          alert("User not found please sign-in");
          navigate('/Signup');
        } else {
          // If login is successful, create a cookie with the customer name
          Cookies.set('email', response.data.email, { expires: 7 });  // Store customer name in a cookie
          navigate('/home');  // Redirect to home page
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        // Redirect to sign-in on error
        navigate('/Signup');
      });

    console.log("Email: ", email);
    console.log("Phone Number: ", ph_num); // Updated to display phone number
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Water Filtration Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="ph_num">Phone Number:</label>
          <input
            type="text"
            id="ph_num"
            value={ph_num}
            onChange={(e) => setPhNum(e.target.value)} // Updated to set phone number state
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
        <a className='link-signUp' href='/Signup'>New here </a>
      </form>
    </div>
  );
};

export default Login;
