const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;   
const client = twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Filters"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database");
  }
});

// Sign Up
app.post('/Sign', (req, res) => {
  const sql = "INSERT INTO customers (name, ph_num, email) VALUES (?)";
  const values = [
    req.body.name,
    req.body.ph_num,
    req.body.email
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json("error");
    }
    return res.json(data);
  });
});

// Login
app.post('/Login', (req, res) => {
  const { email, ph_num } = req.body;

  const sql = "SELECT email FROM customers WHERE email = ? AND ph_num = ?";
  db.query(sql, [email, ph_num], (err, results) => {
    if (err) {
      return res.json("error");
    }

    if (results.length > 0) {
      return res.json({ email: results[0].email });
    } else {
      return res.json("error");
    }
  });
});

// Products
app.post('/Products', (req, res) => {
  const { email, Product_name, price, purchased_on, renewal } = req.body;

  db.query('SELECT cus_id FROM customers WHERE email = ?', [email], (err, results) => {
      if (err || results.length === 0) {
          return res.status(400).json("Customer not found");
      }

      const cus_id = results[0].cus_id;

      const sql = 'INSERT INTO products (product_name, price, cus_id, purchased_on, renewal) VALUES (?, ?, ?, ?, ?)';
      const values = [
          Product_name,
          price,
          cus_id,
          purchased_on,
          renewal
      ];

      db.query(sql, values, (err) => {
          if (err) {
              console.error("Error adding purchase:", err);
              return res.status(500).json("Error adding purchase");
          }
          return res.json('success');
      });
  });
});

// Check Warranty
// Check Warranty
app.post('/check-warranty', (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  db.query('SELECT cus_id, ph_num FROM customers WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    
    if (results.length === 0) {
      console.log("Customer not found");
      return res.status(400).json({ message: "Customer not found" });
    }

    const cus_id = results[0].cus_id;
    const phone = results[0].ph_num;

    db.query('SELECT product_name, purchased_on, renewal, sms_sent FROM products WHERE cus_id = ?', [cus_id], (err, products) => {
      if (err) {
        console.error("Error querying products:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (products.length === 0) {
        console.log("No products found for this customer");
        return res.status(400).json({ message: "No products found" });
      }

      let expiredProducts = [];
      
      products.forEach(product => {
        const { product_name, purchased_on, renewal, sms_sent } = product;
        const purchaseDate = new Date(purchased_on);
        const renewalPeriod = parseFloat(renewal.split(':')[0]);
        const expiryDate = new Date(purchaseDate.getTime() + renewalPeriod * 3600 * 1000);

        if (expiryDate < new Date() && sms_sent === 0) {
          expiredProducts.push(product_name);
        }
      });

      if (expiredProducts.length > 0) {
        const message = `The warranty for the following products has expired: ${expiredProducts.join(', ')}. Please renew.`;
        
        client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
          to: '+91' + phone // Prepend +91 to the phone number
        })
        .then(() => {
          console.log("SMS sent successfully to:", phone);

          // Update the sms_sent status to 1 for each expired product individually
          expiredProducts.forEach(productName => {
            db.query('UPDATE products SET sms_sent = 1 WHERE product_name = ? AND cus_id = ?', [productName, cus_id], (err) => {
              if (err) {
                console.error("Error updating sms_sent status for product:", productName, err);
              } else {
                console.log(`Updated sms_sent for product: ${productName}`);
              }
            });
          });

          res.json({ message: "SMS sent successfully" });
        })
        .catch(err => {
          console.error("Error sending SMS:", err);
          res.status(500).json({ message: "Error sending SMS", error: err });
        });
      } else {
        res.json({ message: "No expired products" });
      }
    });
  });
});

app.post('/contact', (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: 'Email and message are required' });
  }

  // Query to get cus_id from the customers table
  db.query('SELECT cus_id FROM customers WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying customers table:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const cus_id = results[0].cus_id;

    // Insert the message into contact_responses table
    const sql = 'INSERT INTO contact_responses (cus_id, email, message) VALUES (?, ?, ?)';
    const values = [cus_id, email, message];

    db.query(sql, values, (err) => {
      if (err) {
        console.error('Error saving contact form data:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.json({ message: 'Message received successfully!' });
    });
  });
});

///////
// Fetch all customer info
app.get('/customer', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ message: "Error fetching customers" });
    }
    res.json(results);
  });
});

// Fetch all product info
app.get('/product', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
    res.json(results);
  });
});

// Fetch all contact responses
app.get('/contactResponse', (req, res) => {
  db.query('SELECT * FROM contact_responses', (err, results) => {
    if (err) {
      console.error("Error fetching contact responses:", err);
      return res.status(500).json({ message: "Error fetching contact responses" });
    }
    res.json(results);
  });
});

// Update customer info
app.put('/update-customer', (req, res) => {
  const { cus_id, name, ph_num, email } = req.body;
  const sql = "UPDATE customers SET name = ?, ph_num = ?, email = ? WHERE cus_id = ?";
  
  db.query(sql, [name, ph_num, email, cus_id], (err, result) => {
    if (err) {
      console.error("Error updating customer:", err);
      return res.status(500).json({ message: "Error updating customer" });
    }
    res.json({ message: "Customer updated successfully" });
  });
});

// Update product info
app.put('/update-product', (req, res) => {
  const { product_id, product_name, price, purchased_on, renewal } = req.body;
  const sql = "UPDATE products SET product_name = ?, price = ?, purchased_on = ?, renewal = ? WHERE product_id = ?";

  db.query(sql, [product_name, price, purchased_on, renewal, product_id], (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ message: "Error updating product" });
    }
    res.json({ message: "Product updated successfully" });
  });
});

// Delete customer info
app.delete('/delete-customer/:cus_id', (req, res) => {
  const { cus_id } = req.params;
  const sql = "DELETE FROM customers WHERE cus_id = ?";
  
  db.query(sql, [cus_id], (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err);
      return res.status(500).json({ message: "Error deleting customer" });
    }
    res.json({ message: "Customer deleted successfully" });
  });
});

// Delete product info
app.delete('/delete-product/:product_id', (req, res) => {
  const { product_id } = req.params;
  const sql = "DELETE FROM products WHERE product_id = ?";
  
  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ message: "Error deleting product" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});


app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
