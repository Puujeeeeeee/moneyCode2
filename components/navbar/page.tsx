"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // For getting the current path
import Image from "next/image";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import dynamic from "next/dynamic";

// Dynamically import the Loader component to improve performance
const Loader = dynamic(() => import("./Loader"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Navbar = () => {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    // Show the loader when the path changes
    setLoading(true);

    // Simulate a delay for the loader
    const timer = setTimeout(() => setLoading(false), 300);

    return () => clearTimeout(timer);
  }, [pathname]); // Depend on the path so it triggers on change

  const handleSelect = (href: string) => {
    setSelected(href);
  };

  const menuItems = [
    { href: "/main", label: "Home", icon: "/svg/home.svg" },
    { href: "/loan", label: "Loan", icon: "/svg/credit.svg" },
    { href: "/saving", label: "Saving", icon: "/svg/growth.svg" },
  ];

  // Determine background color based on the current pathname
  const getBackgroundColor = () => {
    switch (pathname) {
      case "/loan":
        return "#2855ac";
      case "/main":
      case "/saving":
        return "#0077b6";
      default:
        return selected ? "#2855ac" : "#002147";
    }
  };

  // Handle opening the logout confirmation dialog
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  // Handle closing the logout confirmation dialog
  const handleCloseDialog = (confirmed: boolean) => {
    setLogoutDialogOpen(false);
    if (confirmed) {
      // Perform the logout action, e.g., redirect to the login page
      window.location.href = "/"; // Redirect to the homepage or login page
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" }, // Row on mobile, column on desktop
          alignItems: "center",
          justifyContent: "space-between",
          width: { xs: "100%", md: "85px" }, // Full width on mobile, fixed width on desktop
          height: { xs: "60px", md: "100vh" }, // Fixed height on mobile, full height on desktop
          backgroundColor: getBackgroundColor(), // Background color based on section
          paddingY: { xs: 1, md: 2 },
          paddingX: 1,
          gap: 2,
          transition: "background-color 0.3s ease", // Smooth transition
          position: { xs: "fixed", md: "static" }, // Fixed on mobile
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            alignItems: "center",
          }}
        >
          {menuItems.map((item) => (
            <Box
              key={item.href}
              sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}
            >
              <Link href={item.href}>
                <IconButton
                  onClick={() => handleSelect(item.href)}
                  sx={{
                    backgroundColor:
                      selected === item.href ? "#2855ac" : "transparent", // Active background color for base/save
                    borderRadius: "8px",
                    transition: "background-color 0.3s ease", // Smooth transition
                    "&:hover": {
                      backgroundColor: "#2855ac", // Hover background color for base/save
                    },
                    width: { xs: "80px", md: "60px" },
                    height: { xs: "80px", md: "60px" },
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={`${item.label} Icon`}
                    width={150}
                    height={150}
                  />
                </IconButton>
              </Link>
            </Box>
          ))}
        </Box>
        <Box>
          <IconButton
            onClick={handleLogoutClick} // Open the dialog on logout click
            sx={{
              color: "white",
              fontSize: "40px",
              borderRadius: "8px",
              transition: "background-color 0.3s ease", // Smooth transition
              backgroundColor: selected === "/" ? "#2855ac" : "transparent", // Active background color for logout icon
              "&:hover": {
                backgroundColor: "#2855ac", // Hover background color for logout icon
              },
              width: { xs: "60px", md: "50px" },
              height: { xs: "60px", md: "50px" },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => handleCloseDialog(false)}>
        <DialogTitle>Гарах</DialogTitle>
        <DialogContent>Та гарахдаа итгэлтэй байна уу?</DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)} color="primary">
            Үгүй
          </Button>
          <Button onClick={() => handleCloseDialog(true)} color="primary">
            Тийм
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
