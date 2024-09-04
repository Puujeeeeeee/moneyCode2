import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface CollateralDropdownProps {
  collateralList: string[];
  selectedCollateral: string;
  setSelectedCollateral: (value: string) => void;
}

const CollateralDropdown: React.FC<CollateralDropdownProps> = ({
  collateralList,
  selectedCollateral,
  setSelectedCollateral,
}) => {
  const [error, setError] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedCollateral(value);

    if (!value) {
      setError("Please select a valid collateral type");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (selectedCollateral) {
      setError("");
    }
  }, [selectedCollateral]);

  return (
    <FormControl variant="outlined" fullWidth error={!!error}>
      <InputLabel>Барьцаа хөрөнгө</InputLabel>
      <Select
        value={selectedCollateral}
        onChange={handleChange}
        label="Барьцаа хөрөнгө"
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          height: "50px",
        }}
      >
        {collateralList.map((collateral, index) => (
          <MenuItem key={index} value={collateral}>
            <div style={{ marginLeft: "5px", color: "#333" }}>{collateral}</div>
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CollateralDropdown;
