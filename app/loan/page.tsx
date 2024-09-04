"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Snackbar,
  TextField,
  Slider,
  Menu,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Paper,
  Box,
  IconButton,
  Typography,
  CardContent,
} from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/navbar/page";
import { UserProfile } from "@/components/userProfile/page";
import CardContentData from "./CardContentData";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import Image from "next/image";
import ShuurhaiVehicle from "./ShuurhaiVehicle";
import RequirementTabs from "./tabs";
// import CardContent from "@mui/material";
import CollateralDropdown from "./Collotarel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import IncomeDropdown from "./Income";
import TotalMonthIncomeField from "./TotalMonthIncome";
import requestHandlerCustom from "./RequestHandlerCustom";
import ItgeltselPage from "./Itgeltsel";
import UlHudluh from "./PropertyData";
import VehicleDataInput from "./VehicleDataInput";
import { Token } from "@mui/icons-material";

// Interfaces
interface CurrencyModel {
  code: string;
  marker: string;
  name: string;
}

interface SubProduct {
  currencyModel: CurrencyModel;
  id: number;
  description?: string;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  duration?: number;
  interestYear?: number;
  interest?: number;
  minInterest?: number;
  maxInterest?: number;
  minDuration?: number;
  maxDuration?: number;
}

interface LoanProduct {
  loanCurrencies: any;
  minInterest: number;
  minDuration: number;
  id: number;
  name: string;
  subProducts: SubProduct[];
  currencyModel: CurrencyModel;
  minAmount: number;
  maxDuration: number;
  interest: string;
}

interface Category {
  name: string;
  id: number;
  shortName: string;
  products: LoanProduct[];
}

const Loan: React.FC = () => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState("individual");
  const [loanValue, setLoanValue] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  const [currencyIndex, setCurrencyIndex] = useState<number>(0);
  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [paybackTotalAmount, setPaybackTotalAmount] = useState<number>(0);
  const [selectedBranch, setSelectedBranch] = useState<any>({});
  const [branchList, setBranchList] = useState<any[]>([]);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [userData, setUserData] = useState<any>(null);
  const [collateralList, setCollateralList] = useState<any[]>([]);
  const [selectedCollateral, setSelectedCollateral] = useState<any>(null);
  const [incomeList, setIncomeList] = useState<any[]>([]);
  const [selectedIncome, setSelectedIncome] = useState<any>(null);
  const [totalMonthIncome, setTotalMonthIncome] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [selectedDrop, setSelectedDrop] = useState<any>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loanRequestStepId, setLoanRequestStepId] = useState(1);
  const [subProductData, setSubProductData] = useState<SubProduct[]>([]);
  const [selectedData, setSelectedData] = useState<SubProduct | null>(null);
  const [showNextSection, setShowNextSection] = useState(false);
  const [plateNo, setPlateNo] = useState("");
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gearbox, setGearbox] = useState("AT");
  const [maxInterestRate, setMaxInterestRate] = useState<number>(0);
  const [minDuration, setMinDuration] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [maxDuration, setMaxDuration] = useState<number>(0);
  const [assessment, setAssessment] = useState("");
  const [bankAccountList, setBankAccountList] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [selectedBankAcc, setSelectedBankAcc] = useState(null);
  const [loanProductionReadyForRequest, setLoanProductionReadyForRequest] =
    useState<SubProduct[]>([]);
  const [showData, setShowData] = useState(false);

  const [nameOfChosenProduct, setNameOfChosenProduct] = useState<string | null>(
    null
  );
  const latlng = 47.911585011514276;
  const longitd = 106.92994417119706;

  const fetchCategoryWithId6 = async () => {
    try {
      const response = await axios.get(
        "https://gateway.invescore.mn/api-test/loan-product/get-all-categories-los",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const categories = response.data;

        const categoryWithId6 = categories.find(
          (category: any) => category.id === 6
        );

        if (categoryWithId6) {
          console.log("Category with id=6:", categoryWithId6);

          setCategoryData(categoryWithId6);
        } else {
          console.error("Category with id=6 not found.");
        }
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryWithId6();
  }, []);
  // GET CATEGORIES AND PRODUCTS

  const getProductList = async () => {
    try {
      const categoryRes = await axios.get(
        `https://gateway.invescore.mn/api-test/loan-product/get-all-categories-los`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (categoryRes.status === 200) {
        const categories: Category[] = categoryRes.data;

        const productsData = await Promise.all(
          categories.map(async (category) => {
            const productRes = await axios.get(
              `https://gateway.invescore.mn/api-test/loan-product/get-all-products-los?categoryId=${category.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (productRes.status === 200) {
              const products = productRes.data;
              return {
                categoryId: category.id,
                products,
              };
            } else {
              return {
                categoryId: category.id,
                products: [],
              };
            }
          })
        );

        const productMap: any = {};
        productsData.forEach((productData) => {
          productMap[productData.categoryId] = productData.products;
        });

        const combinedData = categories.map((category) => ({
          ...category,
          products: productMap[category.id] || [],
        }));

        setCategoryData(combinedData);
        setShowData(true); // Show data after fetching

        if (combinedData.length > 0 && combinedData[0].products.length > 0) {
          setSelectedDrop({
            productId: combinedData[0].products[0].id,
            categoryId: combinedData[0].id,
            name: combinedData[0].products[0].name,
          });
        }
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching category data:", err);
      setCategoryData([]);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  useEffect(() => {}, [categoryData]);

  const getBankAccountList = async () => {
    const userData = JSON.parse(localStorage.getItem("userInformation"));
    const userId = userData?.id;

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
        console.log("fsdfsssd", bankAccountList);

        if (data.length > 0) {
          setSelectedBankAcc(data[0]);
        }
      } else {
        console.error("Failed to fetch bank account list:", response.status);
      }
    } catch (error) {
      console.error("Error fetching bank account list:", error);
    }
  };

  //handle product select

  const handleProductSelect = async (productId: number) => {
    setActiveProduct(productId);
    const selectedProduct = categoryData
      .flatMap((category) => category.products)
      .find((product) => product.id === productId);

    if (selectedProduct) {
      setNameOfChosenProduct(selectedProduct.name);
      setLoanProductionReadyForRequest(selectedProduct.loanCurrencies || []);

      setSelectedProduct({
        categoryId: selectedProduct.categoryId,
        productId: selectedProduct.id,
        name: selectedProduct.name,
      });
    } else {
      console.error("Selected product not found for id:", productId);
    }
    setAnchorEl(null);
  };

  //get location branch
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

  const getUserData = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userInformation"));
    setUserData(storedUserData);
  };

  // Get itgeltsel request

  // Get product select
  const getProductDetail = async () => {
    setLoader(true);

    const url = `https://gateway.invescore.mn/api/loan/asset-information?productId=${selectedDrop["productId"]}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;

        setCollateralList(data.assetInformation);
        setSelectedCollateral(data.assetInformation[0]);
        setIncomeList(data.sourceIncomes);
        setSelectedIncome(data.sourceIncomes[0]);
        setLoanRequestStepId(2);

        getLocationBranch();
      } else {
        console.error("Failed to fetch product details:", response.status);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoader(false);
    }
  };

  const resetFormAndGoToFirstStep = () => {
    setLoanValue("");
    setSliderValue(null);
    setSelectedDrop({});
    setSelectedBankAcc(null);
    setSelectedBranch({});
    setTotalMonthIncome("");
    setShowNextSection(false);
    setLoanRequestStepId(1);
    // Optionally reset other state variables as needed
  };

  //loan request
  const sendLoanRequest = async () => {
    const today = new Date();
    const paymentDate = today.toISOString().split("T")[0];
    const body = {
      anket: {
        branchId: 17,
        branchName: selectedBranch?.branchName,
        userType: "USER",
        channelType: "APP",
        userId: userData?.id,
        borrower: {
          borrowerType: "MAIN_BORROWER",
          selfieImg: "",
          bankAccountType: "Борлуулагчийн",
          bankAccountNumber: "5210107722",
          bankAccountOwner: "УРАНЧИМЭГ",
          bankType: "KHAN_BANK",
          borrowerBankAccountNumber: "selectedBankAcc?.accountNumber",
          borrowerBankAccountOwner: "userData?.firstName",
          borrowerBankType: "selectedBankAcc.bankType?.bankType?.label",
          // borrowerBankAccountNumber: selectedBankAcc?.accountNumber,
          // borrowerBankAccountOwner: userData?.name,
          // borrowerBankType: selectedBankAcc?.bankType?.label,
        },
      },
      loanRequest: {
        amount: parseInt(loanValue.replace(/,/g, "")),
        advancePercent: "20",
        categoryId: selectedProduct?.categoryId,
        mainProductId: selectedDrop?.productId,
        productId: loanProductionReadyForRequest[currencyIndex]?.id,
        purposeDescription: nameOfChosenProduct,
        interest: loanProductionReadyForRequest[currencyIndex].maxInterest,
        duration: sliderValue
          ? Math.ceil(sliderValue)
          : loanProductionReadyForRequest[currencyIndex]?.minDuration,
        paymentDate: paymentDate,
        // requestStatus: "ANALYZING",
        // requestStatusDesc: "Судалж байгаа",
      },
    };

    const dataToSend = {
      subUrl:
        "https://gateway.invescore.mn/api-test/loan-request-los/create-loan-request",
      token: ` ${localStorage.getItem("token")}`,
      method: "POST",
      body,
      navigateToLogin: () => {
        console.log("Redirect to login if token is invalid");
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

        resetFormAndGoToFirstStep();
      } else {
        toast.error("Зээлийн хүсэлт илгээхэд алдаа гарлаа.", {
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

  // fetch vehicle data  in category name avtsgaay aaaaaaaaaaaaaay

  const fetchVehicleData = async () => {
    setLoading(false);
    setError(null);

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
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setVehicleData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const calculateLoan = () => {
    if (
      !loanProductionReadyForRequest ||
      loanProductionReadyForRequest.length === 0
    ) {
      return;
    }

    const selectedProduct = loanProductionReadyForRequest[currencyIndex];
    if (!selectedProduct) {
      console.error("No loan product selected.");
      return;
    }

    {
      Number(loanValue.replace(/,/g, "")).toLocaleString();
    }

    // Ensure interest rate is valid
    const monthlyRate = selectedProduct.maxInterestRate / 12 / 100; // Monthly interest rate
    const loanAmount =
      parseFloat(loanValue.replace(/,/g, "").toLocaleString()) || 0;
    const loanTenure = sliderValue
      ? parseFloat(sliderValue.toString())
      : selectedProduct.maxDuration;

    if (
      isNaN(monthlyRate) ||
      isNaN(loanAmount) ||
      isNaN(loanTenure) ||
      loanTenure <= 0
    ) {
      console.error("Invalid loan calculation inputs.");
      return;
    }

    // EMI calculation: [P * r * (1+r)^n] / [(1+r)^n - 1]
    let emi;
    if (monthlyRate > 0) {
      const ratePower = Math.pow(1 + monthlyRate, loanTenure);
      emi = (loanAmount * monthlyRate * ratePower) / (ratePower - 1);
    } else {
      emi = loanAmount / loanTenure;
    }

    const totalPaybackAmount = emi * loanTenure;

    setMonthTotal(emi);
    setPaybackTotalAmount(totalPaybackAmount);
  };

  // useEffect(() => {
  //   calculateLoan();
  // }, [loanValue, sliderValue, currencyIndex]);

  const handleButtonClick = () => {
    if (totalMonthIncome.trim() !== "") {
      setLoanRequestStepId(3);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCategorySelect = (index: number) => {
    setActiveCategory((prev) => (prev === index ? null : index));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const verifyRowData = (title: string, data: any) => (
    <div className="flex justify-between my-2">
      <span className="text-xs font-normal text-gray-600 md:text-sm lg:text-md">
        {title}
      </span>
      <span className="text-xs font-semibold text-gray-800 md:text-sm lg:text-md">
        {data}
      </span>
    </div>
  );

  const handleCurrencyClick = (index: number) => {
    setCurrencyIndex(index);

    // Update the interest rate based on the selected currency
    const selectedCurrency = currentProduct?.loanCurrencies[index];
    if (selectedCurrency) {
      setMaxInterestRate(selectedCurrency.maxInterestRate);
      setMinDuration(selectedCurrency.minDuration);
      setMaxDuration(selectedCurrency.maxDuration);
    }
  };
  useEffect(() => {
    if (currentProduct && currentProduct.loanCurrencies?.length > 0) {
      const selectedCurrency = currentProduct.loanCurrencies[currencyIndex];
      if (selectedCurrency) {
        setMaxInterestRate(selectedCurrency.maxInterestRate);
        setMinDuration(selectedCurrency.minDuration);
        setMaxDuration(selectedCurrency.maxDuration);
      }
    }
  }, [currencyIndex]);

  const MainhandleClick = (index: any) => {
    setActiveCategory(index);
    const selectedCategory = categoryData[index];

    if (selectedCategory && selectedCategory.products.length > 0) {
      const firstProduct = selectedCategory.products[0];
      setActiveProduct(firstProduct.id);
      setNameOfChosenProduct(firstProduct.name);
      setLoanProductionReadyForRequest(firstProduct.loanCurrencies || []);
    } else {
      setActiveProduct(null);
      setNameOfChosenProduct(null);
      setLoanProductionReadyForRequest([]);
    }
  };

  const currentCategory = categoryData[activeCategory ?? 0];
  const currentProduct = currentCategory?.products?.find(
    (product) => product.id === activeProduct
  );
  const handleChange = (event: any) => {
    setSelectedBankAcc(event.target.value);
  };

  return (
    <div className="flex h-screen">
      <Navbar />

      <div className="w-full flex p-4 bg-gray-100 justify-between overflow-y-auto">
        {/* Left Section */}
        <div className="flex flex-col gap-4 w-full md:w-[50%]">
          <p className="text-lg font-semibold text-gray-800 font-sans md:text-xl">
            Зээл
          </p>
          <div className="flex w-full gap-4">
            <div className="w-1/2 bg-white flex flex-col rounded-xl p-4 h-[80px] font-sans">
              <p className="text-xs md:text-sm">Зээлийн нийт дүн</p>
              <p className="font-semibold text-sm md:text-md">
                {currentProduct?.currencyModel?.marker}
                {Number(loanValue.replace(/,/g, "") || "0").toLocaleString()}
              </p>
            </div>
            <div className="w-1/2 bg-white h-[80px] rounded-xl p-4 font-sans">
              <p className="text-xs md:text-sm">Зээлийн боломжит дүн</p>
              <p className="font-semibold text-sm md:text-md">0₮</p>
            </div>
          </div>

          {/* Loan Categories */}
          {showData && (
            <div className="flex gap-2">
              {categoryData.length > 0 ? (
                categoryData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => MainhandleClick(index)}
                    className={`w-[200px] md:w-[250px] bg-gray-200 h-[100px] md:h-[150px] rounded-xl flex justify-center items-center flex-col relative cursor-pointer hover:scale-105 duration-200 ${
                      activeCategory === index ? "bg-white" : ""
                    }`}
                  >
                    {/* Category Name */}
                    <p className="font-medium font-sans text-xs md:text-md">
                      {item.shortName}
                    </p>
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </div>
          )}

          {/* Loan Product and Details */}
          <div className="main_container bg-white w-full flex flex-col gap-2 rounded-xl p-4">
            {/* Product Selection and Tabs */}
            {currentCategory && (
              <div className="flex flex-col gap-4">
                {/* Product Selection */}
                <div
                  onClick={handleMenuOpen}
                  className="flex w-full gap-2 cursor-pointer"
                >
                  <div
                    aria-controls="product-menu"
                    aria-haspopup="true"
                    className="flex items-center font-semibold font-sans text-xs md:text-md"
                  >
                    {nameOfChosenProduct ||
                      "Та зээлийн бүтээгдэхүүн сонгоно уу"}
                  </div>
                  <div className="text-gray-500">
                    <ArrowDropDownOutlinedIcon />
                  </div>
                </div>

                {/* Menu Dropdown */}
                <Menu
                  id="product-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {currentCategory.products?.length > 0 ? (
                    currentCategory.products.map((product) => (
                      <MenuItem
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className={`cursor-pointer p-2 font-sans text-xs md:text-sm ${
                          activeProduct === product.id ? "bg-gray-300" : ""
                        }`}
                      >
                        {product.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No products available</MenuItem>
                  )}
                </Menu>

                {/* individall */}
                <div className="w-[160px] md:w-[230px] h-[40px] md:h-[55px] bg-[#E7F0F9] rounded-lg flex">
                  <div className="flex w-full h-full p-2 font-sans">
                    <button
                      onClick={() => handleTabClick("individual")}
                      className={`w-1/2 h-full flex items-center justify-center rounded-lg cursor-pointer font-semibold text-xs md:text-md ${
                        activeTab === "individual"
                          ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white"
                          : " text-gray-500"
                      }`}
                    >
                      Хувь хүн
                    </button>
                    <button
                      onClick={() => handleTabClick("organization")}
                      className={`w-1/2 h-full flex items-center justify-center rounded-lg cursor-pointer font-semibold text-xs md:text-md ${
                        activeTab === "organization"
                          ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white"
                          : " text-gray-500"
                      }`}
                    >
                      Байгууллага
                    </button>
                  </div>
                </div>

                {/* Loan Details */}
                {currentProduct && (
                  <div>
                    {/* Check if there are any loanCurrencies */}
                    {currentProduct.loanCurrencies && (
                      <div>
                        {/* Loop through loanCurrencies and display amount and coreName */}
                        {currentProduct.loanCurrencies.map(
                          (loanCurrency: any) => (
                            <div
                              key={loanCurrency.id}
                              className="flex flex-col p-2"
                            >
                              <p className="font-medium">
                                {loanCurrency.amount}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {currentProduct.loanCurrencies && (
                      <div>
                        {/* Loop through loanCurrencies and display amount and coreName */}
                        {currentProduct.loanCurrencies.map(
                          (loanCurrency: any) => (
                            <div
                              key={loanCurrency.id}
                              className="flex flex-col p-2"
                            >
                              <p className="font-sans text-xs md:text-sm">
                                {loanCurrency.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                    {/* Additional Details such as duration, interest rates */}
                    {currentProduct.loanCurrencies && (
                      <div>
                        {currentProduct.loanCurrencies.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex px-2 gap-5 font-sans"
                          >
                            <div className="text-gray-500 text-xs md:text-sm">
                              Сарын хүү:
                            </div>
                            <div className="flex">
                              <p className="font-medium text-xs md:text-sm">
                                {item.minInterestRate} - {item.maxInterestRate}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentProduct.loanCurrencies && (
                      <div>
                        {currentProduct.loanCurrencies.map(
                          (subProduct: any) => (
                            <div
                              key={subProduct.id}
                              className="flex px-2 gap-5 font-sans"
                            >
                              <div className="text-gray-500 text-xs md:text-sm">
                                Зээлийн хугацаа:
                              </div>
                              <p className="font-medium text-xs md:text-sm">
                                {subProduct.minDuration} -{" "}
                                {subProduct.maxDuration} сар
                              </p>
                            </div>
                          )
                        )}
                        {currentProduct.loanCurrencies.length > 0 && (
                          <div>
                            {currentProduct.loanCurrencies.map(
                              (subProduct: any) => (
                                <div key={subProduct.id} className="flex p-2">
                                  <RequirementTabs subProduct={subProduct} />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}

        {currentProduct?.id === 54 ? (
          <div className="w-[42vw]">
            <ShuurhaiVehicle
              plateNo={plateNo}
              setPlateNo={setPlateNo}
              fetchVehicleData={fetchVehicleData}
              vehicleData={vehicleData}
              loading={loading}
              setGearbox={setGearbox}
              assessment={setAssessment}
              showNextSection={showNextSection}
              gearbox={gearbox}
            />
          </div>
        ) : currentProduct?.id === 29 ? (
          <div className="w-[42vw]">
            <VehicleDataInput
              plateNo={plateNo}
              setPlateNo={setPlateNo}
              fetchVehicleData={fetchVehicleData}
              vehicleData={vehicleData}
              loading={loading}
              setGearbox={setGearbox}
              assessment={setAssessment}
              showNextSection={showNextSection}
              gearbox={gearbox}
            />
          </div>
        ) : currentCategory?.id === 6 ? (
          <div className="w-[42vw]">
            <ItgeltselPage />
          </div>
        ) : currentCategory?.id === 5 ? (
          <div className="w-[42vw]">
            <CardContentData />
          </div>
        ) : currentProduct?.id === 53 ? (
          <div className="w-[42vw]">
            <UlHudluh />
          </div>
        ) : (
          loanRequestStepId === 1 && (
            <div className=" flex h-full bg-gray-100 rounded-xl gap-4 flex-col px-4">
              {/* Loan Calculator */}
              <div className="w-[42vw] h-full bg-gray-100 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-800 font-sans md:text-xl">
                  Тооцоолуур
                </h2>
                {/* <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-600">
                    {currencyIndex != null ? currencyIndex.marker : ""}
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="ml-2 text-2xl font-medium text-gray-800 bg-transparent border-none"
                  />
                </div> */}

                {currentProduct &&
                  currentProduct.loanCurrencies &&
                  currentProduct.loanCurrencies.length > 0 && (
                    <div className="my-4 bg-white p-4 rounded-lg ">
                      <div className="flex flex-col">
                        <div className="text-gray-700 font-sans text-xs md:text-sm">
                          Авах зээлийн дүн:
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-md font-semibold text-gray-800 font-sans md:text-lg">
                            {currentProduct?.loanCurrencies?.name}
                          </span>
                          <input
                            type="text"
                            value={loanValue}
                            onChange={(e) => setLoanValue(e.target.value)}
                            className="ml-2 text-md font-bold text-gray-800 bg-transparent border-none md:text-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                {/* Currency Selection */}
                <Grid container spacing={2}>
                  {currentProduct?.loanCurrencies?.length > 0 &&
                    currentProduct.loanCurrencies.map(
                      (item: any, index: number) => (
                        <Grid item key={item.id}>
                          <Paper
                            sx={{
                              padding: 2,
                              width: 100,
                              height: 65,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              borderRadius: 2,
                              border:
                                currencyIndex === index
                                  ? "2px solid #1976d2"
                                  : "1px solid #ccc",
                              backgroundColor:
                                currencyIndex === index ? "#e3f2fd" : "#f5f5f5",
                            }}
                            onClick={() => handleCurrencyClick(index)}
                          >
                            <Box
                              display="flex"
                              justifyContent="center"
                              width="100%"
                            >
                              <IconButton
                                size="small"
                                checked={currencyIndex === index}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<CheckCircleIcon />}
                                sx={{
                                  color:
                                    currencyIndex === index
                                      ? "#1976d2"
                                      : "default",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              className="text-xs md:text-sm"
                            >
                              {item.currency}
                            </Typography>
                          </Paper>
                        </Grid>
                      )
                    )}
                </Grid>

                {/* Interest Rate and Duration */}
                {currentProduct?.loanCurrencies?.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center font-sans">
                      <span className="font-semibold text-xs md:text-sm">
                        Зээлийн хүү (сарын):
                      </span>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {
                          currentProduct.loanCurrencies[currencyIndex]
                            ?.minInterestRate
                        }{" "}
                        -{" "}
                        {
                          currentProduct.loanCurrencies[currencyIndex]
                            ?.maxInterestRate
                        }
                        %
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration Slider */}
                {currentProduct?.loanCurrencies?.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center font-sans">
                      <span className="font-semibold text-xs md:text-sm">
                        Зээлийн хугацаа:
                      </span>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {sliderValue != null
                          ? Math.ceil(sliderValue)
                          : currentProduct.loanCurrencies[currencyIndex]
                              ?.minDuration}{" "}
                        сар
                      </div>
                    </div>

                    <Slider
                      value={sliderValue ?? "1"}
                      max={
                        currentProduct.loanCurrencies[currencyIndex]
                          ?.maxDuration
                      }
                      min={
                        currentProduct.loanCurrencies[currencyIndex]
                          ?.minDuration
                      }
                      onChange={(e, value) => {
                        setSliderValue(value as number);
                        calculateLoan();
                      }}
                      aria-labelledby="loan-duration-slider"
                    />
                  </div>
                )}

                {/* Monthly Payment and Total Payback Amount */}
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-gray-200 rounded-lg font-sans">
                    <div className="text-gray-700 text-xs md:text-sm">
                      Сарын төлөлт:
                    </div>
                    <div className="text-sm font-bold md:text-md">
                      {currentProduct?.currencyModel?.marker}
                      {monthTotal.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex-1 p-4 bg-gray-200 rounded-lg font-sans">
                    <div className="text-gray-700 text-xs md:text-sm">
                      Буцааж төлөх нийт дүн
                    </div>
                    <div className="text-sm font-bold md:text-md">
                      {currentProduct?.currencyModel?.marker}
                      {paybackTotalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="hidden flex-col gap-2">
                  <p className="text-xl font-bold">Данс:</p>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    style={{
                      height: 45,
                    }}
                  >
                    {bankAccountList.length > 0 ? (
                      <>
                        <InputLabel id="bank-account-label">
                          Данс сонгох
                        </InputLabel>
                        <Select
                          labelId="bank-account-label"
                          value={selectedBankAcc || ""}
                          onChange={handleChange}
                          label="Select Bank Account"
                          input={<OutlinedInput label="Select Bank Account" />}
                          displayEmpty
                        >
                          {bankAccountList.map((value, index) => (
                            <MenuItem key={index} value={value}>
                              {`${value.accountNumber} (${value.bankType.label})`}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    ) : (
                      <div className="w-full p-4 border rounded-lg bg-gray-100 text-center ">
                        Таньд бүртгэлтэй данс байхгүй байна.
                      </div>
                    )}
                  </FormControl>
                </div>
                {/* Warning */}
                <div className="my-4 p-4 bg-red-100 rounded-lg flex items-center font-sans">
                  <div className="text-red-600  ">
                    <ReportGmailerrorredOutlinedIcon />
                  </div>
                  <span className="ml-2 text-red-600 text-xs md:text-sm">
                    Барьцаа хөрөнгийн төрөл ангиллаас шалтгаалан таны сонгосон
                    хүүнээс өөр байх боломжтойг анхаарна уу.
                  </span>
                </div>

                {/* Buttons */}
                <div className="w-full flex justify-end">
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (
                        Number(loanValue.replace(/,/g, "")) >
                        loanProductionReadyForRequest[currencyIndex]?.minAmount
                      ) {
                        getProductDetail();
                        setShowNextSection(true); // Show the next section
                      } else {
                        toast.warning(
                          `Зээлийн дүн ${loanProductionReadyForRequest[currencyIndex]?.minAmount} их байх ёстой`
                        );
                      }
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] from-10% to-90% text-white rounded-lg font-sans text-xs md:text-sm"
                  >
                    Хүсэлт илгээх
                  </Button>
                </div>

                {/* Snackbar for Errors */}
                <Snackbar
                  open={false}
                  message="Бүх талбарыг бөглөнө үү"
                  autoHideDuration={6000}
                />

                {/* Toast Notification */}
                <ToastContainer />
              </div>
            </div>
          )
        )}
        {/* Loan Request Steps */}
        {showNextSection && (
          <div className="w-full md:w-[42vw]">
            {loanRequestStepId === 2 && (
              <div className="px-4 rounded-lg bg-gray-100 w-full md:w-[42vw] h-full overflow-y-auto">
                {loader ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          setLoanRequestStepId(loanRequestStepId - 1)
                        }
                      >
                        <i className="fas fa-arrow-left text-blue-500"></i>
                      </button>
                      <h1 className="text-md font-semibold font-sans md:text-lg">
                        Хувийн мэдээлэл шалгах
                      </h1>
                    </div>

                    {/* User Data Verification */}
                    <div className="grid grid-cols-2 gap-4 font-sans">
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-gray-600 text-xs md:text-sm">Овог</p>
                        <p className="font-medium text-xs md:text-sm">
                          {userData?.lastName}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-gray-600 text-xs md:text-sm">Нэр</p>
                        <p className="font-medium text-xs md:text-sm">
                          {userData?.firstName}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-gray-600 text-xs md:text-sm">
                          Утасны дугаар
                        </p>
                        <p className="font-medium text-xs md:text-sm">
                          {userData?.phone}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <p className="text-gray-600 text-xs md:text-sm">
                          И-мэйл
                        </p>
                        <p className="font-medium text-xs md:text-sm">
                          {userData?.email}
                        </p>
                      </div>
                    </div>

                    {/* Collateral and Income Selection */}
                    <div className="space-y-4 font-sans">
                      <h2 className="text-md font-semibold md:text-lg">
                        Хувийн мэдээлэл шалгах
                      </h2>
                      <div>
                        <CollateralDropdown
                          collateralList={collateralList}
                          selectedCollateral={selectedCollateral}
                          setSelectedCollateral={setSelectedCollateral}
                        />
                      </div>
                      <IncomeDropdown
                        incomeList={incomeList}
                        selectedIncome={selectedIncome}
                        setSelectedIncome={setSelectedIncome}
                      />
                      <TotalMonthIncomeField
                        totalMonthIncome={totalMonthIncome}
                        setTotalMonthIncome={setTotalMonthIncome}
                      />

                      {/* Branch Selection */}
                      <div>
                        <h2 className="text-md font-semibold md:text-lg">
                          Хүсэлт илгээх салбар сонгох
                        </h2>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          style={{
                            marginBottom: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <InputLabel
                            htmlFor="branch-select"
                            className="text-xs md:text-sm"
                          >
                            Салбар сонгох
                          </InputLabel>
                          <Select
                            value={selectedBranch || ""}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            input={
                              <OutlinedInput
                                id="branch-select"
                                label="Select Branch"
                              />
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

                      {/* Buttons */}
                      <div className="flex justify-end space-x-4 ">
                        <Button
                          variant="outlined"
                          className="px-4 py-2 bg-gray-200 rounded-lg font-sans text-xs md:text-sm"
                          onClick={() => {
                            setLoanRequestStepId(1);
                          }}
                        >
                          Буцах
                        </Button>
                        <Button
                          variant="contained"
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-sans text-xs md:text-sm"
                          onClick={() => {
                            handleButtonClick(); // Call the function immediately
                            setTotalMonthIncome(""); // Reset the totalMonthIncome
                          }}
                        >
                          Хүсэлт илгээх
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Snackbar
              open={snackbarOpen}
              message="Та сарын орлогын нийт дүнгээ оруулна уу?"
              onClose={handleSnackbarClose}
              autoHideDuration={6000}
            />

            {loanRequestStepId === 3 && (
              <div className="space-y-4 px-4 w-[42vw] font-sans">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLoanRequestStepId(loanRequestStepId - 1)}
                  >
                    <i className="fas fa-arrow-left text-blue-500"></i>
                  </button>
                  <h1 className="text-md font-semibold md:text-lg">
                    Баталгаажуулах
                  </h1>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-xs font-normal text-gray-600 md:text-sm">
                        Авах зээлийн дүн
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {Number(loanValue.replace(/,/g, ""))
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })
                          .replace(/^0+/, "")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-normal text-gray-600 md:text-sm">
                        Хүү
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {
                          loanProductionReadyForRequest[currencyIndex]
                            .maxInterestRate
                        }
                        %
                      </p>
                    </div>
                  </div>

                  {verifyRowData(
                    "Сарын төлөлт",
                    `${monthTotal.toLocaleString()}`
                  )}
                  {verifyRowData(
                    "Үндсэн зээлийн нийт төлбөр",
                    `${paybackTotalAmount.toLocaleString()}`
                  )}
                  {verifyRowData("Валют", `${"₮"}`)}
                  {verifyRowData("Хугацаа", `${sliderValue ?? ""} сар`)}
                  {verifyRowData("Салбар", selectedBranch.branchName)}
                </div>
                <div className="bg-white rounded-lg p-4">
                  {verifyRowData("Овог", userData?.lastName)}

                  {verifyRowData("Нэр", userData?.firstName)}
                  {verifyRowData("Утасны дугаар", userData?.phone)}
                  {verifyRowData("И-мэйл", userData?.email)}
                  {verifyRowData("Зээлийн төрөл", nameOfChosenProduct)}
                  {verifyRowData("Барьцаа хөрөнгийн төрөл", selectedCollateral)}
                  {verifyRowData("Орлогын төрөл", selectedIncome.name)}

                  {verifyRowData(
                    "Сарын нийт орлогын дүн /төгрөгөөр/",
                    totalMonthIncome
                  )}
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    variant="outlined"
                    className="px-4 py-2 bg-gray-200 rounded-lg font-sans text-xs md:text-sm"
                    onClick={() => {
                      setLoanRequestStepId(2);
                      setTotalMonthIncome("");
                      setLoanValue("");
                    }}
                  >
                    Буцах
                  </Button>
                  <Button
                    variant="contained"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-sans text-xs md:text-sm"
                    onClick={sendLoanRequest}
                  >
                    Зээлийн хүсэлт илгээх
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <UserProfile />
    </div>
  );
};

export default Loan;
