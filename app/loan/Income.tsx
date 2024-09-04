import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

interface IncomeDropdownProps {
  incomeList: { id: string; name: string }[]; // Assuming each income has an id and name
  selectedIncome: string;
  setSelectedIncome: (value: string) => void;
}

const IncomeDropdown: React.FC<IncomeDropdownProps> = ({
  incomeList,
  selectedIncome,
  setSelectedIncome,
}) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedIncome(event.target.value as string);
  };

  return (
    <FormControl variant="outlined" fullWidth style={{ marginBottom: "10px" }}>
      <InputLabel htmlFor="income-select">Орлогын төрөл</InputLabel>
      <Select
        value={selectedIncome}
        onChange={handleChange}
        input={<OutlinedInput id="income-select" label="Орлогын төрөл" />}
        style={{ height: 50 }}
      >
        {incomeList.map((income) => (
          <MenuItem key={income.id} value={income.name}>
            {income.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default IncomeDropdown;
