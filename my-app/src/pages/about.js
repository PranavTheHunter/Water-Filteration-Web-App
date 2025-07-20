import React from 'react';
import './about.css'; // Import the CSS file for styling

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-banner">
        <h1 className="aboutus-title">About Us</h1>
        <p className="aboutus-subtitle">Delivering Pure, Clean Water for a Healthier Tomorrow</p>
      </div>
      
      <div className="aboutus-content">
        <h2 className="aboutus-heading">Our Mission</h2>
        <p className="aboutus-text">
          At Water Filtration Inc., we are committed to providing high-quality water filtration systems that ensure clean, safe, and purified water for homes and businesses alike. With years of experience, we strive to bring the latest innovations in water purification technology, helping communities access fresh and healthy water.
        </p>

        <h2 className="aboutus-heading">Why Choose Us</h2>
        <p className="aboutus-text">
          Our solutions are not only reliable but also eco-friendly, designed to reduce waste and promote sustainability. With a team of experienced engineers and customer-focused service, we offer personalized solutions that meet every customer's unique needs. Trust us to protect your family’s health and ensure the purity of your water supply.
        </p>

        <h2 className="aboutus-heading">Our Commitment to Sustainability</h2>
        <p className="aboutus-text">
          Sustainability is at the core of our philosophy. We are proud to offer filtration systems that are energy-efficient and environmentally friendly. By investing in advanced technologies, we minimize the environmental footprint while maximizing the benefits for both customers and the planet.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
