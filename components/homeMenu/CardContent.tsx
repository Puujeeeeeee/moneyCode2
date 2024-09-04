import { Box, Grid, Typography, Button, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
const CardContent = () => (
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
      <Image src="/images/card_empty.svg" alt="Icon" width={250} height={250} />
      <Typography
        variant="h5"
        color="#00152E"
        fontWeight="bold"
        sx={{ marginTop: 4 }}
      >
        Танд одоогоор идэвхтэй карт байхгүй байна.
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
          Карт захиалах
        </Button>
      </Link>
    </Box>
  </Box>
);
export default CardContent;

// <div className="w-full h-full rounded-lg flex gap-4">
// <div className="w-1/2 h-[915px] bg-white rounded-lg p-4 flex flex-col justify-between">
//   <div className="flex flex-col gap-8">
//     <p className="text-[18px] font-semibold">Platinum</p>
//     <div className="flex flex-col gap-4">
//       <p className="text-[15px] text-[#8298AB]">20312754959</p>
//       <div className="flex">
//         <p className="text-[15px] text-[#00152E] font-medium">
//           4573 1235 4423 2388
//         </p>
//         <p className="pr-5 text-[15px] text-[#00152E] font-medium">02/24</p>
//       </div>
//       <p className="text-[15px] text-[#304659] font-semibold">
//         B.Purevsambuu
//       </p>
//     </div>
//     <div>
//       <Image
//         src="/images/Rectangle 5514.png"
//         alt="Cube Image"
//         className="w-56 h-96"
//         width={200}
//         height={200}
//       />
//     </div>
//     <div className="flex justify-between items-center">
//       <div className="flex flex-col gap-4 ">
//         <div className="flex w-[180px] h-[20px] justify-between hover:underline">
//           <p className="text-[#00152E] text-[15px] font-semibold">
//             Пин код солих
//           </p>
//           <ArrowRightIcon />
//         </div>
//         <div className="flex w-[180px] h-[20px] justify-between  hover:underline">
//           <p className="text-[#00152E] text-[15px] font-semibold">
//             Интернет пин код
//           </p>
//           <ArrowRightIcon />
//         </div>
//         <div className="flex w-[180px] h-[20px] justify-between  hover:underline">
//           <p className="text-[#00152E] text-[15px] font-semibold">
//             Төлөв солих
//           </p>
//           <ArrowRightIcon />
//         </div>
//       </div>
//       <div className="flex gap-3 h-[45px]">
//         <Button variant="outlined" className="rounded-xl">
//           Карт захиалах
//         </Button>
//         <Button variant="contained" className="rounded-xl">
//           Төлбөр төлөх
//         </Button>
//       </div>
//     </div>
//   </div>
// </div>
// <div className="flex w-1/2 flex-col gap-4">
//   <div className="w-[580px] h-[630px] bg-white rounded-xl p-4">
//     <div className="flex justify-between">
//       <p className="text-[18px] font-semibold "> Хэрэглээ</p>
//     </div>
//   </div>
//   <div className="w-[580px] h-[270px] rounded-xl bg-white p-4">world</div>
// </div>
// </div>
