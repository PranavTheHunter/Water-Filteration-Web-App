import React, { useState } from 'react';
import './contact.css'; // Import the CSS file for styling

const ContactUs = () => {
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
      const response = await fetch('http://localhost:8081/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage('Thank you for contacting us!');
        document.getElementById('contactForm').reset(); // Clear the form
      } else {
        setStatusMessage(`Failed to send message: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatusMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="contactus-container">
      <div className="contactus-banner">
        <h1 className="contactus-title">Contact Us</h1>
        <p className="contactus-subtitle">We'd Love to Hear From You</p>
      </div>

      <div className="contactus-content">
        <h2 className="contactus-heading">Get in Touch</h2>
        <p className="contactus-text">
          If you have any questions or need assistance with our water filtration products, feel free to reach out to us. We are here to help you with any inquiries or support you need.
        </p>

        <form id="contactForm" className="contactus-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required className="fade-in-input" />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="5" required className="fade-in-textarea"></textarea>

          <button type="submit" className="contactus-btn fade-in-btn">Submit</button>
        </form>

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default ContactUs;
