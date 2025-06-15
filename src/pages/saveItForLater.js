import React, { useState, useEffect } from 'react';

const SaveItForLater = () => {
  const [saveItForLater, setSaveItForLater] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    const userId = localStorage.getItem("id");
    try {
      const response = await fetch(`http://localhost:8080/get-save-it-for-later?userId=${userId}`);
      const data = await response.json();
      setSaveItForLater(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchWishlist();
  }, []);

  const addCartProduct = async (id) => {
    try {
      const userId = localStorage.getItem("id");
      const productId = id;
      const response = await fetch("http://localhost:8080/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1, // You might want to dynamically set the quantity
        }),
      });
  
      const result = await response.json();
      console.log(result)
      alert("Product Added")
      fetchWishlist()
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const deleteProduct = async (id) => {
    console.log(id)
    try {
      const userId = localStorage.getItem("id");
      const productId = id;
      const response = await fetch("http://localhost:8080/removeFromSaved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode:"cors",
        body: JSON.stringify({
          userId,
          productId,
        }),
      });
      const result = await response.json();
      console.log(result)
      fetchWishlist()
      // Dispatch the action based on the API response
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: 'darkblue',fontWeight:"bolder",fontSize:"36px" }}>Saved Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : saveItForLater.length === 0 ? (
        <p>No products in Wishlist</p>
      ) : (
        <div className="wishlist-container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {saveItForLater.map((product) => {
            console.log(product.product)
            return(
            <div
              key={product.product._id}
              className="product-card"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                margin: '10px',
                width: '250px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                cursor: 'pointer',
                display:"flex",
                flexDirection:"column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={product.product.image}
                alt={product.product.name}
                style={{ maxWidth: '100%', borderRadius: '8px', height:"200px" }}
              />
              <h3 style={{ color: 'darkgreen', margin: '10px 0' }}>{product.product.name}</h3>
              <p>{product.product.category}</p>
              <p>${product.product.price}</p>
              <button style={{marginTop:"10%", backgroundColor:"yellow", padding:"10px",alignSelf:"center",borderRadius:"9px"}}
                 onClick={() => addCartProduct(product.product._id)}
                >
                Add to Cart
            </button>
            <button style={{marginTop:"10%", backgroundColor:"yellow", padding:"10px",alignSelf:"center",borderRadius:"9px"}}
                 onClick={() => deleteProduct(product.product._id)}
                >
                Remove
            </button>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default SaveItForLater;
