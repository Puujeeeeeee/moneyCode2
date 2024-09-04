"use client";
import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";

import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import {
  Box,
  Grid,
  Typography,
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const UserProfile = () => {
  const [userData, setUserData] = useState<any>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const getUserData = async () => {
    const storedUserData = JSON.parse(
      localStorage.getItem("userInformation") ?? ""
    );
    setUserData(storedUserData);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(""));

  return (
    <div className="w-16 h-[100%] bg-gray-300">
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: "50%",
          right: drawerOpen ? 350 : 0, // Adjust icon position based on drawer state
          transform: "translateY(-50%)",
          zIndex: 1300, // Ensure it's above other elements
        }}
      >
        {drawerOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        variant="persistent"
        sx={{
          "& .MuiDrawer-paper": {
            width: 350,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
            overflowY: "auto", // Allow scrolling if content exceeds drawer height
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "gray.500",
            padding: 2,
            width: 340, // Fixed width for drawer
            height: "100%",
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <VisibilityIcon fontSize="small" /> {/* Smaller icons */}
              </Grid>
              <Grid item>
                <NotificationsIcon fontSize="small" />
              </Grid>
              <Grid item>
                <PersonIcon fontSize="small" />
              </Grid>
            </Grid>

            <Grid
              item
              container
              direction="column"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <Image
                  src="/images/usephoto.png"
                  alt="user"
                  width={60} // Smaller image
                  height={60}
                  style={{ borderRadius: "50%" }}
                />
              </Grid>
              <div className="flex flex-col items-center justify-center mt-4">
                <Typography variant="body1">{userData?.lastName}</Typography>{" "}
                {/* Smaller font */}
                <Typography variant="body2" className="font-semibold">
                  {userData?.firstName}
                </Typography>
              </div>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid item>
              <Box
                sx={{
                  backgroundColor: "grey.300",
                  padding: 2, // Reduce padding
                  borderRadius: 1,
                }}
              >
                <Grid container direction="column" spacing={1}>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      Утасны дугаар
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      {userData?.phone}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      И-мэйл хаяг
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      {userData?.email}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      fontWeight="bold"
                    >
                      Регистрийн дугаар
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      {userData?.regNo}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Typography className="px-4 mt-4 font-semibold">
              Календар
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                <DemoItem label="">
                  <DateCalendar
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Box>
      </Drawer>
    </div>
  );
};

export { UserProfile };
