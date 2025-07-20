import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("customer");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (section) => {
    setLoading(true);
    setError("");
    setData([]);
    try {
      const response = await axios.get(`http://localhost:8081/${section}`);
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeSection);
  }, [activeSection]);

  const renderTable = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (data.length === 0) {
      return <div>No data available</div>;
    }

    return (
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, idx) => (
                <td key={idx}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1 className="sidebar-title">Admin Login</h1>
        <ul className="sidebar-menu">
          <li
            className={`menu-item ${activeSection === "customer" ? "active" : ""}`}
            onClick={() => setActiveSection("customer")}
          >
            Customer
          </li>
          <li
            className={`menu-item ${activeSection === "product" ? "active" : ""}`}
            onClick={() => setActiveSection("product")}
          >
            Product
          </li>
          <li
            className={`menu-item ${
              activeSection === "contactResponse" ? "active" : ""
            }`}
            onClick={() => setActiveSection("contactResponse")}
          >
            Contact Response
          </li>
        </ul>
      </div>
      <div className="content">{renderTable()}</div>
    </div>
  );
};

export default AdminDashboard;
