import React, { useState, useEffect } from "react";
import Sentiment from "sentiment"; // Import Sentiment package

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({}); // Stores feedback per order
  const [sentimentAnalysis, setSentimentAnalysis] = useState({}); // Stores sentiment per order

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("id");

      if (!userId) {
        console.error("User ID not found. Please log in.");
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8080/getOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (orderId, value) => {
    setFeedback({ ...feedback, [orderId]: value });

    // Perform sentiment analysis
    const sentiment = new Sentiment();
    const result = sentiment.analyze(value);

    // Determine sentiment category
    let sentimentCategory = "Neutral";
    if (result.score > 0) {
      sentimentCategory = "Positive";
    } else if (result.score < 0) {
      sentimentCategory = "Negative";
    }

    // Store sentiment result
    setSentimentAnalysis({ ...sentimentAnalysis, [orderId]: sentimentCategory });
  };

  const submitFeedback = async (orderId) => {
    if (!feedback[orderId] || feedback[orderId].trim() === "") {
      alert("Please enter feedback before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/submitFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          orderId,
          feedback: feedback[orderId],
          sentiment: sentimentAnalysis[orderId], // Sending sentiment result
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      alert("Feedback submitted successfully!");
      setFeedback({ ...feedback, [orderId]: "" }); // Clear input after submission
      setSentimentAnalysis({ ...sentimentAnalysis, [orderId]: "Neutral" }); // Reset sentiment
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "darkblue", fontWeight: "bolder", fontSize: "36px" }}>
        My Orders
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {orders.map((product) => (
            <div
              key={product?.product?._id}
              className="product-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                margin: "10px",
                width: "300px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={product?.product?.image || "https://via.placeholder.com/250"}
                alt={product?.product?.name || "Product Image"}
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  height: "200px",
                }}
              />
              <h3 style={{ color: "darkgreen", margin: "10px 0", textAlign: "center" }}>
                {product?.product?.name || "Unknown Product"}
              </h3>
              <p>{product?.product?.category || "No category"}</p>
              <p>${product?.product?.price || "0.00"}</p>

              {/* Feedback Section */}
              <textarea
                placeholder="Enter your feedback"
                value={feedback[product?.product?._id] || ""}
                onChange={(e) => handleFeedbackChange(product?.product?._id, e.target.value)}
                style={{
                  width: "90%",
                  height: "60px",
                  margin: "10px 0",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  resize: "none",
                }}
              ></textarea>

              {/* Display Sentiment Analysis Result */}
              {feedback[product?.product?._id] && (
                <p style={{ color: sentimentAnalysis[product?.product?._id] === "Positive" ? "green" :
                  sentimentAnalysis[product?.product?._id] === "Negative" ? "red" : "gray"
                }}>
                  Sentiment: {sentimentAnalysis[product?.product?._id]}
                </p>
              )}

              <button
                style={{
                  marginTop: "5px",
                  padding: "8px 15px",
                  backgroundColor: "darkblue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "navy")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "darkblue")}
                onClick={() => submitFeedback(product?.product?._id)}
              >
                Submit Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;