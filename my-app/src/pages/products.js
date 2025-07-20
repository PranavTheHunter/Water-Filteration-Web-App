import React from 'react';
import './product.css';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie for handling cookies
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Domestic RO Water Filter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ZgyiotCCPQWA0seEP0sk11lDSNFtp2sF4w&s",
    price: 199, // Store price as a number
  },
  {
    id: 2,
    name: "Easy-to-Use Manual RO Filter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRurnTmlY5OXDKV6k90znO0pkTNeYN0GAvgNQ&s",
    price: 159, // Store price as a number
  },
  {
    id: 3,
    name: "Plastic Domestic RO Filter",
    image: "https://tiimg.tistatic.com/fp/1/007/822/easy-to-use-remove-impurities-bacteria-with-plastic-manual-domestic-ro-water-filter-478.jpg",
    price: 179, // Store price as a number
  },
  {
    id: 4,
    name: "Croma RO Water Purifier",
    image: "https://media.croma.com/image/upload/v1726657029/Croma%20Assets/Small%20Appliances/Water%20Purifier/Images/301162_3_dwe1oz.png",
    price: 249, // Store price as a number
  },
  {
    id: 5,
    name: "Pure Drop Water Purifier",
    image: "https://5.imimg.com/data5/SELLER/Default/2024/2/392791727/FY/ZM/QV/4103899/pure-drop-ro-uv-uf-water-purifier-pd-09-copper-model-500x500.jpeg",
    price: 220, // Store price as a number
  },
  {
    id: 6,
    name: "Aqua I Pearl Water Purifier",
    image: "https://5.imimg.com/data5/SELLER/Default/2023/6/320016127/LK/AI/TC/50612478/aqua-i-pearl-water-purifier.jpg",
    price: 199, // Store price as a number
  },
  {
    id: 7,
    name: "Aqua Ultra UVUF Purifier",
    image: "https://aquaultra.in/wp-content/uploads/2021/08/Aqua-Ultra-UVUF-Water-Purifier-1-scaled.jpg",
    price: 269, // Store price as a number
  },
  {
    id: 8,
    name: "A.O. Smith Z2 Water Purifier",
    image: "https://www.aosmithindia.com/wp-content/uploads/2020/10/Z2-3.png",
    price: 299, // Store price as a number
  },
  {
    id: 9,
    name: "TATA Ion Water-Filter Plus",
    image: "https://cdn.shopify.com/s/files/1/1748/6623/files/homepage-products-big.png?5761113296646963532",
    price: 999, // Store price as a number
  },
];

const ProductPage = () => {
  const navigate = useNavigate();
  const handleBuyNow = async (product_name, product_price) => {
    // Fetch customer ID from the cookie
    alert("do you want to buy this product");
    const customerEmail = Cookies.get('email'); // Assuming the email is stored in the cookie
    if (!customerEmail) {
      alert("Please log in to purchase a product.");
      navigate('/login')
      
      return;
    }

    // Assuming the email is used to find the customer ID in the database
    try {
      const response = await axios.post('http://localhost:8081/Products', {
        email: customerEmail,
        Product_name: product_name,
        price: product_price, // Send the price as a number
        purchased_on: new Date().toISOString(),
        renewal: "168:00:00" // 7 days in TIME format
      });

      if (response.data === 'success') {
        alert("Purchase successful!");
      } else {
        alert("Error in purchase.");
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="product-page-container">
      <h1 className="page-title">Our Water Filtration Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <button className="buy-now-btn" onClick={() => handleBuyNow(product.name, product.price)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
