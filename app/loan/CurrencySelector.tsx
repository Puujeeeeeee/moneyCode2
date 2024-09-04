import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";

interface CurrencyModel {
  marker: string;
  name: string;
}

interface SubProduct {
  id: number;
  currencyModel: CurrencyModel;
}

interface Product {
  subProducts: SubProduct[];
}

interface CurrencySelectorProps {
  currentProduct: Product | null;
  setCurrencyIndex: (index: number) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentProduct,
  setCurrencyIndex,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<number | null>(null);

  const handleCurrencyClick = (index: number) => {
    setSelectedCurrency(index);
    setCurrencyIndex(index);
  };

  return (
    <>
      {currentProduct?.subProducts?.some(
        (subProduct) => subProduct.currencyModel
      ) && (
        <Grid
          container
          spacing={2}
          sx={{ mt: 2, p: 2, backgroundColor: "#fff", borderRadius: "8px" }}
        >
          {currentProduct.subProducts.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Paper
                elevation={selectedCurrency === index ? 6 : 2}
                sx={{
                  p: 2,
                  backgroundColor:
                    selectedCurrency === index ? "blue" : "#e3f2fd",
                  color: selectedCurrency === index ? "#fff" : "#000",
                  cursor: "pointer",
                  borderRadius: "8px",
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => handleCurrencyClick(index)}
                aria-pressed={selectedCurrency === index}
                role="button"
              >
                <Typography variant="h6" component="p">
                  {item.currencyModel.marker}
                </Typography>
                <Typography variant="body1" component="p">
                  {item.currencyModel.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default CurrencySelector;
import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";

interface CurrencyModel {
  marker: string;
  name: string;
}

interface SubProduct {
  id: number;
  currencyModel: CurrencyModel;
}

interface Product {
  subProducts: SubProduct[];
}

interface CurrencySelectorProps {
  currentProduct: Product | null;
  setCurrencyIndex: (index: number) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentProduct,
  setCurrencyIndex,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<number | null>(null);

  const handleCurrencyClick = (index: number) => {
    setSelectedCurrency(index);
    setCurrencyIndex(index);
  };

  return (
    <>
      {currentProduct?.subProducts?.some(
        (subProduct) => subProduct.currencyModel
      ) && (
        <Grid
          container
          spacing={2}
          sx={{ mt: 2, p: 2, backgroundColor: "#fff", borderRadius: "8px" }}
        >
          {currentProduct.subProducts.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Paper
                elevation={selectedCurrency === index ? 6 : 2}
                sx={{
                  p: 2,
                  backgroundColor:
                    selectedCurrency === index ? "blue" : "#e3f2fd",
                  color: selectedCurrency === index ? "#fff" : "#000",
                  cursor: "pointer",
                  borderRadius: "8px",
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => handleCurrencyClick(index)}
                aria-pressed={selectedCurrency === index}
                role="button"
              >
                <Typography variant="h6" component="p">
                  {item.currencyModel.marker}
                </Typography>
                <Typography variant="body1" component="p">
                  {item.currencyModel.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default CurrencySelector;
