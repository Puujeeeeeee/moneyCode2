"use client";
import React, { useState } from "react";
import { Box, Grid, Typography, Button, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
const SavingContent = () => {
  const [activeTab, setActiveTab] = useState("saving");

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F6F8",
        padding: 4,
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
        <Image src="/images/lend.svg" alt="Icon" width={250} height={250} />
        <Typography
          variant="h5"
          color="#00152E"
          fontWeight="bold"
          sx={{ marginTop: 4 }}
        >
          Танд одоогоор идэвхтэй хуримтлалын данс байхгүй байна.
        </Typography>
        <Link href={"/saving"}>
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
            Хуримтлалын хүсэлт илгээх
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default SavingContent;

// "use client";
// import React, { useState } from "react";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import EmailIcon from "@mui/icons-material/Email";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AddIcon from "@mui/icons-material/Add";
// import { Box, Grid, Typography, Paper, Button } from "@mui/material";
// import Image from "next/image";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";

// const SavingContent = () => {
//   const [activeMiniTab, setActiveMiniTab] = useState("tab1");

//   return (
//     <Box sx={{ width: "100%", height: "100%", borderRadius: 2, p: 3, gap: 4, display: 'flex', flexDirection: 'column' }}>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
//             <Box sx={{ display: 'flex', mb: 2 }}>
//               <Box
//                 onClick={() => setActiveMiniTab("tab1")}
//                 sx={{
//                   width: 120,
//                   height: 40,
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderRadius: '12px 0 0 12px',
//                   cursor: 'pointer',
//                   backgroundColor: activeMiniTab === "tab1" ? "#002147" : "#E3E7EB",
//                   color: activeMiniTab === "tab1" ? "white" : "black"
//                 }}
//               >
//                 Идэвхтэй
//               </Box>
//               <Box
//                 onClick={() => setActiveMiniTab("tab2")}
//                 sx={{
//                   width: 120,
//                   height: 40,
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   cursor: 'pointer',
//                   backgroundColor: activeMiniTab === "tab2" ? "#002147" : "#E3E7EB",
//                   color: activeMiniTab === "tab2" ? "white" : "black"
//                 }}
//               >
//                 Хаасан
//               </Box>
//               <Box
//                 onClick={() => setActiveMiniTab("tab3")}
//                 sx={{
//                   width: 120,
//                   height: 40,
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderRadius: '0 12px 12px 0',
//                   cursor: 'pointer',
//                   backgroundColor: activeMiniTab === "tab3" ? "#002147" : "#E3E7EB",
//                   color: activeMiniTab === "tab3" ? "white" : "black"
//                 }}
//               >
//                 Хүсэлт
//               </Box>
//             </Box>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={4}>
//                 <Paper
//                   elevation={1}
//                   sx={{
//                     height: 212,
//                     borderRadius: 2,
//                     backgroundColor: "#E3E7EB",
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: 3,
//                     "&:hover": { transform: 'scale(1.05)', transition: '0.2s' }
//                   }}
//                 >
//                   {/* Add dynamic content here based on activeMiniTab */}
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <Paper
//                   elevation={1}
//                   sx={{
//                     height: 212,
//                     borderRadius: 2,
//                     backgroundColor: "#E3E7EB",
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: 3,
//                     "&:hover": { transform: 'scale(1.05)', transition: '0.2s' }
//                   }}
//                 >
//                   {/* Add dynamic content here based on activeMiniTab */}
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <Paper
//                   elevation={1}
//                   sx={{
//                     height: 212,
//                     borderRadius: 2,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: 3,
//                   }}
//                 >
//                   <Image
//                     src="/images/day 1.png"
//                     alt="Cube Image"
//                     width={32}
//                     height={32}
//                   />
//                   <Button
//                     sx={{
//                       mt: 4,
//                       backgroundColor: "#E3E7EB",
//                       color: "#0C65C2",
//                       width: 158,
//                       height: 34,
//                       borderRadius: 2,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       textTransform: 'none'
//                     }}
//                     startIcon={<AddIcon />}
//                   >
//                     Хуримтлал
//                   </Button>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
//             <Typography variant="h6" fontWeight="bold" mb={3}>
//               Статистик
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <Selection />
//               </Grid>
//               <Grid item xs={12}>
//                 <Box sx={{ width: "100%", height: 200, border: '1px solid gray', borderRadius: 2 }}></Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//       </Grid>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Typography variant="h6" fontWeight="bold">Итгэлцлийн дүн</Typography>
//               <Box sx={{ width: 88, height: 36, backgroundColor: "#E3E7EB", borderRadius: '50%' }}></Box>
//             </Box>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={5}>
//                 <Paper elevation={1} sx={{ padding: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
//                   <Typography variant="body1" fontWeight="bold">Төв салбар</Typography>
//                   <Box sx={{ display: 'flex', gap: 2 }}>
//                     <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: "#E3E7EB", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <LocalPhoneIcon />
//                     </Box>
//                     <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: "#E3E7EB", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <EmailIcon />
//                     </Box>
//                     <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: "#E3E7EB", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <LocationOnIcon />
//                     </Box>
//                   </Box>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} sm={7}>
//                 <Paper elevation={1} sx={{ padding: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
//                   <Box>
//                     <Typography variant="body2" color="#4D5B6D">Хуримтлагдсан үр шим</Typography>
//                     <Typography variant="h6" fontWeight="bold" color="#334458">4321</Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="body2" color="#4D5B6D">Хүү</Typography>
//                     <Typography variant="h6" fontWeight="bold" color="#334458">4321</Typography>
//                   </Box>
//                 </Paper>
//               </Grid>
//             </Grid>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//               <Button variant="contained" color="primary" sx={{ borderRadius: 2 }}>Итгэлцэл сунгах</Button>
//             </Box>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Typography variant="h6" fontWeight="bold">Хэрэглээ</Typography>
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Typography variant="body2">huulge</Typography>
//                 <Typography variant="body2">sar</Typography>
//               </Box>
//             </Box>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Typography variant="body2" color="#334458">Эхлэх өдөр</Typography>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     defaultValue={dayjs("2022-04-17")}
//                     views={["year", "month", "day"]}
//                     sx={{ width: "100%", mt: 1 }}
//                   />
//                 </LocalizationProvider>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="body2" color="#334458">Дуусах өдөр</Typography>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     defaultValue={dayjs("2022-04-17")}
//                     views={["year", "month", "day"]}
//                     sx={{ width: "100%", mt: 1 }}
//                   />
//                 </LocalizationProvider>
//               </Grid>
//             </Grid>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//               <Button variant="outlined" sx={{ borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Image
//                   src="/svg/excel (1) 1.svg"
//                   alt="Excel Icon"
//                   width={20}
//                   height={20}
//                 />
//                 Татах
//               </Button>
//               <Button variant="outlined" sx={{ borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Image
//                   src="/svg/google-drive-pdf-file 1.jpg"
//                   alt="PDF Icon"
//                   width={20}
//                   height={20}
//                 />
//                 Татах
//               </Button>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default SavingContent;
