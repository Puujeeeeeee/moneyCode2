// server.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allow specific HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allow specific headers
  })
);


app.post("/loan-request-los/create-loan-request", (req, res) => {
  const requestData = req.body;
  console.log("Request received:", requestData);
  // Process the request data here (e.g., save to a database)

  // Example response
  res
    .status(200)
    .json({ message: "Loan request created successfully!", data: requestData });
});

// Start the server and listen on port 8082
app.listen(8082, () => {
  console.log("Server is running on port 8082 hha");
});
