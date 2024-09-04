"use client";
import React, { useState, useEffect } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PercentIcon from "@mui/icons-material/Percent";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Selection from "@/components/dashboardHome/select";
import Link from "next/link";
import UserProfile from "../userProfile/page";
import { Box, Grid, Typography, Button, Paper } from "@mui/material";
import Image from "next/image";
const HomePageContainer = () => {
  const [activeMiniTab, setActiveMiniTab] = useState("tab1");
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("firstVisit");
    if (!isFirstVisit) {
      setFirstVisit(true);
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F6F8",
        padding: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Content Section */}
      <Box
        sx={{
          marginTop: 6,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Image src="/images/lends.svg" alt="Icon" width={250} height={250} />
        <Typography
          variant="h5"
          color="#00152E"
          fontWeight="bold"
          sx={{ marginTop: 2 }}
        >
          Танд одоогоор идэвхтэй зээлийн мэдээлэл байхгүй байна.
        </Typography>
        <Link href={"/loan"}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginTop: 4,
              backgroundColor: "#007BFF",
              textTransform: "none",
              borderRadius: 2,
              paddingX: 4,
              paddingY: 1,
            }}
          >
            Зээлийн хүсэлт илгээх
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
export default HomePageContainer;

// <div className="w-full h-full rounded-lg flex flex-col gap-4">
// {firstVisit && (
//   <div className="w-full h-16 flex justify-center items-center">
//     <Button
//       variant="contained"
//       color="primary"
//       className="rounded-xl"
//       onClick={() => setFirstVisit(false)}
//     >
//       Submit Loan Request
//     </Button>
//   </div>
// )}
// <div className="flex gap-4 flex-wrap">
//   <div className="w-full lg:w-1/2 h-[320px] bg-white rounded-xl p-4 flex flex-col">
//     <div className="flex mb-4">
//       <div
//         onClick={() => setActiveMiniTab("tab1")}
//         className={`w-[120px] h-[40px] flex justify-center items-center border rounded-l-xl cursor-pointer ${
//           activeMiniTab === "tab1"
//             ? "bg-[#002147] text-white"
//             : "bg-[#E3E7EB]"
//         }`}
//       >
//         Идэвхтэй
//       </div>
//       <div
//         onClick={() => setActiveMiniTab("tab2")}
//         className={`w-[120px] h-[40px] flex justify-center items-center border cursor-pointer ${
//           activeMiniTab === "tab2"
//             ? "bg-[#002147] text-white"
//             : "bg-[#E3E7EB]"
//         }`}
//       >
//         Хаасан
//       </div>
//       <div
//         onClick={() => setActiveMiniTab("tab3")}
//         className={`w-[120px] h-[40px] flex justify-center items-center border rounded-r-xl cursor-pointer ${
//           activeMiniTab === "tab3"
//             ? "bg-[#002147] text-white"
//             : "bg-[#E3E7EB]"
//         }`}
//       >
//         Хүсэлт
//       </div>
//     </div>
//     <div className="flex justify-between flex-wrap">
//       <div className="w-[200px] h-[212px] border bg-gray-200 rounded-xl flex flex-col p-6 hover:scale-105 duration-200 active:ring-1 ring-blue-400">
//         {/* Content for mini tab 1 */}
//       </div>
//       <div className="w-[200px] h-[212px] border bg-gray-200 rounded-xl flex flex-col p-6 hover:scale-105 duration-200 active:ring-1 ring-blue-400">
//         {/* Content for mini tab 2 */}
//       </div>
//       <div className="w-[200px] h-[212px] border bg-gray-200 rounded-xl flex flex-col p-6 hover:scale-105 duration-200 active:ring-1 ring-blue-400">
//         {/* Content for mini tab 3 */}
//       </div>
//     </div>
//   </div>
//   <div className="w-full lg:w-1/2 h-[320px] bg-white rounded-xl p-4 flex">
//     <div className="w-full lg:w-[50%] h-full">
//       <p className="font-bold mt-3">Статистик</p>
//     </div>
//     <div className="w-full lg:w-[50%] h-full flex flex-col gap-5">
//       <Selection />
//       <div className="w-full h-full border border-gray-300 rounded-xl"></div>
//     </div>
//   </div>
// </div>
// <div className="flex gap-4 flex-wrap">
//   <div className="w-full lg:w-1/2 h-[580px] bg-white rounded-xl flex flex-col gap-10 p-4">
//     <div className="flex justify-between">
//       <div className="flex flex-col">
//         <p className="font-semibold text-[18px]"> Зээлийн нийт дүн</p>
//       </div>
//       <div className="w-[142px] h-[30px] bg-[#FB4D46] rounded-full flex justify-center items-center text-white">
//         Hello world
//       </div>
//     </div>
//     <div className="flex justify-center gap-3 flex-wrap">
//       <div className="flex w-[177px] h-[100px] bg-gray-100 flex-col p-4 justify-between rounded-xl">
//         <p className="font-semibold">Төв салбар</p>
//         <div className="flex gap-3">
//           <div className="w-[40px] h-[40px] border rounded-full flex items-center justify-center bg-gray-200">
//             <LocalPhoneIcon />
//           </div>
//           <div className="w-[40px] h-[40px] border rounded-full flex items-center justify-center bg-gray-200">
//             <EmailIcon />
//           </div>
//           <div className="w-[40px] h-[40px] border rounded-full flex items-center justify-center bg-gray-200">
//             <LocationOnIcon />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col justify-between">
//         <div className="w-[222px] h-[44px] bg-gray-100 rounded-xl flex justify-between items-center p-4">
//           <div className="flex gap-2">
//             <AccessTimeIcon />
//             <p className="text-[14px] text-[#667382]">Хугацаа</p>
//           </div>
//           <p>cap</p>
//         </div>
//         <div className="w-[222px] h-[44px] bg-gray-100 rounded-xl flex justify-between items-center p-4">
//           <div className="flex gap-2">
//             <PercentIcon />
//             <p className="text-[14px] text-[#667382]">Хүү</p>
//           </div>
//           <p>cap</p>
//         </div>
//       </div>
//       <div className="flex flex-col justify-between">
//         <div className="w-[222px] h-[44px] bg-gray-100 rounded-xl flex justify-between items-center p-4">
//           <div className="flex gap-2">
//             <ArticleIcon />
//             <p className="text-[14px] text-[#667382]">Авсан огноо</p>
//           </div>
//           <p>cap</p>
//         </div>
//         <div className="w-[222px] h-[44px] bg-gray-100 rounded-xl flex justify-between items-center p-4">
//           <div className="flex gap-2">
//             <AssignmentIcon />
//             <p className="text-[14px] text-[#667382]">Хаах огноо</p>
//           </div>
//           <p>cap</p>
//         </div>
//       </div>
//     </div>
//     <div className="flex gap-3 flex-wrap">
//       <Button variant="outlined" className="rounded-xl">
//         Зээл хаах
//       </Button>
//       <Button variant="contained" className="rounded-xl">
//         Зээл төлөх
//       </Button>
//     </div>
//   </div>
//   <div className="w-full lg:w-1/2 h-[580px] bg-white rounded-xl p-4">
//     <div className="flex justify-between">
//       <p className="font-semibold text-[18px]">
//         Зээл эргэн төлөлтийн хуваарь
//       </p>
//     </div>
//   </div>
// </div>
// </div>
