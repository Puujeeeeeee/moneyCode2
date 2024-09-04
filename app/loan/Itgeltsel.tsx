import React, { useState, useEffect } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  TextField,
  Step,
  StepLabel,
  Slider,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import requestHandlerCustom from "./RequestHandlerCustom";
import { WidthFull } from "@mui/icons-material";

interface Contract {
  contractNo: string;
  productName: string;
  branchName: string;
  currencyID: string;
  savingBalance: string;
  interestRateYearDecimal: string;
}

const ItgeltselPage = () => {
  const [contractData, setContractData] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [dedicationData, setDedicationData] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDrop, setSelectedDrop] = useState<any>({});
  const [percentage, setPercentage] = useState(80);
  const [calculatedValue, setCalculatedValue] = useState("0");
  const [bankAccountList, setBankAccountList] = useState([]);
  const [selectedBankAcc, setSelectedBankAcc] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>({});
  const minDate = dayjs();
  const maxDate = dayjs().add(45, "day");
  const [bankAccountType, setBankAccountType] = useState();

  const userData = JSON.parse(localStorage.getItem("userInformation"));

  // Fetch product and category data
  useEffect(() => {
    const fetchCategoryAndProduct = async () => {
      try {
        const categoryResponse = await axios.get(
          "https://gateway.invescore.mn/api-test/loan-product/get-all-categories-los",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const filteredCategory = categoryResponse.data.find(
          (category: any) => category.id === 6
        );

        if (filteredCategory) {
          const productResponse = await axios.get(
            `https://gateway.invescore.mn/api-test/loan-product/get-all-products-los?categoryId=${filteredCategory.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const filteredProduct = productResponse.data.find(
            (product: any) => product.id === 34
          );

          if (filteredProduct) {
            const loanCurrencies = filteredProduct.loanCurrencies[0];

            setSelectedDrop({
              productId: filteredProduct?.id,
              currencyId: loanCurrencies?.id,
              categoryId: filteredCategory?.id,
              name: filteredProduct.name,
            });
          } else {
            console.error("Product with id=34 not found.");
          }
        } else {
          console.error("Category with id=6 not found.");
        }
      } catch (err) {
        console.error("Error fetching category or product data:", err);
      }
    };

    fetchCategoryAndProduct();
  }, []);

  // Bank account lisst
  const getBankAccountList = async () => {
    try {
      const response = await fetch(
        `https://gateway.invescore.mn/api/user-bank-account/findbyid?userid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        setBankAccountList(data);
        setBankAccountType(data[0].bankType.bankType);
        console.log(data[0].accountNumber);
        if (data.length > 0) {
          setSelectedBankAcc(data);
        }
      } else {
        console.error("Failed to fetch bank account list:", response.status);
      }
    } catch (error) {
      console.error("Error fetching bank account list:", error);
    }
  };

  useEffect(() => {
    getBankAccountList();
  }, []);

  // Fetch contract data
  useEffect(() => {
    const getItgeltselRequest = async () => {
      try {
        const response = await axios.get(
          `https://gateway.invescore.mn/api-test/savings/get-savings?regNo=ук95112088`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const responseData = response.data.data;
          const contracts = responseData.map((item: any) => ({
            contractNo: item.contractNo,
            productName: item.productName,
            branchName: item.branchName,
            currencyID: item.currencyID,
            savingBalance: item.savingBalance,
            interestRateYearDecimal: item.interestesRateYearDecimal,
          }));
          setContractData(contracts);
        } else {
          console.error("Failed to fetch itgeltsel request:", response.status);
        }
      } catch (error) {
        console.error("Error fetching itgeltsel request:", error);
      }
    };

    getItgeltselRequest();
  }, []);

  const sendLoanRequest = async () => {
    if (!selectedContract) return;

    const body = {
      anket: {
        branchId: 17,
        branchName: selectedContract.branchName,
        userType: "USER",
        channelType: "APP",
        userId: 1,
        borrower: {
          borrowerType: "MAIN_BORROWER",
          selfieImg: "",
          bankAccountType: "Борлуулагчийн",
          bankAccountNumber: "5210107722",
          bankAccountOwner: "УРАНЧИМЭГ",
          bankType: "KHAN_BANK",
          borrowerBankAccountNumber: "5075954294",
          borrowerBankAccountOwner: "Пүрэвсамбуу",
          borrowerBankType: "KHAN-BANK",
        },
      },
      intangible: {
        contractNo: selectedContract.contractNo,
        trustValue: parseFloat(calculatedValue),
        mainInfo: "Ерөнхий мэдээлэл:",
        dedication: dedicationData,
        isGiftContract: false,
        isGetTrust: false,
        isCheckedCertificate: false,
        hasCollateral: false,
        totalPrice: parseFloat(calculatedValue),
        assessment: parseFloat(calculatedValue),
        marketAssessment: parseFloat(calculatedValue),
        collateralInfoList: [],
      },
      loanRequest: {
        amount: parseFloat(calculatedValue),
        advancePercent: 20.0,
        categoryId: selectedDrop.categoryId,
        categoryName: selectedDrop.name,
        mainProductId: selectedDrop.productId,
        productId: selectedDrop?.currencyId,
        purposeDescription: "Итгэлцэл",
        interest: 2.7,
        duration: 12,
        paymentDate: selectedDate,
      },
    };
    console.log("bodyhon", body);
    const dataToSend = {
      subUrl:
        "https://gateway.invescore.mn/api-test/loan-request-los/create-loan-request",
      token: ` ${localStorage.getItem("token")}`,
      method: "POST",
      body,
    };

    try {
      const response = await requestHandlerCustom(dataToSend);

      if (response && response.status === 200) {
        toast.success("Зээлийн хүсэлт амжилттай илгээгдлээ!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCurrentStep(3);
      } else {
        toast.warning("Зээлийн хүсэлт илгээхэд алдаа гарлаа.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Алдаа гарлаа: Зээлийн хүсэлт амжилтгүй боллоо.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error during loan request:", error);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleDetailClick = (contract: Contract) => {
    setSelectedContract(contract);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (selectedContract && selectedContract.savingBalance) {
      const cleanSavingBalance = selectedContract.savingBalance
        .replace(/,/g, "")
        .replace(/₮/g, "");

      const savingBalance = parseFloat(cleanSavingBalance);

      const calculated = !isNaN(savingBalance)
        ? (savingBalance * (percentage / 100)).toFixed(2)
        : "0";
      setCalculatedValue(calculated);
    }
  }, [percentage, selectedContract]);

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      sendLoanRequest();
    }
  };

  const handleSliderChange = (event: any, newValue: number) => {
    setPercentage(newValue);
  };

  const handleChange = (event: any) => {
    setSelectedBranch(event.target.value);
  };

  const verifyRow = (label: string, value: any) => (
    <Box display="flex" justifyContent="space-between" my={1}>
      <Typography variant="body2">{label}:</Typography>
      <Typography variant="body2" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box p={4}>
      <Stepper activeStep={currentStep} alternativeLabel>
        <Step key={0}>
          <StepLabel>ҮБ-ийн мэдээлэл</StepLabel>
        </Step>
        <Step key={1}>
          <StepLabel>Дэлгэрэнгүй мэдээлэл</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>Баталгаажуулалт</StepLabel>
        </Step>
      </Stepper>

      {currentStep === 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold">Гэрээний дугаар</TableCell>
                <TableCell className="font-bold">Бүтээгдэхүүний нэр</TableCell>
                <TableCell className="font-bold">Үйлдэл</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractData.map((contract, index) => (
                <TableRow key={index}>
                  <TableCell>{contract.contractNo}</TableCell>
                  <TableCell>{contract.productName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white"
                      onClick={() => handleDetailClick(contract)}
                    >
                      Дэлгэрэнгүй
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {currentStep === 1 && selectedContract && (
        <Box mt={4}>
          <div className="flex gap-2">
            <TextField
              label="Гэрээний дугаар"
              value={selectedContract.contractNo}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
            />

            <TextField
              label="Бүтээгдэхүүний нэр"
              value={selectedContract.productName}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Салбар"
              value={selectedContract.branchName}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
            />

            <TextField
              label="Валют"
              value={selectedContract.currencyID}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
            />
            <TextField
              label="Хүү"
              value={selectedContract.interestRateYearDecimal}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Зээлийн зориулалт"
              value={dedicationData}
              onChange={(e) => setDedicationData(e.target.value)}
              fullWidth
              margin="normal"
            />{" "}
            <div className="mt-4 w-full">
              {" "}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Зээл төлөх хугацааг сонгоно уу?"
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={minDate}
                  maxDate={maxDate}
                  margin="normal"
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="mt-4">
            <FormControl variant="outlined" fullWidth>
              {bankAccountList.length > 0 ? (
                <>
                  <InputLabel id="bank-account-label">Данс сонгох</InputLabel>
                  <Select
                    labelId="bank-account-label"
                    value={selectedBankAcc || ""}
                    onChange={handleChange}
                    label="Select Bank Account"
                    input={<OutlinedInput label="Select Bank Account" />}
                    displayEmpty
                  >
                    {bankAccountList.map((value: any, index: number) => (
                      <MenuItem key={index} value={value}>
                        {`${value.accountNumber} (${value.bankType.label})`}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ) : (
                <div className="w-full p-4 border rounded-lg bg-gray-100 text-center">
                  Таньд бүртгэлтэй данс байхгүй байна.
                </div>
              )}
            </FormControl>
          </div>
          <div className="mt-4">
            <Typography gutterBottom>
              Хадгаламжийн үлдэгдлийн тохируулга ({percentage}%)
            </Typography>
          </div>
          <Slider
            value={percentage}
            onChange={handleSliderChange}
            aria-labelledby="saving-balance-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={80}
          />
          <TextField
            label="Тохируулсан хадгаламжийн үлдэгдэл"
            value={`${calculatedValue} ₮`}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            margin="normal"
          />
          <div className="w-full flex justify-end">
            <Box mt={4}>
              <Button variant="contained" onClick={() => setCurrentStep(0)}>
                Буцах
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextStep}
                style={{ marginLeft: "10px" }}
              >
                Үргэлжлүүлэх
              </Button>
            </Box>
          </div>
        </Box>
      )}

      {currentStep === 2 && selectedContract && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Мэдээллийг баталгаажуулах
          </Typography>
          <div className="flex flex-col gap-2">
            <div className="bg-white rounded-lg p-4">
              {verifyRow("Гэрээний дугаар", selectedContract.contractNo)}
              {verifyRow("Бүтээгдэхүүний нэр", selectedContract.productName)}
              {verifyRow("Салбар", selectedContract.branchName)}
              {verifyRow("Валют", selectedContract.currencyID)}
              {verifyRow(
                "Тохируулсан хадгаламжийн үлдэгдэл",
                `${calculatedValue} ₮`
              )}
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Box mt={4}>
              <Button variant="contained" onClick={() => setCurrentStep(0)}>
                Буцах
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextStep}
                style={{ marginLeft: "10px" }}
              >
                Үргэлжлүүлэх
              </Button>
            </Box>
          </div>
        </Box>
      )}

      {currentStep === 3 && (
        <Box mt={4}>
          <Typography variant="h6" align="center" color="primary">
            Зээлийн хүсэлт амжилттай илгээгдлээ!
          </Typography>
        </Box>
      )}

      <ToastContainer />
    </Box>
  );
};

export default ItgeltselPage;
