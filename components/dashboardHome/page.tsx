"use client";
import React, { useState, useEffect } from "react";
import LoanContent from "@/components/homeMenu/LoanContent";
import SavingContent from "@/components/homeMenu/SavingContent";
import CardContent from "@/components/homeMenu/CardContent";
import { Box, Grid, Typography, Paper } from "@mui/material";

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState("saving");
  const [userData, setUserData] = useState<any>(null);
  const renderContent = () => {
    switch (activeTab) {
      case "loan":
        return <LoanContent />;
      case "saving":
        return <SavingContent />;
      case "card":
        return <CardContent />;
      default:
        return null;
    }
  };
  const getUserData = async () => {
    const storedUserData = JSON.parse(
      localStorage.getItem("userInformation") ?? ""
    );
    setUserData(storedUserData);
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Box
      sx={{
        backgroundColor: "#F5F6F8",
        width: "100%",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Box className="flex mb-4 w-full justify-between">
        <Typography variant="h6" color="#00152E" fontWeight="bold">
          Дашбоард
        </Typography>
        <Box className="flex items-center gap-2">
          <Typography>Сайн байна уу?</Typography>
          <Typography className="font-semibold text-xl  ">
            {userData?.firstName}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Paper
            onClick={() => setActiveTab("loan")}
            sx={{
              width: "100%",
              height: 64,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: activeTab === "loan" ? "white" : "#E3E7EB",
              color: activeTab === "loan" ? "black" : "#667382",
              boxShadow: activeTab === "loan" ? 3 : 0,
              p: 2,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Зээл
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₮0
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Paper
            onClick={() => setActiveTab("saving")}
            sx={{
              width: "100%",
              height: 64,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: activeTab === "saving" ? "white" : "#E3E7EB",
              color: activeTab === "saving" ? "black" : "#667382",
              boxShadow: activeTab === "saving" ? 3 : 0,
              p: 2,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Хуримтлал
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₮0
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Paper
            onClick={() => setActiveTab("card")}
            sx={{
              width: "100%",
              height: 64,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: activeTab === "card" ? "white" : "#E3E7EB",
              color: activeTab === "card" ? "black" : "#667382",
              boxShadow: activeTab === "card" ? 3 : 0,
              p: 2,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Карт
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₮0
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 6 }}>{renderContent()}</Box>
    </Box>
  );
};

export default DashboardHome;
