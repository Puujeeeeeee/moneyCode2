// components/Loader.js
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Loader from "@/app/loan/BackLoader";
const MainLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
      }}
    >
      <Loader />
    </Box>
  );
};

export default MainLoader;
