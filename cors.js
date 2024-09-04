// import express from "express";
// import cors from "cors";

// const app = express();

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // CORS configuration
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow requests from this origin
//     methods: "GET,POST,PUT,DELETE,OPTIONS", // Allow specific HTTP methods
//     allowedHeaders: "Content-Type, Authorization", // Allow specific headers
//   })
// );

// // Route to handle POST requests
// app.post("/loan-request-los/create-loan-request", (req, res) => {
//   const requestData = req.body;
//   // Handle the request data here (e.g., save to a database)
//   console.log("Request received:", requestData);

//   // Example response
//   res.status(200).json({ message: "Loan request created successfully!" });
// });

// // Start the server
// app.listen(8082, () => {
//   console.log("Server is running on port 8082");
// });

const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your React app
  })
);

app.listen(8082, () => {
  console.log("Server running on port 8082");
});
