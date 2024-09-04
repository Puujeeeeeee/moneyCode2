import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Skeleton,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Slider,
  IconButton,
  ListItemIcon,
  Avatar,
  ListItemText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import Lottie from "lottie-react";
import InfoCard from "./InfoCard";
import requestHandlerCustom from "./RequestHandlerCustom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import Loader from "./BackLoader";
import Image from "next/image";
interface VehicleData {
  modelName: string;
  markName: string;
  plateNo: string;
  wheelName: string;
  colorName: string;
  buildYear: number;
  odoMeterInspection: number;
  dedicaton: string;
  assessment: number;
  engineModelName: string;

  carOwner: {
    first_name: string;
    cell_phone: string;
  };
}
interface VehicleDatas {
  status: string;
  plateNo: string;
  certificateNo?: string;
  cabinNo?: string;
  manufacturedCountryId?: number;
  manufacturedCountryName?: string;
  categoryName?: string;
  markId?: number;
  markName?: string;
  modelId?: number;
  modelName?: string;
  modificationId?: number;
  modificationName?: string;
  buildYear?: number;
  buildMonth?: number;
  importedDate?: string;
  fuelTypeName?: string;
  odoMeterImport?: number;
  odoMeterInspection?: number;
  odoMeter?: number;
  colorName?: string;
  engineModelName?: string;
  gearbox?: string;
  assessment?: number;
  gaaliDeclarationNo: string;
  classificationId: number;
}

interface Category {
  id: number;
  name: string;
  products: any[];
}

interface VehicleDataInputProps {
  plateNo: string;
  setPlateNo: (plateNo: string) => void;
  fetchVehicleData: () => void;
  loading: boolean;
}

const VehicleDataInput: React.FC<VehicleDataInputProps> = ({
  plateNo,
  setPlateNo,
  loading,
}) => {
  const [attemptedValidation, setAttemptedValidation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState<string>("");
  const [newDownPayment, setNewDownPayment] = useState<any>("");
  const [minDownPayment, setMinDownPayment] = useState<any>("");
  const [downPayment, setDownPayment] = useState<any>("");
  const [userData, setUserData] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>({});
  const [branchList, setBranchList] = useState<any[]>([]);
  const latlng = 47.911585011514276;
  const longitd = 106.92994417119706;
  const [loader, setLoader] = useState(false);
  const [customPercentage, setCustomPercentage] = useState([]);
  const [maxInterestRate, setMaxInterestRate] = useState<number>(0);
  const [minInterestRate, setMinInterestRate] = useState<number>(0);
  const [minDuration, setMinDuration] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [selectedDrop, setSelectedDrop] = useState<any>({});
  const [stepLoader, setStepLoader] = useState(false);
  const [bankAccountList, setBankAccountList] = useState([]);
  const [selectedBankAcc, setSelectedBankAcc] = useState<any>(null);
  const [collateralList, setCollateralList] = useState([]);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [gearbox, setGearbox] = useState<GearboxEnum>(GearboxEnum.AT);
  const [interestRate, setInterestRate] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [vehicleData, setVehicleData] = useState<VehicleDatas | null>(null);
  const [bankAccountType, setBankAccountType] = useState();
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [newBank, setNewBank] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountHolder, setNewAccountHolder] = useState("");
  const [newBankError, setNewBankError] = useState(false);
  const [newAccountNumberError, setNewAccountNumberError] = useState(false);
  const [newAccountHolderError, setNewAccountHolderError] = useState(false);
  const [attemptedToContinue, setAttemptedToContinue] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const steps = [
    "Авто машины мэдээлэл оруулах",
    "Ерөнхий мэдээллийг харуулах",
    "Мэдээллийг баталгаажуулах ",
  ];

  const usersData = JSON.parse(localStorage.getItem("userInformation"));

  const userId = usersData?.id;

  console.log("hereglegch medeele", userId);
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
        console.log("dans harii", data);

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

  // Get new bank account nemh
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

  const fetchVehicleCategoryName = async (plateNo: string) => {
    try {
      const response = await fetch(
        `https://gateway.invescore.mn/api-test/loan-request-los/search-vehicle?plateNo=${plateNo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle data");
      }

      const data = await response.json();

      if (data) {
        console.log("Fetched Vehicle Data:", data);
        setVehicleData(data);
        // setAssessment(data.assessment?.toString() || "");
        await postAutoCheckCondition(data);
      } else {
        console.error("Vehicle data not found in the response.");
      }
    } catch (error) {
      console.error("Error fetching vehicle category name:", error);
    }
  };
  const postAutoCheckCondition = async (vehicleData: VehicleDatas) => {
    try {
      const body = {
        status: vehicleData.status,
        plateNo: vehicleData.plateNo,
        certificateNo: vehicleData?.certificateNo,
        cabinNo: vehicleData?.cabinNo,
        manufacturedCountryId: vehicleData?.manufacturedCountryId,
        manufacturedCountryName: vehicleData?.manufacturedCountryName,
        categoryName: vehicleData?.categoryName,
        markId: vehicleData?.markId,
        markName: vehicleData?.markName,
        modelId: vehicleData?.modelId,
        modelName: vehicleData?.modelName,
        modificationId: vehicleData?.modificationId,
        modificationName: vehicleData?.modificationName,
        buildYear: vehicleData?.buildYear,
        buildMonth: vehicleData?.buildMonth,
        importedDate: vehicleData?.importedDate,
        fuelTypeName: vehicleData?.fuelTypeName,
        odoMeterImport: vehicleData?.odoMeterInspection,
        odoMeterInspection: vehicleData?.odoMeterInspection,
        odoMeter: vehicleData?.odoMeter,
        colorName: vehicleData?.colorName,
        engineModelName: vehicleData?.engineModelName,
        gearbox: vehicleData?.gearbox,
        amount: newDownPayment,
        productId: selectedDrop?.currencyId,
        assessment: vehicleData?.assessment,
        loanRequestId: selectedDrop.categoryId,
      };

      console.log("Request Body for Auto Check Condition:", body);

      const response = await fetch(
        "https://gateway.invescore.mn/api-test/loan-request-los/auto-check-condition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.message || "Алдаа гарлаа. Түр хүлээнэ үү.";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return; // Ensure the function stops here when an error is encountered
      }

      const result = await response.json();
      console.log("Auto Check Condition Result:", result);

      if (
        result.maxRate &&
        result.minRate &&
        result.maxDuration &&
        result.interestRate &&
        result.minDownPayment
      ) {
        // Set your state here
        setMaxInterestRate(result.maxRate);
        setMinInterestRate(result.minRate);
        setMaxDuration(result.maxDuration);
        setSliderValue(result.maxDuration);
        setInterestRate(result.interestRate);
        setMinDownPayment(result.minDownPayment);
      } else {
        console.error(
          "One of the required values (maxRate, minRate, maxDuration, interestRate) is not defined in the response."
        );
      }
    } catch (error) {
      console.error("Error fetching auto check condition data:", error);
      toast.error("Алдаа гарлаа. Түр хүлээнэ үү.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
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
          (category: any) => category.id === 2
        );

        if (filteredCategory) {
          setCategoryData(filteredCategory);

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
            (product: any) => product.id === 54
          );

          if (filteredProduct) {
            const loanCurrencies = filteredProduct.loanCurrencies[0];
            console.log("loanCurrencies - ", loanCurrencies);

            setSelectedDrop({
              productId: filteredProduct?.id,
              currencyId: loanCurrencies?.id,
              categoryId: filteredCategory?.id,
              name: filteredProduct.name,
            });

            setMaxInterestRate(loanCurrencies.maxInterestRate);
            setMinInterestRate(loanCurrencies.minInterestRate);
            setMaxDuration(loanCurrencies.maxDuration);
            setMinDuration(loanCurrencies.minDuration);
          } else {
            console.error("Product with id=29 not found.");
          }
        } else {
          console.error("Category with id=4 not found.");
        }
      } catch (err) {
        console.error("Error fetching category or product data:", err);
      }
    };

    fetchCategoryAndProduct();
  }, []);

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
        console.log("bracnh response", response);
      } else {
        console.error("Failed to fetch branch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };

  const getAccountList = async (userId: number) => {
    try {
      const response = await axios.get(
        `https://gateway.invescore.mn/api/user-bank-account/findbyid?userid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setBankAccountList(data);

        if (data.length > 0) {
          setSelectedBankAcc(data[0]);
        }
      } else {
        console.error("Failed to fetch bank account list.");
      }
    } catch (error) {
      console.error("Error fetching bank account list:", error);
    }
  };
  // useEffect(() => {
  //   getAccountList();
  // }, []);

  enum GearboxEnum {
    AT = "AT",
    MT = "MT",
    AT_MT = "AT_MT",
  }

  const gearboxNameMapping = {
    [GearboxEnum.AT]: "Автомат",
    [GearboxEnum.MT]: "Механик",
    [GearboxEnum.AT_MT]: "Хосолсон",
  };

  const handleGearboxChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setGearbox(event.target.value as GearboxEnum);
  };
  const formatDateToYMD = (date: any) => {
    if (!date) return "";
    return dayjs(date).format("YYYY-MM-DD");
  };

  const sendLoanRequest = async () => {
    if (!vehicleData) {
      console.error("Vehicle data is missing");
      return;
    }

    const body = {
      anket: {
        branchId: 17,
        branchName: selectedBranch.branchName,
        userType: "USER",
        channelType: "APP",
        userId: usersData.userId,
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
      auto: {
        id: null,
        status: "ACTIVE",
        plateNo: vehicleData?.plateNo || plateNo,
        certificateNo: null,
        cabinNo: vehicleData?.cabinNo || "",
        isGaali: null,
        gaaliRegistrationNo: "",
        gaaliDeclarationNo: vehicleData?.gaaliDeclarationNo,
        exportedCompanyName: "",
        manufacturedCountryId: vehicleData?.manufacturedCountryId,
        manufacturedCountryName: vehicleData?.manufacturedCountryName || "",
        categoryName: vehicleData?.categoryName || "",
        markId: vehicleData?.markId,
        odoMeterInspection: vehicleData?.odoMeterInspection,
        seatsCount: vehicleData?.seatsCount,
        axleCount: vehicleData?.axleCount,
        markName: vehicleData?.markName,
        modelId: vehicleData?.modelId,
        modelName: vehicleData?.modelName,
        modificationId: vehicleData?.modificationId,
        modificationName: vehicleData?.modificationName,
        classificationId: vehicleData?.classificationId,
        classificationName: vehicleData?.classificationName,

        buildYear: vehicleData?.buildYear,
        buildMonth: vehicleData?.buildMonth,
        importedDate: formatDateToYMD(vehicleData?.importedDate),
        fuelTypeName: vehicleData?.fuelTypeName,
        colorName: vehicleData?.colorName || "",
        engineModelName: vehicleData?.engineModelName || "",
        engineCapacity: vehicleData?.engineCapacity || "",
        gearbox: gearbox,
        gearboxName: gearboxNameMapping[gearbox],
        wheelName: vehicleData?.wheelName || "",
        odoMeter: vehicleData?.odoMeter || 0,
        odoMeterInspections: vehicleData?.odoMeterInspections || 0,
        dedicaton: vehicleData?.dedicaton || "",
        // assessment: parseInt(assessment) || vehicleData?.
        // assessment || 0,
        assessment: parseInt(downPayment),
        marketAssessment: null,
      },

      loanRequest: {
        amount: parseInt(downPayment),
        advancePercent: interestRate,
        categoryId: selectedDrop.categoryId,
        categoryName: selectedDrop.name,
        mainProductId: selectedDrop.productId,
        productId: selectedDrop?.currencyId,
        purposeDescription: selectedDrop.name,
        interest: interestRate >= 50 ? minInterestRate : maxInterestRate,
        duration: sliderValue,
        paymentDate: selectedDate,

        // requestStatus: "ANALYZING",
        // requestStatusDesc: "Судалж байгаа",
      },
    };

    console.log("Request Body:", body);
    console.log("productId:", selectedDrop);
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

      if (response.status === 200) {
        toast.success("Зээлийн хүсэлт амжилттай илгээгдлээ!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCurrentStep(0);
        setPlateNo("");
        setAssessment("");
        setDownPayment("");
        setNewDownPayment("");
        setNewAccountNumber("");
        setNewAccountHolder("");
        setNewBank("");
        setGearbox("");
        setBankAccountList([]);
      } else response.status === 403;
      {
        toast.warning("Алдаатай хүсэлт", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCurrentStep(0);
        setPlateNo("");
        setAssessment("");
        setDownPayment("");
        setNewDownPayment("");
        setNewAccountNumber("");
        setNewAccountHolder("");
        setNewBank("");
        setGearbox("");
        setBankAccountList([]);
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
      setCurrentStep(0);
      setPlateNo("");
      setAssessment("");
      setDownPayment("");
      setNewDownPayment("");
      setNewAccountNumber("");
      setNewAccountHolder("");
      setNewBank("");
      setGearbox("");
      setBankAccountList([]);
    }
  };

  useEffect(() => {
    getLocationBranch();
  }, []);

  const handleChange = (event: any) => {
    setSelectedBranch(event.target.value);
  };

  const handleContinue = async () => {
    setAttemptedToContinue(true);

    if (!plateNo.trim()) {
      return;
    }

    setStepLoader(true);
    try {
      await fetchVehicleCategoryName(plateNo);
      setCurrentStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    } finally {
      setStepLoader(false);
    }
  };

  const handleContinueStep = async () => {
    setAttemptedToContinue(true);

    if (currentStep === 0 && !validateStepOne()) {
      return;
    }

    if (currentStep === 1 && !validateStepTwo()) {
      return;
    }

    setStepLoader(true);
    try {
      if (currentStep === 0) {
        // Fetch vehicle data logic
      }
      setCurrentStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    } finally {
      setStepLoader(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSliderChange = (event: any, newValue: any) => {
    const newInterestRate = newValue as number;
    setInterestRate(newInterestRate);
    const value = typeof newValue === "number" ? newValue : newValue[0];

    if (value < minDownPayment) {
      setInterestRate(minDownPayment);
    } else {
      setInterestRate(value);
    }
    const calculatedDownPayment = (value / 100) * (parseInt(assessment) || 0);
    setDownPayment(calculatedDownPayment);
  };

  const handleTextFieldChange = (e: any) => {
    const inputValue = e.target.value.replace(/[₮\s,]/g, "");
    if (!isNaN(Number(inputValue))) {
      const newDownPayment = Number(inputValue);
      setDownPayment(newDownPayment);

      const calculatedInterestRate = assessment
        ? (newDownPayment / parseInt(assessment)) * 100
        : 0;
      setInterestRate(calculatedInterestRate);
    }
  };

  const handleAddAccount = () => {
    let valid = true;

    // Reset errors
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
  const handleAssessmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/[₮\s,]/g, "");

    if (/^\d*$/.test(value)) {
      setAssessment(value);

      if (value && interestRate !== undefined) {
        const parsedAssessment = parseInt(value, 10) || 0;
        setDownPayment((parsedAssessment * interestRate) / 100);
      } else {
        setDownPayment(undefined);
      }
    }
  };

  const saveAssessment = () => {
    console.log("Assessment saved:", assessment);
  };

  // const getUserData = async () => {
  //   const storedUserData = JSON.parse(localStorage.getItem("userInformation"));
  //   setUserData(storedUserData);
  // };

  // useEffect(() => {
  //   getUserData();
  // }, []);

  const verifyRowData = (title: string, data: any) => (
    <div className="flex justify-between my-2">
      <span className="text-sm font-normal text-gray-600">{title}</span>
      <span className="text-sm font-semibold text-gray-800">{data}</span>
    </div>
  );

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const minDate = dayjs();
  const maxDate = dayjs().add(45, "day");
  // const handleStepChange = (step: number) => {
  //   if (step === 1 && !validateStepOne()) return;
  //   if (step === 2 && !validateStepTwo()) return;

  //   setCurrentStep(step);
  // };

  const handleSubmit = () => {
    setAttemptedValidation(true);

    if (!gearbox) {
      // Do not submit the form, and show validation errors
      return;
    }

    // Proceed with form submission
  };

  const handleStepClick = (index: number) => {
    if (index <= currentStep) {
      setCurrentStep(index);
    }
  };
  const handleBankChange = (event: any) => {
    setSelectedBank(event.target.value);
  };

  const validateStepOne = () => {
    if (!gearbox) {
      toast.error("Хурдны хайрцаг сонгоно уу!", {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    if (!assessment || !downPayment || !selectedBranch) {
      toast.error("Бүх талбарыг бөглөнө үү!", {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    }
    return true;
  };

  return (
    <div className="vehicle-input-container flex flex-col gap-4 bg-gray-100 rounded-xl h-full p-4 w-full max-w-screen-lg mx-auto relative">
      {stepLoader && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-50">
          <Loader />
        </div>
      )}
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index} onClick={() => handleStepClick(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {currentStep === 0 && (
        <>
          <TextField
            fullWidth
            label="Машины арлын дугаар/ Улсын дугаар оруулна уу"
            value={plateNo}
            onChange={(e) => setPlateNo(e.target.value)}
            variant="outlined"
            className="mb-4"
            disabled={loading}
            error={!plateNo.trim() && attemptedToContinue}
            helperText={
              !plateNo.trim() && attemptedToContinue
                ? "Машины арлын дугаар/ Улсын дугаарыг оруулна уу"
                : ""
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleContinue}
            className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white rounded-lg font-sans"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Үргэлжлүүлэх"
            )}
          </Button>
        </>
      )}

      {currentStep === 1 && (
        <Box className="vehicle-info-container mt-8">
          {loading && (
            <div className="loader-overlay">
              <Loader />
            </div>
          )}
          {vehicleData && (
            <>
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                  <p className="font-semibold font-sans">Машины нэр:</p>
                  <div className="p-4 bg-white rounded-md shadow border border-gray-300 font-medium">
                    {vehicleData.markName} {vehicleData.modelName}
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                  <p className="font-semibold font-sans">Машины үнэлгээ:</p>
                  <TextField
                    fullWidth
                    sx={{ backgroundColor: "white" }}
                    value={
                      assessment ? parseInt(assessment).toLocaleString() : ""
                    }
                    onChange={handleAssessmentChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {(downPayment || assessment) && (
                            <IconButton
                              onClick={() => {
                                setAssessment("");
                                setDownPayment("");
                                setNewDownPayment(""); // Also reset newDownPayment
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center justify-between mb-2 gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                  <p className="font-semibold font-sans">Урьдчилгаа:</p>
                  <TextField
                    fullWidth
                    sx={{ backgroundColor: "white" }}
                    value={downPayment ? downPayment.toLocaleString() : ""}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/[₮\s,]/g, "");
                      if (!isNaN(Number(inputValue))) {
                        setNewDownPayment(Number(inputValue));
                      }
                    }}
                    variant="outlined"
                    // InputProps={{
                    //   endAdornment: (
                    // <InputAdornment position="end">
                    //   {(downPayment || assessment) && (
                    //     <IconButton
                    //       onClick={() => {
                    //         setAssessment("");
                    //         setDownPayment("");
                    //         setNewDownPayment(""); // Also reset newDownPayment
                    //       }}
                    //     >
                    //       <ClearIcon />
                    //     </IconButton>
                    //   )}
                    // </InputAdornment>
                    //   ),
                    // }}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-[48%]  mt-7">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Зээл төлөх хугацааг сонгоно уу?"
                      value={selectedDate}
                      onChange={handleDateChange}
                      minDate={minDate}
                      maxDate={maxDate}
                      sx={{ backgroundColor: "white" }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-semibold font-sans">Зээлийн хүү (сарын) </p>
                <div className="flex bg-[#E7F0F9] text-blue-400 rounded-lg font-semibold p-2">
                  {interestRate >= 50 ? minInterestRate : maxInterestRate}%
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <h2 className="font-semibold font-sans">Урьдчилгаа хувь</h2>
                <div className="flex text-blue-400 rounded-lg font-semibold p-2 bg-[#E7F0F9]">
                  {interestRate} хувь
                </div>
              </div>
              <Slider
                value={interestRate}
                onChange={handleSliderChange}
                aria-labelledby="down-payment-slider"
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: "0%", disabled: true },
                  {
                    value: minDownPayment,
                    label: `${minDownPayment}%`,
                    style: { color: "gray" },
                  },
                  { value: 50, label: "50%" },
                  { value: 100, label: "100%" },
                ]}
                disabled={interestRate < minDownPayment}
                style={{
                  color: interestRate < minDownPayment ? "gray" : "inherit",
                }}
              />

              <div className="flex items-center justify-between ">
                <h2 className="font-semibold font-sans">Зээлийн хугацаа:</h2>
                <div className="flex bg-[#E7F0F9] text-blue-400 rounded-lg font-semibold p-2">
                  {sliderValue != null ? Math.ceil(sliderValue) : maxDuration}{" "}
                  сар
                </div>
              </div>
              <Slider
                value={sliderValue}
                onChange={(event, newValue) =>
                  setSliderValue(newValue as number)
                }
                aria-labelledby="loan-duration-slider"
                min={minDuration}
                max={maxDuration}
                valueLabelDisplay="auto"
                marks={[
                  { value: minDuration, label: `${minDuration} сар` },
                  { value: maxDuration, label: `${maxDuration} сар` },
                ]}
              />
              <Box className="vehicle-details-container space-y-2 flex flex-col gap-1">
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="my-2 bg-white shadow"
                >
                  <InputLabel htmlFor="branch-select">Салбар сонгох</InputLabel>
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
                <FormControl
                  fullWidth
                  variant="outlined"
                  className="mb-4"
                  error={!gearbox && attemptedValidation}
                >
                  <InputLabel id="Hurd-hairtsag-label">
                    Хурдны хайрцаг сонгох
                  </InputLabel>
                  <Select
                    value={gearbox}
                    onChange={handleGearboxChange}
                    className="rounded-md bg-white shadow"
                    label="Хурдны хайрцаг"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Хурдны хайрцаг сонгох</em>
                    </MenuItem>
                    <MenuItem value={GearboxEnum.AT}>Автомат</MenuItem>
                    <MenuItem value={GearboxEnum.MT}>Механик</MenuItem>
                    <MenuItem value={GearboxEnum.AT_MT}>Хосолсон</MenuItem>
                  </Select>

                  {!gearbox && attemptedValidation && (
                    <Typography color="error">
                      Хурдны хайрцаг сонгоно уу!
                    </Typography>
                  )}
                </FormControl>
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
                          onChange={(event) =>
                            setSelectedBankAcc(event.target.value)
                          }
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
                        <InputLabel id="bank-dropdown-label">
                          Банк сонгох
                        </InputLabel>
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
                          newAccountNumberError
                            ? "Дансны дугаар оруулна уу"
                            : ""
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

                <Box className="grid grid-cols-2 gap-4">
                  <InfoCard label="Мотор" value={vehicleData.engineModelName} />
                  <InfoCard
                    label="Жолооны хүрд"
                    value={vehicleData.wheelName}
                  />
                  <InfoCard label="Өнгө" value={vehicleData.colorName} />
                  <InfoCard
                    label="Үйлдвэрлэсэн он"
                    value={vehicleData.buildYear}
                  />
                  <InfoCard
                    label="Явсан зам"
                    value={`${vehicleData.odoMeterInspection || 0} км`}
                  />
                  <InfoCard label="Төрөл" value={vehicleData.dedicaton} />
                </Box>

                <Typography className="font-sans font-semibold mt-4">
                  Бүртгэлтэй хүний мэдээлэл
                </Typography>
                <Box className="grid grid-cols-2 gap-4">
                  <InfoCard
                    label="Нэр"
                    value={vehicleData.carOwner?.first_name}
                  />
                  <InfoCard
                    label="Утас"
                    value={vehicleData.carOwner?.cell_phone}
                  />
                </Box>
              </Box>
              <div className="flex w-full justify-between mt-4">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBack}
                  disabled={currentStep === 0 || loading}
                  className="w-full sm:w-[48%] rounded-lg"
                >
                  Буцах
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleContinueStep}
                  className="w-full sm:w-[48%] px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white rounded-lg font-sans"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Үргэлжлүүлэх"
                  )}
                </Button>
              </div>
            </>
          )}
        </Box>
      )}

      {currentStep === 2 && (
        <div className="space-y-4 px-4 w-full font-sans max-w-screen-lg mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Баталгаажуулах</h1>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            {verifyRowData("Овог", usersData?.lastName)}
            {verifyRowData("Нэр", usersData?.firstName)}
            {verifyRowData("Утасны дугаар", usersData?.phone)}
            {verifyRowData("И-мэйл", usersData?.email)}
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            {verifyRowData("Салбар", selectedBranch.branchName)}
            {verifyRowData("Зээлийн хугацаа", `${sliderValue} сар`)}
            {verifyRowData("Зээлийн төрөл", "Автомашин барьцаалсан зээл")}
            {verifyRowData("Барьцааны үнэлгээ", assessment)}
            {verifyRowData("Урьдчилгаа хувь", `${interestRate} %`)}
            {verifyRowData("Урьдчилгаа", downPayment.toLocaleString())}
            {verifyRowData(
              "Машины нэр",
              `${vehicleData?.markName} ${vehicleData?.modelName}`
            )}

            {verifyRowData("Машины арлын дугаар/ Улсын дугаар", plateNo)}
            {verifyRowData(
              "Эзэмшигчийн нэр",
              vehicleData?.carOwner?.first_name
            )}
            {verifyRowData(
              "Эзэмшигчийн утас",
              vehicleData?.carOwner?.cell_phone
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outlined"
              className="px-4 py-2 bg-gray-200 rounded-lg font-sans"
              onClick={handleBack}
            >
              Буцах
            </Button>
            <Button
              variant="contained"
              className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white rounded-lg font-sans"
              onClick={sendLoanRequest}
            >
              Зээлийн хүсэлт илгээх
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDataInput;
