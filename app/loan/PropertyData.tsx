import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
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
  Step,
  StepLabel,
  InputLabel,
  FormControl,
  Select,
  TextField,
  MenuItem,
  OutlinedInput,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Slider,
  IconButton,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import requestHandlerCustom from "./RequestHandlerCustom";
import ClearIcon from "@mui/icons-material/Clear";
import InputAdornment from "@mui/material/InputAdornment";
interface Property {
  propertyNumber: string;
  ownerShipType: string;
}

const PropertyDataList = () => {
  const [propertyData, setPropertyData] = useState<Property[]>([]);
  const [selectedPropertyDetails, setSelectedPropertyDetails] =
    useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationList, setOrganizationList] = useState([]);
  const [ownerShipList, setOwnerShipList] = useState([]);
  const [selectedOwnerShip, setSelectedOwnerShip] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [registeredDate, setRegisteredDate] = useState("");
  const [ownershipEndDate, setOwnershipEndDate] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [propertyCondition, setPropertyCondition] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [landParcelNumber, setLandParcelNumber] = useState("");
  const [propertyValuation, setPropertyValuation] = useState("");
  const [marketAverageValuation, setMarketAverageValuation] = useState("");
  const [loanCollateralValuation, setLoanCollateralValuation] = useState("");
  const [branchList, setBranchList] = useState<any[]>([]);
  const [propertyDescription, setPropertyDescription] = useState("");
  const [bankAccountList, setBankAccountList] = useState<any[]>([]);
  const [selectedBankAcc, setSelectedBankAcc] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>({});
  const [selectedDrop, setSelectedDrop] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [loader, setLoader] = useState(false);
  const regNo = "вю96042818";
  const latlng = 47.911585011514276;
  const longitd = 106.92994417119706;
  const [bankAccountType, setBankAccountType] = useState();
  const minDate = dayjs();
  const maxDate = dayjs().add(45, "day");

  const [newBank, setNewBank] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountHolder, setNewAccountHolder] = useState("");
  const [newBankError, setNewBankError] = useState(false);
  const [newAccountNumberError, setNewAccountNumberError] = useState(false);
  const [newAccountHolderError, setNewAccountHolderError] = useState(false);
  const [attemptedToContinue, setAttemptedToContinue] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  // Get user data
  const usersData = JSON.parse(localStorage.getItem("userInformation"));

  const userId = usersData?.id;
  console.log("user id haruuli", userId);

  const steps = [
    "Бүх үл хөдлөх хөрөнгийг харуулах",
    "Газар эзэмших эрх",
    "Байршил болон Үнэлгээ",
    "Баталгаажуулалт",
  ];

  const getLocationBranch = async () => {
    const url = `https://gateway.invescore.mn/api/branch-location/get-closest-branch?orgId=1&latitude=${latlng}&longitude=${longitd}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setBranchList(response.data);
        setSelectedBranch(response.data[0]);
        setLoader(false);
      } else {
        console.error("Failed to fetch branch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };
  useEffect(() => {
    getLocationBranch();
  }, []);

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
        (category: any) => category.id === 2
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
          (product: any) => product.id === 53
        );

        if (filteredProduct) {
          const loanCurrencies = filteredProduct.loanCurrencies[0];
          console.log("Filtered Product: ", filteredProduct);
          console.log("Loan Currencies: ", loanCurrencies);

          setSelectedDrop({
            productId: filteredProduct?.id,
            currencyId: loanCurrencies?.id,
            categoryId: filteredCategory?.id,
            name: filteredProduct.name,
          });
        } else {
          console.error("Product with id=53 not found.");
        }
      } else {
        console.error("Category with id=2 not found.");
      }
    } catch (err) {
      console.error("Error fetching category or product data:", err);
    }
  };

  useEffect(() => {
    fetchCategoryAndProduct();
  }, []);

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
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          "https://gateway.invescore.mn/api-test/bank-account/get-all-bank",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const banksData = await response.json();
        setBanks(banksData);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  const sendLoanRequest = async () => {
    if (!selectedPropertyDetails) {
      toast.error("Please select a property first.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const {
      propertyNumber,
      areaSize,
      dedication,
      locationAimagName,
      locationSoumName,
      locationNagName,
      owners,
      addressXyp,
    } = selectedPropertyDetails;
    const body = {
      anket: {
        branchId: 17,
        branchName: selectedBranch.branchName,
        userType: "USER",
        channelType: "APP",
        userId: userId,
        borrower: {
          borrowerType: "MAIN_BORROWER",
          selfieImg: "",
          bankAccountType: "Борлуулагчийн",
          bankAccountNumber: "5210107722",
          bankAccountOwner: "УРАНЧИМЭГ",
          bankType: "KHAN_BANK",
          borrowerBankAccountNumber:
            newAccountNumber || selectedBankAcc?.accountNumber,
          borrowerBankAccountOwner: newAccountHolder || usersData?.firstName,
          borrowerBankType: newBank || bankAccountType,
        },
      },
      property: {
        addressXyp: addressXyp,
        propertyNumber: propertyNumber,
        areaSize: areaSize,
        certificateNo: certificateNumber,
        dedication: dedication,
        ownerShipType: selectedOwnerShip,
        locationAimagName: locationAimagName,
        locationSoumName: locationSoumName,
        locationNagName: locationNagName,
        locationAimagId: locationAimagName?.id || 11,
        locationBagId: locationNagName?.id || 55,
        locationSoumId: locationSoumName?.id || 13,
        userId: userId,
        collateralTypeId: 6,
        registeredOrgId: selectedOrganization,
        registeredOrgName: selectedOrganization
          ? organizationList.find((org) => org.id === selectedOrganization)
              ?.name
          : "",
        registeredDate,
        commissionedDate: ownershipEndDate,
        propertyDetails: propertyDescription,
        conditions: propertyCondition,
        ownershipType: selectedOwnerShip,
        address: detailAddress,
        longitude: longitd,
        latitude: latlng,
        room: 5,
        totalPrice: propertyValuation,
        assessment: marketAverageValuation,
        marketAssessment: loanCollateralValuation,
        owners: owners?.map((owner: any) => ({
          firstname: owner.firstname,
          lastname: owner.lastname,
          companyName: owner.companyName,
          companyRegnum: owner.companyRegnum,
          registerNumber: owner.registerNumber,
          address: owner.address,
          isForeign: false,
        })),
      },
      loanRequest: {
        amount: loanCollateralValuation,
        advancePercent: 20.0,
        categoryId: selectedDrop.categoryId,
        categoryName: selectedDrop.name,
        mainProductId: selectedDrop.productId,
        productId: selectedDrop?.currencyId,
        purposeDescription: "Үл хөдлөх барьцаалсан зээл",
        interest: 2.7,
        duration: 12,
        paymentDate: selectedDate,
      },
    };

    const dataToSend = {
      subUrl:
        "https://gateway.invescore.mn/api-test/loan-request-los/create-loan-request",
      token: ` ${localStorage.getItem("token")}`,
      method: "POST",
      body,
      navigateToLogin: () => {
        console.log(
          "Sending request with body:",
          JSON.stringify(body, null, 2)
        );
      },
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

        // Clear the form data after successful submission
        setSelectedPropertyDetails(null);
        setSelectedOwnerShip("");
        setSelectedOrganization("");
        setRegisteredDate("");
        setOwnershipEndDate("");
        setPropertyCondition("");
        setCertificateNumber("");
        setLandParcelNumber("");
        setPropertyValuation("");
        setMarketAverageValuation("");
        setLoanCollateralValuation("");
        setDetailAddress("");
        setSelectedDate(null);
        setSelectedBankAcc(null);
        setSelectedBranch({});
        setCurrentStep(0);
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

      console.log("Response:", response);
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

  const fetchPropertyListByRegNo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://gateway.invescore.mn/api-test/loan-request-los/search-real-list?regNo=${regNo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        const propertyData = data.map((item) => ({
          propertyNumber: item.propertyNumber,
          ownerShipType: item.ownerShipType,
        }));
        setPropertyData(propertyData);
      } else {
        toast.error("Өгөгдсөн Регистрийн дугаар дээр мэдээлэл олдсонгүй.");
      }
    } catch (error) {
      console.error("API Request Error:", error);
      setError("Таньд бүртгэлтэй үл хөдлөх байхгүй байна.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyListByRegNo();
  }, []);

  const fetchPropertyData = async (propertyNumber: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://gateway.invescore.mn/api-test/loan-request-los/search-real?propertyNumber=${propertyNumber}&regNo=${regNo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch property details: ${response.status}`);
      }

      const data = await response.json();
      setSelectedPropertyDetails(data);
      setCurrentStep(1); // Move to step 2 to display property details
    } catch (error) {
      console.error("API Request Error:", error);
      setError("Failed to fetch property details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollateralList = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://gateway.invescore.mn/api-test/loan-collateral/collateral/enum/list",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch collateral list: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        setOrganizationList(data.organization || []);
        setOwnerShipList(data.ownerShip || []);
      } else {
        setError("No collateral types found.");
      }
    } catch (error) {
      console.error("API Request Error:", error);
      setError("An error occurred while fetching collateral types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollateralList();
  }, []);

  const handleAddAccount = () => {
    let valid = true;

    setNewBankError(false);
    setNewAccountNumberError(false);
    setNewAccountHolderError(false);

    if (!newBank) {
      setNewBankError(true);
      valid = false;
    }

    if (!newAccountNumber) {
      setNewAccountNumberError(true);
      valid = false;
    }

    if (!newAccountHolder) {
      setNewAccountHolderError(true);
      valid = false;
    }

    if (valid) {
      const newAccount = {
        accountNumber: newAccountNumber,
        bankType: { label: newBank },
        accountHolder: newAccountHolder,
      };

      setBankAccountList([...bankAccountList, newAccount]);
      setSelectedBankAcc(newAccount);
      setShowAddAccountForm(false);
    }
  };

  const verifyRowData = (title: string, data: any) => (
    <div className="flex justify-between my-2">
      <span className="text-sm font-normal text-gray-600">{title}</span>
      <span className="text-sm font-semibold text-gray-800">{data}</span>
    </div>
  );

  const handleChange = (event: any) => {
    setSelectedBranch(event.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const validateStep1 = () => {
    if (!selectedPropertyDetails) {
      toast.error("Үл хөдлөх хөрөнгийг сонгоно уу.", {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errors: any = {};

    if (!selectedOrganization) {
      errors.selectedOrganization =
        "Бүртгэсэн байгууллага заавал шаардлагатай.";
    }
    if (!selectedOwnerShip) {
      errors.selectedOwnerShip = "Эзэмшлийн төрөл заавал шаардлагатай.";
    }
    if (!registeredDate) {
      errors.registeredDate = "Бүртгэсэн огноо заавал шаардлагатай.";
    }
    if (!ownershipEndDate) {
      errors.ownershipEndDate = "Эзэмшлийн дуусах огноо заавал шаардлагатай.";
    }
    if (!propertyCondition) {
      errors.propertyCondition =
        "Хөрөнгийн дэлгэрэнгүй нөхцөл заавал шаардлагатай.";
    }
    if (!certificateNumber) {
      errors.certificateNumber = "Гэрчилгээний дугаар заавал шаардлагатай.";
    }
    if (!landParcelNumber) {
      errors.landParcelNumber =
        "Газрын нэгж талбарын дугаар заавал шаардлагатай.";
    }
    if (!propertyDescription) {
      errors.propertyDescription =
        "Үл хөдлөх хөрөнгийн дэлгэрэнгүй заавал шаардлагатай.";
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((message) =>
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
        })
      );
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const errors: any = {};

    if (!detailAddress) {
      errors.detailAddress = "Дэлгэрэнгүй хаяг заавал шаардлагатай.";
    }
    if (!propertyValuation) {
      errors.propertyValuation = "Хөрөнгийн үнэлгээ заавал шаардлагатай.";
    }
    if (!marketAverageValuation) {
      errors.marketAverageValuation =
        "Зах зээлийн дундаж үнэлгээ заавал шаардлагатай.";
    }
    if (!loanCollateralValuation) {
      errors.loanCollateralValuation =
        "Зээлийн барьцаанд авч буй үнэлгээ заавал шаардлагатай.";
    }
    if (!selectedDate) {
      errors.selectedDate = "Зээл төлөх хугацааг сонгоно уу.";
    }
    if (!selectedBranch) {
      errors.selectedBranch = "Салбар сонгоно уу.";
    }
    if (!selectedBankAcc) {
      errors.selectedBankAcc = "Данс сонгоно уу.";
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((message) =>
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
        })
      );
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 0 && validateStep1()) {
      setCurrentStep(1);
    } else if (currentStep === 1 && validateStep2()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep3()) {
      setCurrentStep(3);
    }
  };

  // step butsah
  const handleStepClick = (index: number) => {
    if (index <= currentStep) {
      setCurrentStep(index);
    }
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  return (
    <Box p={4}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index} onClick={() => handleStepClick(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {loading && (
        <Box className="w-full h-full flex items-center justify-center ">
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box mt={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {currentStep === 0 && propertyData.length > 0 && (
        <Box mt={4}>
          <p className="text-[16px] font-semibold">
            Тань дээр бүргэлтэй үл хөдлөх хөрөнгийн мэдээлэл:
          </p>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow className="text-center">
                  <TableCell className="font-bold">ҮБ-ийн дугаар</TableCell>
                  <TableCell className="font-bold">Эзэмшил</TableCell>
                  <TableCell className="font-bold">Үйлдэл</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {propertyData.map((property) => (
                  <TableRow key={property.propertyNumber}>
                    <TableCell>{property.propertyNumber}</TableCell>
                    <TableCell>{property.ownerShipType}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white"
                        onClick={() =>
                          fetchPropertyData(property.propertyNumber)
                        }
                      >
                        Дэлгэрэнгүй
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {currentStep === 1 && selectedPropertyDetails && (
        <div className="flex flex-col w-full mt-4 ">
          <div className="flex gap-2">
            <TextField
              label="Талбай хэмжээ (м.кв)"
              value={`${selectedPropertyDetails.areaSize} м²`}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Зориулалт"
              value={selectedPropertyDetails.dedication}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="flex gap-2">
            <FormControl fullWidth margin="normal">
              <InputLabel>Бүртгэсэн байгууллага</InputLabel>
              <Select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
              >
                {organizationList.map((org: any) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Эзэмшлийн төрөл</InputLabel>
              <Select
                value={selectedOwnerShip}
                onChange={(e) => setSelectedOwnerShip(e.target.value)}
              >
                {ownerShipList.map((ownership: any) => (
                  <MenuItem key={ownership.value} value={ownership.value}>
                    {ownership.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex gap-2">
            <TextField
              label="Бүртгэсэн огноо"
              type="date"
              value={registeredDate}
              onChange={(e) => setRegisteredDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Эзэмшлийн дуусах огноо"
              type="date"
              value={ownershipEndDate}
              onChange={(e) => setOwnershipEndDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Хөрөнгийн дэлгэрэнгүй нөхцөл"
              value={propertyCondition}
              onChange={(e) => setPropertyCondition(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Гэрчилгээний дугаар"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Газрын нэгж талбарын дугаар"
              value={landParcelNumber}
              onChange={(e) => setLandParcelNumber(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Үл хөдлөх хөрөнгийн дэлгэрэнгүй"
              value={propertyDescription}
              onChange={(e) => setPropertyDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
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
        </div>
      )}

      {currentStep === 2 && selectedPropertyDetails && (
        <div className="flex flex-col w-full mt-4">
          <div className="flex gap-2">
            <TextField
              label="Аймаг/Хот"
              value={selectedPropertyDetails.locationAimagName}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Сум/Дүүрэг"
              value={selectedPropertyDetails.locationSoumName}
              fullWidth
              sx={{ backgroundColor: "white" }}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Хороо"
              value={selectedPropertyDetails.locationNagName}
              fullWidth
              sx={{ backgroundColor: "white" }}
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Дэлгэрэнгүй хаяг оруулах"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Тухайн хөрөнгийн үнэлгээ"
              value={propertyValuation}
              onChange={(e) => setPropertyValuation(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />

            <TextField
              label="Зах зээлийн дундаж үнэлгээ"
              value={marketAverageValuation}
              onChange={(e) => setMarketAverageValuation(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />
          </div>
          <div className="flex gap-2">
            <TextField
              label="Зээлийн барьцаанд авч буй үнэ"
              value={loanCollateralValuation}
              onChange={(e) => setLoanCollateralValuation(e.target.value)}
              fullWidth
              type="number"
            />
          </div>

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

          <div className="mt-4">
            <FormControl variant="outlined" fullWidth>
              {bankAccountList.length > 0 ? (
                <>
                  <InputLabel id="bank-account-label">
                    Та өөрийн дансыг сонгоно уу!
                  </InputLabel>
                  <Select
                    sx={{ backgroundColor: "white" }}
                    labelId="bank-account-label"
                    value={selectedBankAcc || ""}
                    onChange={(event) => setSelectedBankAcc(event.target.value)}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={showAddAccountForm}
                        onChange={(e) =>
                          setShowAddAccountForm(e.target.checked)
                        }
                      />
                    }
                    label="Шинэ данс нэмэх"
                    className="mt-2"
                  />
                </>
              ) : (
                <div className="flex flex-col ">
                  <div className="flex flex-col items-center w-full p-4 border border-gray-300 shadow rounded-lg bg-white text-center">
                    <p className="text-gray-500">
                      Таньд бүртгэлтэй данс байхгүй байна.
                    </p>
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={showAddAccountForm}
                        onChange={(e) =>
                          setShowAddAccountForm(e.target.checked)
                        }
                      />
                    }
                    label="Данс нэмэх"
                    className="mt-1"
                  />
                </div>
              )}
            </FormControl>

            {showAddAccountForm && (
              <div className="mt-4 p-4 border border-gray-300 shadow rounded-lg bg-white">
                <Typography variant="h6" className="mb-4">
                  Шинэ данс нэмэх
                </Typography>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className="mb-4 w-full"
                  error={newBankError}
                  helperText={newBankError ? "Та банкаа сонгоно уу" : ""}
                >
                  <InputLabel id="bank-dropdown-label">Банк сонгох</InputLabel>
                  <Select
                    labelId="bank-dropdown-label"
                    value={newBank}
                    onChange={(e) => setNewBank(e.target.value)}
                    label="Банк сонгох"
                  >
                    {banks.map((bank: any) => (
                      <MenuItem
                        key={bank.id}
                        value={bank.bankType}
                        className="flex"
                      >
                        <ListItemText primary={bank.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Дансны дугаар"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="mb-4"
                  error={newAccountNumberError} // Add error prop
                  helperText={
                    newAccountNumberError ? "Дансны дугаар оруулна уу" : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {newAccountNumber && (
                          <IconButton
                            onClick={() => {
                              setNewAccountNumber("");
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Данс эзэмшигчийн нэр"
                  value={newAccountHolder}
                  onChange={(e) => setNewAccountHolder(e.target.value)}
                  className="mb-4"
                  error={newAccountHolderError} // Add error prop
                  helperText={
                    newAccountHolderError
                      ? "Данс эзэмшигчийн нэр оруулна уу"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {newAccountHolder && (
                          <IconButton
                            onClick={() => {
                              setNewAccountHolder("");
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white rounded-lg"
                  onClick={handleAddAccount}
                >
                  Данс нэмэх
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <FormControl variant="outlined" fullWidth className="my-2 shadow">
              <InputLabel htmlFor="branch-select">
                Хүсэлт илгээх салбар сонгох
              </InputLabel>
              <Select
                value={selectedBranch || ""}
                onChange={handleChange}
                input={
                  <OutlinedInput id="branch-select" label="Select Branch" />
                }
                style={{ height: 50 }}
                renderValue={(selected) => (
                  <Box display="flex" alignItems="center">
                    <Box ml={1}>
                      {selected
                        ? selected.branchName
                        : "Хүсэлт илгээх салбар сонгох"}
                    </Box>
                  </Box>
                )}
              >
                {branchList.map((branch: any, index: number) => (
                  <MenuItem key={index} value={branch}>
                    <Box display="flex" alignItems="center">
                      <Box ml={1}>{branch.branchName}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="w-full flex justify-end">
            <Box mt={4}>
              <Button variant="contained" onClick={() => setCurrentStep(1)}>
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
        </div>
      )}

      {currentStep === 3 && selectedPropertyDetails && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Мэдээллийг баталгаажуулах
          </Typography>
          <div className="flex flex-col gap-2">
            <div className="bg-white rounded-lg p-4">
              {verifyRowData(
                "Газрын хэмжээ",
                `${selectedPropertyDetails.areaSize} m²`
              )}
              {verifyRowData(
                "Гэрчилгээний дугаар",
                selectedPropertyDetails.certificateNumber
              )}
              {verifyRowData("Зориулалт", selectedPropertyDetails.dedication)}
              {verifyRowData(
                "Аймаг",
                selectedPropertyDetails.locationAimagName
              )}
            </div>
            <div className="bg-white rounded-lg p-4">
              {selectedPropertyDetails.owners &&
                selectedPropertyDetails.owners.length > 0 && (
                  <>
                    {verifyRowData(
                      "Овог",
                      selectedPropertyDetails.owners[0].lastname
                    )}
                    {verifyRowData(
                      "Нэр",
                      selectedPropertyDetails.owners[0].firstname
                    )}
                    {verifyRowData(
                      "Компани",
                      selectedPropertyDetails.owners[0].companyName
                    )}
                    {verifyRowData(
                      "Регистрийн дугаар",
                      selectedPropertyDetails.owners[0].registerNumber
                    )}
                    {verifyRowData(
                      "Сум/Дүүрэг",
                      selectedPropertyDetails.locationSoumName
                    )}
                    {verifyRowData(
                      "Хороо",
                      selectedPropertyDetails.locationNagName
                    )}
                    {verifyRowData(
                      "Үл хөдлөх хөрөнгийн дугаар",
                      selectedPropertyDetails.propertyNumber
                    )}
                    {verifyRowData("Салбар", selectedBranch.branchName)}
                  </>
                )}
            </div>
          </div>
          <Box mt={4}>
            <Button
              variant="contained"
              onClick={() => setCurrentStep(2)}
              style={{ marginRight: "10px" }}
            >
              Буцах
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={sendLoanRequest}
              currentStep="1"
            >
              Зээлийн хүсэлт илгээх
            </Button>
          </Box>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};

export default PropertyDataList;
