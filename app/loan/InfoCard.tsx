import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface InfoCardProps {
  label: string;
  value?: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <Card variant="contained" className=" rounded-md shadow  ">
      <CardContent className="shadow-lg w-full  flex items-center gap-1 mt-1">
        <Typography variant="subtitle2" className=" font-medium ">
          {label}:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {value || "Мэдээлэл олдсонгүй"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
