import React from "react";
import { TextField, Box } from "@mui/material";

const TotalMonthIncomeField = ({ totalMonthIncome, setTotalMonthIncome }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",

        borderRadius: "8px",
      }}
    >
      <TextField
        value={totalMonthIncome}
        onChange={(e) => setTotalMonthIncome(e.target.value)}
        label="Сарын нийт орлогын дүн /төгрөгөөр/"
        variant="outlined"
        fullWidth
        type="number"
        InputProps={{
          inputProps: { min: 0 },
        }}
        style={{ margin: "8px 0" }}
      />
    </Box>
  );
};

export default TotalMonthIncomeField;
