// Home.js

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
//import '../App.css';
import './Home.css';
import axios from 'axios'; // For making API requests

function App() {
  const [isScrolled, setIsScrolled] = useState(false); // State to track if scrolled
  const [hoverText, setHoverText] = useState({ text1: 'Clean Water', text2: 'Healthy Life' }); // State to track text changes
  const [isHovering, setIsHovering] = useState(false); // State to track hover state
  const [revertTimeout, setRevertTimeout] = useState(null); // State to track timeout for reverting
  const [username, setUsername] = useState('User'); // State to hold the username

  useEffect(() => {
    const email = Cookies.get('email');
    if (email) {
      setUsername(email); // Set the username based on the email stored in the cookie
      validityCheck(email); // Trigger the warranty validity check function
    }

    const onScroll = () => {
      const navbar = document.querySelector('.nav');
      const scrollY = window.scrollY;
      const fillAnimation = document.querySelector('.fill-animation');

      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      const fillHeight = Math.min(scrollY / 3, 100); // Adjusted divisor for smoother speed
      const fillOpacity = Math.min(scrollY / 200, 1); // Opacity increases with scroll
      const navbarOpacity = Math.max(1 - scrollY / 300, 0); // Navbar opacity decreases with scroll

      fillAnimation.style.height = `${fillHeight}%`;
      fillAnimation.style.opacity = `${fillOpacity}`; // Set the opacity to create the clean water effect
      navbar.style.opacity = `${navbarOpacity}`; // Set navbar opacity

      if (scrollY > 100 && !isScrolled) {
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isScrolled]);

  // Function to check for warranty validity and send SMS
  const validityCheck = async (email) => {
    try {
      const response = await axios.post('http://localhost:8081/check-warranty', { email });
      console.log(response.data.message); // Log the result from the server
    } catch (error) {
      console.error('Error checking warranty', error);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setHoverText({ text1: `Welcome ${username}`, text2: 'Thanks for Visiting' });

    if (revertTimeout) clearTimeout(revertTimeout);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoverText({ text1: 'Clean Water', text2: 'Healthy Life' });
      setIsHovering(false);
    }, 4000);
    setRevertTimeout(timeout);
  };

  const handleSignUpClick = () => {
    window.location.href = '/login'; // Redirect to the signup page
  };

  const displayProduct =() => {
    window.location.href = '/Products'
  }

  return (
    <div className='main-wrapper'>
      <header className="header">
        <h1>Your Brand - Water Filters</h1>
      </header>

      <nav className="nav">
        <a href="/Home">Home</a>
        <a href="/Products">Products</a>
        <a href="/About">About</a>
        <a href="/Contact">Contact</a>
        <button className="signup-button" onClick={handleSignUpClick}>Login</button>
      </nav>

      <section className="banner">
        <div className="fill-animation">
          <div className="wave"></div>
          <div className="bubble"></div>
        </div>
        <div
          className="banner-titles"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h2
            className={`banner-title hover-text ${isHovering ? 'hovered' : ''} ${isScrolled ? 'slide-in' : ''}`}
          >
            {hoverText.text1}
          </h2>
          <h2
            className={`banner-title hover-text ${isHovering ? 'hovered' : ''} ${isScrolled ? 'slide-in' : ''}`}
          >
            {hoverText.text2}
          </h2>
        </div>
      </section>
<h4 className='best-sellers' >OUR BESTSELLER</h4>
      <section className="products">
        <div className="product">
          <img src="https://5.imimg.com/data5/SELLER/Default/2023/6/320016127/LK/AI/TC/50612478/aqua-i-pearl-water-purifier.jpg" alt="Water Purifier 1" />
          <h3>Water Filter Model 1</h3>
          <p>Removes 99.9% pollutants</p>
          <p className="price">$299</p>
          <button onClick={displayProduct}>View</button>
        </div>
        <div className="product">
          <img src="https://aquaultra.in/wp-content/uploads/2021/08/Aqua-Ultra-UVUF-Water-Purifier-1-scaled.jpg" alt="Water Purifier 2" />
          <h3>Water Filter Model 2</h3>
          <p>Perfect for large rooms</p>
          <p className="price">$399</p>
          <button onClick={displayProduct}>View</button>
        </div>
        <div className="product">
          <img src="https://www.aosmithindia.com/wp-content/uploads/2020/10/Z2-3.png" alt="Water Purifier 3" />
          <h3>Water Filter Model 3</h3>
          <p>Quiet and efficient</p>
          <p className="price">$199</p>
          <button onClick={displayProduct}>View</button>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Your Brand - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;
