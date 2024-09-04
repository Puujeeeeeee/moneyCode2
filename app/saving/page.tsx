"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/page";
import { UserProfile } from "@/components/userProfile/page";
import { ToastContainer, toast } from "react-toastify";
import ErrorIcon from "@mui/icons-material/Error";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import axios from "axios";
import {
  createTheme,
  ThemeProvider,
  useTheme,
  TextField,
  Dialog,
  DialogContent,
  OutlinedInput,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  IconButton,
  DialogActions,
  Typography,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";

const SavingScreen = () => {
  const outerTheme = useTheme();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [bankAccountList, setBankAccountList] = useState([]);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [selectedBankAcc, setSelectedBankAcc] = useState(null);
  const [userData, setUserData] = useState(null);
  const [savingServiceData, setSavingServiceData] = useState(null);
  const [selectedSavingServiceData, setSelectedSavingServiceData] = useState(
    null
  );
  const [
    selectedSavingServiceDataPeriodData,
    setSelectedSavingServiceDataPeriodData,
  ] = useState(null);
  const [savingData, setSavingData] = useState([]);
  const [savingTotalAmount, setSavingTotalAmount] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [savingMarker, setSavingMarker] = useState("");
  const [amount, setAmount] = useState("");
  const [workingCo, setWorkingCo] = useState("");
  const [albantushaal, setAlbantushaal] = useState("");
  const [bonusor, setBonusor] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [infoList, setInfoList] = useState([]);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [loader, setLoader] = useState(true);
  const [requiredDataToProvide, setRequiredDataToProvide] = useState([]);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [activeButton, setActiveButton] = useState(0); // Default to the first button

  const latlng = 47.911585011514276;
  const longitd = 106.92994417119706;

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  // Function to update savings details based on selected currency or period
  const updateSavingsDetails = () => {
    console.log(
      "Savings details updated based on selected currency or period."
    );
  };

  // GET BANK ACCOUNT LIST
  const getBankAccountList = async () => {
    const userData = JSON.parse(localStorage.getItem("userInformation")); // Assuming you store user data in localStorage
    const userId = userData?.id;

    try {
      const response = await fetch(
        `https://gateway.invescore.mn/api/user-bank-account/findbyid?userid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setBankAccountList(data);

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

  useEffect(() => {
    getBankAccountList();
  }, []);

  // GET USER DATA
  const getUserData = async () => {
    const userInformation = localStorage.getItem("userInformation"); // Assuming localStorage is used

    if (userInformation) {
      const parsedUserData = JSON.parse(userInformation);
      setUserData(parsedUserData);

      // Call another function (equivalent to `getAccountList()`)
      getAccountList(parsedUserData.id);
    }
  };

  // GET SAVINGS
  const getSavings = () => {
    const regNo = localStorage.getItem("userInformation")
      ? JSON.parse(localStorage.getItem("userInformation")).regNo
      : "";

    axios
      .get(
        `https://gateway.invescore.mn/api/savings/get-savings?regNo=${regNo}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use a valid token here
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;

          const savingData = data.data || [];
          const savingMarker =
            savingData.length > 0 ? savingData[0].currency.marker : "";
          const savingTotalAmount =
            data.totalAmount === 0 ? 0.0 : data.totalAmount;
          const efficiency =
            data.efficiency === 0 ? 0.0 : data.efficiency || 0.0;

          setSavingData(savingData);
          setSavingMarker(savingMarker);
          setSavingTotalAmount(savingTotalAmount);
          setEfficiency(efficiency);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the savings data!", error);
      });
  };

  // GET SAVINGS INFO
  const getSavingInfo = () => {
    setLoader(true); // Start loading

    axios
      .get("https://gateway.invescore.mn/api/savings/get-savings-product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use a valid token here
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setInfoList(data);
          setRequiredDataToProvide(data[0].requiredMaterial || []);
          setSelectedSaving(data[0]);
          setLoader(false); // Stop loading
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the saving product data!",
          error
        );
        setLoader(false); // Stop loading even if there was an error
      });
  };

  const savingTypes = [
    { text: "Итгэлцэл", icon: "/images/itgeltsel.png" },
    { text: "Бонд", icon: "/images/bond.png" },
    { text: "Хувьцаа", icon: "/images/huvitsa.svg" },
    { text: "ХБҮЦ", icon: "/images/card.png" },
    { text: "Цалин", icon: "/images/briefcase.png" },
  ];

  const staticData = [
    {
      titleTiny: "Бонд",
      title: "Бонд",
      description:
        "Бонд гэдэг нь тодорхой хэмжээний мөнгийг тогтоосон хугацааны дараа үндсэн төлбөр болон хүүгийн хамт эргэн төлөхийг баталсан үнэт цаас юм. </br> 2021 онд Санхүүгийн зохицуулах хороо, Монголын хөрөнгийн биржээс холбогдох зөвшөөрөл авсаны дагуу 20 тэрбум төгрөгийн нээлттэй бонд гаргасан. Тус бондын хөтөлбөрийн нийт 3 транчийн үндсэн төлбөр болон хүүгийн төлбөрийг тухай бүр бонд эзэмшигчдийн дансанд цаг хугацаандаа байршуулж, 2023 онд хөтөлбөрийг амжилттай хаасан. </br> 2022 онд дахин нийт 5 транчаас бүрдсэн 50 тэрбум төгрөгийн дүн бүхий нээлттэй бондын хөтөлбөрийг танилцуулсан бөгөөд бонд эзэмшигч хүүгийн төлбөрөө хуваарийн дагуу үнэт цаасны дансандаа хүлээн авч байна. Манай бондын анхдагч зах зээлийн захиалга тогтмол 24 цагийн дотор 100% биелж ирсэн нь компанийн нэр хүнд, хөрөнгө оруулагчдын итгэл өндөр байгааг харуулж байна. </br> Инвескор бондын талаарх дэлгэрэнгүй мэдээллийг Хөрөнгө оруулалтын мэргэшсэн зөвлөх “Инвескор Капитал ҮЦК” ХХК-иас дараах сувгаар авна уу.",
      images: "assets/images/bond.png",
      period: "6-12 сар",
      advantage: [
        "Найдвартай",
        "Хөрвөх чадвар өндөр",
        "итгэлцэл барьцаалсан зээл авах боломжтой",
        "Кредит карт авах боломжтой",
      ],
      dial: {
        phone: "(+976) 7755-0077",
        address:
          "Хаяг: Улаанбаатар хот, Сүхбаатар дүүрэг, 1 хороо, Парисын  гудамж-42, IC tower, 15-р давхар",
      },
      requiredMaterial: ["Иргэний үнэмлэх"],
    },
    {
      titleTiny: "Хувьцаа",
      title: "Хувьцаа",
      description:
        "Хувьцаа гэж компанид хөрөнгө оруулж, түүнийг үндэслэн хувьцаа эзэмшигчдийн хуралд оролцож санал өгөх, ногдол ашиг авах, компанийг татан буулгасны дараа үлдсэн эд хөрөнгийг худалдан борлуулснаас олсон орлогоос хувь хүртэх болон хуулиар тогтоосон бусад эрхийг гэрчилсэн үнэт цаас юм. Компани нь 2019 онд нийт хувьцааныхаа 15% буюу 10,759,188 ширхэг хувьцааг захиалгын бүртгэлийн аргаар олон нийтэд санал болгосон ба нийт санал болгосон хувьцааны 85%-ийг стратегийн хөрөнгө оруулагчдад арилжаалсан. Хөрөнгө оруулагчид нийт 18.9 тэрбум төгрөгийн үнэт цаас худалдан авах санал ирүүлж, анхдагч зах зээлийн арилжаа нийлүүлэлтээсээ давж амжилттай хаагдсан.</br> Хувьцааны талаарх дэлгэрэнгүй мэдээллийг Хөрөнгө оруулалтын мэргэшсэн зөвлөх “Инвескор Капитал ҮЦК” ХХК-иас дараах сувгаар авна уу.",
      images: "assets/images/fpo.png",
      period: "6-12 сар",
      advantage: [
        "Зах зээлд өрсөлдөхүйц үр шим",
        "Даатгалд хамруулах боломжтой",
        "Хөрвөх чадвар өндөр",
        "итгэлцэл барьцаалсан зээл авах боломжтой",
        "Инвескор Платинум кредит карт авах боломжтой",
      ],
      dial: {
        phone: "(+976) 7755-0077",
        address:
          "Хаяг: Улаанбаатар хот, Сүхбаатар дүүрэг, 1 хороо, Парисын  гудамж-42, IC tower, 15-р давхар",
      },
      requiredMaterial: ["Иргэний үнэмлэх"],
    },
    {
      titleTiny: "ХБҮЦ",
      title: "Хөрөнгөөр Баталгаажсан Үнэт Цаас",
      description:
        "Хөрөнгөөр баталгаажсан үнэт цаас нь ирээдүйд олох орлогоор хөрөнгийн багц бүрдүүлэн тусгай зориулалтын компани байгуулж олон нийтэд нээлттэй, хаалттай хүрээнд санал болгодог үнэт цаасжуулсан санхүүгийн хэрэгсэл юм. </br> “Инвескор ББСБ” ХК нь 2021 онд “Микро кредит ББСБ” ХХК-тай хамтран автомашины зээлийн багцаа тусгаарлаж монголын анхны нээлттэй хөрөнгөөр баталгаажсан 24 сарын хугацаатай 4 тэрбум төгрөгийн дүн бүхий үнэт цаасыг олон нийтэд арилжаалсан.</br> Хөрөнгөөр баталгаажсан үнэт цаасны талаарх дэлгэрэнгүй мэдээллийг Хөрөнгө оруулалтын мэргэшсэн зөвлөх “Инвескор Капитал ҮЦК” ХХК-иас дараах сувгаар авна уу.",
      images: "assets/images/ipo.png",
      period: "6-12 сар",
      advantage: [
        "Зах зээлд өрсөлдөхүйц үр шим",
        "Даатгалд хамруулах боломжтой",
        "Хөрвөх чадвар өндөр",
        "итгэлцэл барьцаалсан зээл авах боломжтой",
        "Инвескор Платинум кредит карт авах боломжтой",
      ],
      savingsInfos: [
        {
          id: 3,
          createdUserId: null,
          updatedUserId: null,
          deletedUserId: null,
          createdAt: "2023-06-26 10:59:20",
          updatedAt: null,
          deletedAt: null,
          status: "ACTIVE",
          infoname: "Бүрдүүлэх материал",
          savingsDescs: [
            {
              id: 3,
              createdUserId: 1,
              updatedUserId: null,
              deletedUserId: null,
              createdAt: "2023-06-26 10:59:05",
              updatedAt: null,
              DeletedAt: null,
              status: "ACTIVE",
              description: "Иргэний үнэмлэх",
            },
          ],
        },
        {
          id: 4,
          createdUserId: null,
          updatedUserId: null,
          DeletedUserId: null,
          createdAt: "2023-06-26 10:59:26",
          updatedAt: null,
          DeletedAt: null,
          status: "ACTIVE",
          infoname: "Давуу тал",
          savingsDescs: [
            {
              id: 4,
              createdUserId: 1,
              updatedUserId: null,
              DeletedUserId: null,
              createdAt: "2023-06-26 10:59:05",
              updatedAt: null,
              DeletedAt: null,
              status: "ACTIVE",
              description:
                "Зах зээлд өрсөлдөхүйц өндөр хүүг танд санал болгож байна.",
            },
            {
              id: 6,
              createdUserId: 1,
              updatedUserId: null,
              DeletedUserId: null,
              createdAt: "2023-06-26 10:59:05",
              updatedAt: null,
              DeletedAt: null,
              status: "ACTIVE",
              description:
                "Та байршуулсан итгэлцлийн үр шимээ сар болон улирлын давтамжтайгаар авах",
            },
          ],
        },
      ],
      dial: {
        phone: "(+976) 7755-0077",
        address:
          "Хаяг: Улаанбаатар хот, Сүхбаатар дүүрэг, 1 хороо, Парисын гудамж-42, IC tower, 15-р давхар",
      },
      requiredMaterial: ["Иргэний үнэмлэх"],
    },
  ];

  useEffect(() => {
    // getUserData();
    getSavings();
    getSavingInfo();
  }, []);

  // SAVINGS FIND PROD
  const savingsFindProd = async (id) => {
    try {
      const response = await axios.get(
        `https://gateway.invescore.mn/api/savings/find-product?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setSavingServiceData(data);
        setSelectedSavingServiceData(data.currencyTypes[0]);
      }
    } catch (error) {
      console.error("Error fetching savings product:", error);
    }
  };

  useEffect(() => {
    if (selectedSaving && selectedSaving.id) {
      savingsFindProd(selectedSaving.id);
    }
  }, [selectedSaving]);

  //  GET ACCOUNT LIST
  const getAccountList = async (userId) => {
    try {
      const response = await axios.get(
        `https://gateway.invescore.mn/api/user-bank-account/findbyid?userid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you need an authorization userData.token
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

  // SEND REQUEST
  const sendRequest = async () => {
    if (!amount || !userData) {
      toast.error("Шаардлагатай талбаруудыг бөглөнө үү!");
      return;
    }

    const bodyData = {
      createdUserId: userData.id,
      amount: parseInt(amount.replace(/,/g, "")),
      workOrganizationName: workingCo,
      workPosition: albantushaal,
      sourceIncome: null,
      feedback: null,
    };

    try {
      const response = await axios.post(
        `https://gateway.invescore.mn/api/savings-request/create`,
        bodyData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessPopup(true);
      } else {
        toast.warning(response.data?.message || "Серверийн алдаа !");
      }
    } catch (error) {
      setShowErrorPopup(true);
      console.error("Error sending request:", error);
    }
  };

  // GET LOCATION BRANCH
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
  }, []); // The empty array ensures this effect runs only once

  const customTheme = createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": "#6F7E8C",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });

  const handleCurrencySelect = (currency) => {
    setSelectedSavingServiceData(currency);
    updateSavingsDetails(); // Call the appropriate function
  };

  const handlePeriodSelect = (period) => {
    setSelectedSavingServiceDataPeriodData(period);
    updateSavingsDetails(); // Call the appropriate function
  };
  const calculateLoan = () => {
    const dayperiod = selectedSavingServiceDataPeriodData
      ? selectedSavingServiceDataPeriodData["periodTotalDay"]
      : 0;
    let rates = 1;
    if (selectedSavingServiceDataPeriodData && selectedSavingServiceData) {
      for (const i of selectedSavingServiceDataPeriodData["periodDetails"]) {
        if (i["currency"] === selectedSavingServiceData["code"]) {
          rates = i["rate"];
          break;
        }
      }
    }

    const loanamountsliderval = parseFloat(amount.replace(/,/g, "") || "0");
    const result = selectedSavingServiceDataPeriodData
      ? ((loanamountsliderval * rates) /
          selectedSavingServiceDataPeriodData["yearTotalDay"]) *
        dayperiod
      : 0;

    setBonusor(result);
  };

  // useEffect(() => {
  //   calculateLoan();
  // }, [amount, selectedSavingServiceData, selectedSavingServiceDataPeriodData]);

  useEffect(() => {
    if (activeCategory !== null) {
      const firstProduct = categoryData[activeCategory]?.loanProducts[0];
      if (firstProduct) {
        setActiveProduct(firstProduct.id);
      }
    }
  }, [activeCategory, categoryData]);

  const MainhandleClick = (index) => {
    setActiveCategory(index); // Update the active category

    if (index === 0) {
      setSelectedSaving(infoList[0]);
    } else if (index === 1) {
      setSelectedSaving(staticData[0]);
    } else if (index === 2) {
      setSelectedSaving(staticData[1]);
    } else if (index === 3) {
      setSelectedSaving(staticData[2]);
    } else if (index === 4) {
      setSelectedSaving(infoList[1]);
    }
    setButtonIndex(index);
    setActiveButton(0); // Reset active button to the first one
    setRequiredDataToProvide(infoList[0]?.requiredMaterial || []);
  };

  const handleChange = (event) => {
    setSelectedBankAcc(event.target.value);
  };

  return (
    <div className="flex  h-screen">
      <Navbar />

      <div className="w-full flex flex-col  p-4 bg-gray-100  overflow-y-auto gap-4">
        <p className="text-xl font-semibold text-gray-800 font-sans">
          Хуримтлал
        </p>
        <div className="flex gap-4">
          <div className="flex flex-col h-full gap-4 w-[60%]">
            <div className="flex w-full gap-4">
              <div className="w-[50%] bg-white flex flex-col rounded-xl p-4 h-[80px]">
                <p>Хуримтлалын нийт дүн</p>
                <div className="font-bold text-black">
                  {savingMarker}
                  {savingTotalAmount.toLocaleString()}
                </div>
              </div>
              <div className="w-[50%] bg-white h-[80px] rounded-xl p-4">
                <p>Хуримтлалын үр шим</p>
                <p className="font-semibold">
                  {savingMarker}
                  {efficiency.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              <div className="flex gap-2">
                {savingTypes.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => MainhandleClick(index)}
                    className={`w-full bg-gray-200 h-[150px] rounded-xl flex justify-center items-center flex-col p-4 relative cursor-pointer hover:scale-105 duration-200  ${
                      activeCategory === index ? "bg-white" : ""
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.text}
                      width={25}
                      height={25}
                    />
                    <p className="font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="main_container bg-white w-full h-full flex flex-col gap-2 rounded-xl p-4">
                {staticData && (
                  <div className="flex flex-col gap-4">
                    <div className="flex-1 bg-white p-4 rounded-lg">
                      {buttonIndex === 0 && infoList[0] && (
                        <div className="flex flex-col gap-4">
                          <div className="font-sans">
                            <h2 className="text-lg font-semibold">
                              {infoList[0].investmentType}
                            </h2>
                            <p
                              className="text-gray-500 flex flex-col gap-4"
                              dangerouslySetInnerHTML={{
                                __html: infoList[0].description,
                              }}
                            ></p>
                          </div>
                          <div className="flex flex-col gap-4 font-sans">
                            <div className="flex gap-4">
                              <p className="text-gray-500">
                                Хуримтлалын хугацаа:
                              </p>
                              <p className="font-semibold">
                                {infoList[0].period}
                              </p>
                            </div>
                            <div className="container">
                              <div className="flex flex-col gap-4">
                                <div className="flex gap-2 mt-4">
                                  <div
                                    className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg ${
                                      activeButton === 0
                                        ? " bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                        : " bg-[#E7F0F9] text-blue-500"
                                    }`}
                                    onClick={() => {
                                      handleButtonClick(0);
                                      setRequiredDataToProvide(
                                        infoList[0].requiredMaterial || []
                                      );
                                    }}
                                  >
                                    Тавигдах шаардлага
                                  </div>
                                  <div
                                    className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                      activeButton === 1
                                        ? " bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                        : " bg-[#E7F0F9] text-blue-500"
                                    }`}
                                    onClick={() => {
                                      handleButtonClick(1);
                                      setRequiredDataToProvide(
                                        infoList[0].requiredMaterial || []
                                      );
                                    }}
                                  >
                                    Бүрдүүлэх материал
                                  </div>
                                  <div
                                    className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg ${
                                      activeButton === 2
                                        ? " bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                        : " bg-[#E7F0F9] text-blue-500"
                                    }`}
                                    onClick={() => {
                                      handleButtonClick(2);
                                      setRequiredDataToProvide(
                                        infoList[0].advantage || []
                                      );
                                    }}
                                  >
                                    Давуу тал
                                  </div>
                                </div>
                                <div className="mt-4">
                                  {requiredDataToProvide && (
                                    <div className="flex flex-col gap-2">
                                      {requiredDataToProvide.map(
                                        (item, idx) => (
                                          <div
                                            key={idx}
                                            className="text-gray-700 flex gap-2"
                                          >
                                            <div className="text-blue-500 ">
                                              <CheckCircleOutlineOutlinedIcon />
                                            </div>
                                            {item}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {buttonIndex === 1 && staticData[0] && (
                        <div className="flex flex-col gap-4">
                          <div className="font-sans">
                            <h2 className="text-lg font-semibold">
                              {staticData[0].title}
                            </h2>
                            <p
                              className="text-gray-500 flex flex-col gap-4"
                              dangerouslySetInnerHTML={{
                                __html: staticData[0].description,
                              }}
                            ></p>
                          </div>
                          <div className="flex gap-4 items-center font-sans">
                            <p className="text-gray-500">
                              Хуримтлалын хугацаа:
                            </p>
                            <p className="font-semibold">
                              {staticData[0].period}
                            </p>
                          </div>
                          <div className="container">
                            <div className="flex flex-col gap-4">
                              <div className="flex gap-2 mt-4">
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 0
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(0);
                                    setRequiredDataToProvide(
                                      staticData[0].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Тавигдах шаардлага
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 1
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(1);
                                    setRequiredDataToProvide(
                                      staticData[0].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Бүрдүүлэх материал
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 2
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(2);
                                    setRequiredDataToProvide(
                                      staticData[0].advantage || []
                                    );
                                  }}
                                >
                                  Давуу тал
                                </div>
                              </div>
                              <div className="mt-4">
                                {requiredDataToProvide && (
                                  <div className="flex flex-col gap-2">
                                    {requiredDataToProvide.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-gray-700 flex gap-2"
                                      >
                                        <div className="text-blue-500 ">
                                          <CheckCircleOutlineOutlinedIcon />
                                        </div>
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {buttonIndex === 2 && staticData[1] && (
                        <div className="flex flex-col gap-4">
                          <div className="font-sans">
                            <h2 className="text-lg font-semibold">
                              {staticData[1].title}
                            </h2>

                            <p
                              className="text-gray-500"
                              dangerouslySetInnerHTML={{
                                __html: staticData[1].description,
                              }}
                            ></p>
                          </div>
                          <div className="flex gap-4 items-center font-sans">
                            <p className="text-gray-500">
                              Хуримтлалын хугацаа:
                            </p>
                            <p className="font-semibold">
                              {staticData[1].period}
                            </p>
                          </div>
                          <div className="container">
                            <div className="flex flex-col gap-4">
                              <div className="flex gap-2 mt-4">
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 0
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(0);
                                    setRequiredDataToProvide(
                                      staticData[1].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Тавигдах шаардлага
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 1
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(1);
                                    setRequiredDataToProvide(
                                      staticData[1].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Бүрдүүлэх материал
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 2
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(2);
                                    setRequiredDataToProvide(
                                      staticData[1].advantage || []
                                    );
                                  }}
                                >
                                  Давуу тал
                                </div>
                              </div>
                              <div className="mt-4">
                                {requiredDataToProvide && (
                                  <div className="flex flex-col gap-2">
                                    {requiredDataToProvide.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-gray-700 flex gap-2"
                                      >
                                        <div className="text-blue-500 ">
                                          <CheckCircleOutlineOutlinedIcon />
                                        </div>
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {buttonIndex === 3 && staticData[2] && (
                        <div className="flex flex-col gap-4">
                          <div className="font-sans">
                            <h2 className="text-lg font-semibold">
                              {staticData[2].title}
                            </h2>

                            <p
                              className="text-gray-500"
                              dangerouslySetInnerHTML={{
                                __html: staticData[2].description,
                              }}
                            ></p>
                          </div>

                          <div className="flex gap-4 items-center font-sans">
                            <p className="text-gray-500">
                              Хуримтлалын хугацаа:
                            </p>
                            <p className="font-semibold">
                              {staticData[2].period}
                            </p>
                          </div>
                          <div className="container">
                            <div className="flex flex-col gap-4">
                              <div className="flex gap-2 mt-4">
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 0
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(0);
                                    setRequiredDataToProvide(
                                      staticData[2].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Тавигдах шаардлага
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 1
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(1);
                                    setRequiredDataToProvide(
                                      staticData[2].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Бүрдүүлэх материал
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 2
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(2);
                                    setRequiredDataToProvide(
                                      staticData[2].advantage || []
                                    );
                                  }}
                                >
                                  Давуу тал
                                </div>
                              </div>
                              <div className="mt-4">
                                {requiredDataToProvide && (
                                  <div className="flex flex-col gap-2">
                                    {requiredDataToProvide.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-gray-700 flex gap-2"
                                      >
                                        <div className="text-blue-500 ">
                                          <CheckCircleOutlineOutlinedIcon />
                                        </div>
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {buttonIndex === 4 && infoList[1] && (
                        <div className="flex flex-col gap-4">
                          <div className="font-sans">
                            <h2 className="text-lg font-semibold">Цалин</h2>
                            <p
                              className="text-gray-500"
                              dangerouslySetInnerHTML={{
                                __html: infoList[1].description,
                              }}
                            ></p>
                          </div>
                          <div className="flex gap-4 items-center font-sans">
                            <p className="text-gray-500">
                              Хуримтлалын хугацаа:
                            </p>
                            <p className="font-semibold">
                              {infoList[1].period}
                            </p>
                          </div>
                          <div className="container">
                            <div className="flex flex-col gap-4">
                              <div className="flex gap-2 mt-4">
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 0
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(0);
                                    setRequiredDataToProvide(
                                      infoList[1].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Тавигдах шаардлага
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 1
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(1);
                                    setRequiredDataToProvide(
                                      infoList[1].requiredMaterial || []
                                    );
                                  }}
                                >
                                  Бүрдүүлэх материал
                                </div>
                                <div
                                  className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg  ${
                                    activeButton === 2
                                      ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                  onClick={() => {
                                    handleButtonClick(2);
                                    setRequiredDataToProvide(
                                      infoList[1].advantage || []
                                    );
                                  }}
                                >
                                  Давуу тал
                                </div>
                              </div>
                              <div className="mt-4">
                                {requiredDataToProvide && (
                                  <div className="flex flex-col gap-2">
                                    {requiredDataToProvide.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-gray-700 flex gap-2"
                                      >
                                        <div className="text-blue-500 ">
                                          <CheckCircleOutlineOutlinedIcon />
                                        </div>
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-[40%] flex h-full bg-white rounded-xl gap-4 p-4 flex-col ">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Хүсэлт илгээх</h2>
              <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-700 text-[13px]">
                      Итгэлцэл байршуулах дүн
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-600">
                        {selectedSavingServiceData != null
                          ? selectedSavingServiceData.marker
                          : ""}
                      </span>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="ml-2 text-2xl font-medium text-gray-800 bg-transparent border-none"
                      />
                    </div>
                  </div>
                  {/* <div>
                    <div className="text-[13px] text-gray-600">Үр шим</div>
                    <p className="text-[18px]">+₮{bonusor}</p>
                  </div> */}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">
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
                <InputLabel htmlFor="branch-select">Салбар сонгох</InputLabel>
                <Select
                  value={selectedBranch || ""}
                  onChange={(e) => setSelectedBranch(e.target.value)}
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
                  {branchList.map((branch, index) => (
                    <MenuItem key={index} value={branch}>
                      <Box display="flex" alignItems="center">
                        <Box ml={1}>{branch.branchName}</Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <Box>
              {/* Currency Selection */}
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Валют:
              </Typography>
              <Grid container spacing={2}>
                {savingServiceData?.currencyTypes?.map((currency, index) => (
                  <Grid item key={index}>
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
                        backgroundColor:
                          selectedSavingServiceData?.marker === currency.marker
                            ? "#e3f2fd"
                            : "#f5f5f5",
                        border:
                          selectedSavingServiceData?.marker === currency.marker
                            ? "2px solid #1976d2"
                            : "1px solid #ccc",
                      }}
                      onClick={() => handleCurrencySelect(currency)}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        width="100%"
                      >
                        <IconButton size="small">
                          {selectedSavingServiceData?.marker ===
                          currency.marker ? (
                            <CheckCircleIcon color="primary" />
                          ) : (
                            <RadioButtonUncheckedIcon color="disabled" />
                          )}
                        </IconButton>
                      </Box>
                      <Typography variant="body2">
                        {`${currency.marker} ${currency.name}`}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Period Selection */}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mt: 3, mb: 1 }}
              >
                Хугацаа:
              </Typography>
              <Grid container spacing={2}>
                {savingServiceData?.savingsPeriods?.map((period, index) => (
                  <Grid item key={index}>
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
                        backgroundColor:
                          selectedSavingServiceDataPeriodData?.period ===
                          period.period
                            ? "#e3f2fd"
                            : "#f5f5f5",
                        border:
                          selectedSavingServiceDataPeriodData?.period ===
                          period.period
                            ? "2px solid #1976d2"
                            : "1px solid #ccc",
                      }}
                      onClick={() => handlePeriodSelect(period)}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        width="100%"
                      >
                        <IconButton size="small">
                          {selectedSavingServiceDataPeriodData?.period ===
                          period.period ? (
                            <CheckCircleIcon color="primary" />
                          ) : (
                            <RadioButtonUncheckedIcon color="disabled" />
                          )}
                        </IconButton>
                      </Box>
                      <Typography variant="body2">
                        {`${period.period} ${period.title}`}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <div className="flex flex-col gap-2">
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
                    <InputLabel id="bank-account-label">Данс сонгох</InputLabel>
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
            <div className="mt-8 flex flex-col text-[13px] ">
              <div className="w-[400px] flex items-center justify-between">
                <p>Үр шим өгөх огноо:</p>
                <p className="font-bold text-[15px] flex items-start">
                  {selectedSavingServiceDataPeriodData
                    ? format(
                        new Date(
                          new Date().getTime() +
                            selectedSavingServiceDataPeriodData.periodTotalDay *
                              24 *
                              60 *
                              60 *
                              1000
                        ),
                        "yyyy-MM-dd"
                      )
                    : ""}
                </p>
              </div>
              <div className="w-[400px] flex items-center justify-between">
                <p>Үр шим нэмэгдсэн дүн:</p>
                <p className="font-bold text-[15px] flex items-start">
                  {bonusor.toLocaleString()}
                </p>
              </div>
              <div className="w-[400px] flex items-center justify-between">
                <p>Бүтээгдэхүүн:</p>

                <p className="font-bold text-[15px] flex items-start">
                  {buttonIndex === 0 &&
                    infoList[0] &&
                    infoList[0].investmentType}
                  {buttonIndex === 1 && staticData[0] && staticData[0].title}
                  {buttonIndex === 2 && staticData[1] && staticData[1].title}
                  {buttonIndex === 3 && staticData[2] && staticData[2].title}
                  {buttonIndex === 4 &&
                    infoList[1] &&
                    infoList[1].investmentType}
                </p>
              </div>
            </div>
            <div className="flex w-full gap-2">
              <ThemeProvider theme={customTheme}>
                <TextField
                  label="Ажилладаг байгууллага"
                  value={workingCo}
                  onChange={(e) => setWorkingCo(e.target.value)}
                  className="w-[50%]"
                />
                <TextField
                  label="Албан тушаал"
                  value={albantushaal}
                  onChange={(e) => setAlbantushaal(e.target.value)}
                  className="w-[50%]"
                />
              </ThemeProvider>
            </div>
            <div className="w-full flex justify-end mt-4">
              <Button
                variant="contained"
                onClick={sendRequest}
                className="px-6 py-2 bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white rounded-lg"
              >
                Хүсэлт илгээх
              </Button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>

      <UserProfile />
      <Dialog
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col justify-center items-center p-4">
            <CheckCircleOutlineOutlinedIcon
              style={{ color: "#4CAF50", fontSize: "4rem" }}
            />
            <Typography variant="h6" className="text-center mt-2">
              Амжилттай, Баяр хүргэе
            </Typography>
            <Typography variant="body1" className="text-center">
              Таны хуримтлалын хүсэлт амжилттай үүслээ.
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className="justify-center">
          <Button
            variant="contained"
            onClick={() => setShowSuccessPopup(false)}
            color="primary"
          >
            Зөвшөөрөх
          </Button>
        </DialogActions>
      </Dialog>
      {/* showErrorPopup */}
      <Dialog
        open={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col justify-center items-center p-4">
            <ErrorIcon style={{ color: "#d62828", fontSize: "4rem" }} />
            <Typography variant="h6" className="text-center mt-2">
              Уучлаарай таны хүсэлт амжилтгүй боллоо.
            </Typography>
            <Typography variant="body1" className="text-center">
              Та 24 цагт нэг удаа хүсэлт явуулах боломжтой.
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className="justify-center">
          <Button
            variant="contained"
            onClick={() => setShowErrorPopup(false)}
            color="primary"
          >
            Зөвшөөрөх
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SavingScreen;
