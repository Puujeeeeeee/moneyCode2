"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/page";
import UserProfile from "../../components/userProfile/page";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
interface SubProduct {
  id: number;
  description?: string;
  amount?: number;
  minInterest?: number;
  maxInterest?: number;
  duration?: number;
}

interface LoanProduct {
  id: number;
  name: string;
  subProducts: SubProduct[];
}

interface Category {
  id: number;
  categoryNameShort: string;
  loanProducts: LoanProduct[];
}
const savingTypes = [
  { text: "Итгэлцэл", icon: "assets/icons/itgeltsel.png" },
  { text: "Бонд", icon: "assets/icons/bond.png" },
  { text: "Хувьцаа", icon: "assets/icons/growth.png" },
  { text: "ХБҮЦ", icon: "assets/icons/card.png" },
  { text: "Цалин", icon: "assets/icons/briefcase.png" },
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
            deletedAt: null,
            status: "ACTIVE",
            description: "Иргэний үнэмлэх",
          },
        ],
      },
      {
        id: 4,
        createdUserId: null,
        updatedUserId: null,
        deletedUserId: null,
        createdAt: "2023-06-26 10:59:26",
        updatedAt: null,
        deletedAt: null,
        status: "ACTIVE",
        infoname: "Давуу тал",
        savingsDescs: [
          {
            id: 4,
            createdUserId: 1,
            updatedUserId: null,
            deletedUserId: null,
            createdAt: "2023-06-26 10:59:05",
            updatedAt: null,
            deletedAt: null,
            status: "ACTIVE",
            description:
              "Зах зээлд өрсөлдөхүйц өндөр хүүг танд санал болгож байна.",
          },
          {
            id: 6,
            createdUserId: 1,
            updatedUserId: null,
            deletedUserId: null,
            createdAt: "2023-06-26 10:59:05",
            updatedAt: null,
            deletedAt: null,
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
        "Хаяг: Улаанбаатар хот, Сүхбаатар дүүрэг, 1 хороо, Парисын  гудамж-42, IC tower, 15-р давхар",
    },
    requiredMaterial: ["Иргэний үнэмлэх"],
  },
];

const SavingTabs: React.FC = () => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [infoList, setInfoList] = useState([]);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [selectedInfoId, setSelectedInfoId] = useState(null);
  const [loader, setLoader] = useState(true);
  const [requiredDataToProvide, setRequiredDataToProvide] = useState<
    string[] | null
  >(null);
  const [buttonIndex, setButtonIndex] = useState(0);
  const loanProductionreadyForrequest = [
    {
      currencyModel: { marker: "₮", name: "MNT" },
      interest: "12%",
      minAmount: 1000000,
      minDuration: 1,
      maxDuration: 60,
    },
  ];

  useEffect(() => {
    const getSavingInfo = async () => {
      try {
        setLoader(true);
        const response = await fetch(
          "https://gateway.invescore.mn/api/savings/get-savings-product"
        );
        const data = await response.json();
        if (response.ok) {
          setInfoList(data);
          setRequiredDataToProvide(data[0]?.requiredMaterial);
          setSelectedSaving(data[0]);
          setSelectedInfoId(1);
        } else {
          // Handle the error as needed
          console.error("Error fetching data:", data);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoader(false);
      }
    };

    getSavingInfo();
  }, []);
  useEffect(() => {
    if (activeCategory !== null) {
      const firstProduct = categoryData[activeCategory]?.loanProducts[0];
      if (firstProduct) {
        setActiveProduct(firstProduct.id);
      }
    }
  }, [activeCategory, categoryData]);

  const handleClick = (index: any) => {
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
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {savingTypes.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-full bg-gray-200 h-[150px] rounded-xl flex justify-center items-center flex-col p-4 relative cursor-pointer ${
              activeCategory === index ? "bg-white" : ""
            }`}
          >
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
                      className="text-gray-500 flex flex-col gap-4  "
                      dangerouslySetInnerHTML={{
                        __html: infoList[0].description,
                      }}
                    ></p>
                  </div>
                  <div className="flex flex-col gap-4  font-sans">
                    <div className="flex gap-4">
                      <p className="text-gray-500">Хуримтлалын хугацаа:</p>
                      <p className="font-semibold">{infoList[0].period}</p>
                    </div>
                    <div className="container ">
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mt-4">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                            onClick={() =>
                              setRequiredDataToProvide(
                                infoList[0].requiredMaterial || []
                              )
                            }
                          >
                            Тавигдах шаардлага
                          </button>
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                            onClick={() =>
                              setRequiredDataToProvide(
                                infoList[0].requiredMaterial || []
                              )
                            }
                          >
                            Бүрдүүлэх материал
                          </button>
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                            onClick={() =>
                              setRequiredDataToProvide(
                                infoList[0].advantage || []
                              )
                            }
                          >
                            Давуу тал
                          </button>
                        </div>
                        <div className="mt-4">
                          {requiredDataToProvide && (
                            <div className="flex flex-col gap-2">
                              {requiredDataToProvide.map(
                                (item: string, idx: number) => (
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
                    <p className="text-gray-500">Хуримтлалын хугацаа:</p>
                    <p className="font-semibold">{staticData[0].period}</p>
                  </div>
                  <div className="container ">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[0].requiredMaterial || []
                            )
                          }
                        >
                          Тавигдах шаардлага
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[0].requiredMaterial || []
                            )
                          }
                        >
                          Бүрдүүлэх материал
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[0].advantage || []
                            )
                          }
                        >
                          Давуу тал
                        </button>
                      </div>
                      <div className="mt-4">
                        {requiredDataToProvide && (
                          <div className="flex flex-col gap-2">
                            {requiredDataToProvide.map(
                              (item: string, idx: number) => (
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
                    <p className="text-gray-500">Хуримтлалын хугацаа:</p>
                    <p className="font-semibold">{staticData[1].period}</p>
                  </div>{" "}
                  <div className="container ">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[1].requiredMaterial || []
                            )
                          }
                        >
                          Тавигдах шаардлага
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[1].requiredMaterial || []
                            )
                          }
                        >
                          Бүрдүүлэх материал
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[1].advantage || []
                            )
                          }
                        >
                          Давуу тал
                        </button>
                      </div>
                      <div className="mt-4">
                        {requiredDataToProvide && (
                          <div className="flex flex-col gap-2">
                            {requiredDataToProvide.map(
                              (item: string, idx: number) => (
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
                    <p className="text-gray-500">Хуримтлалын хугацаа:</p>
                    <p className="font-semibold">{staticData[2].period}</p>
                  </div>
                  <div className="container ">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[2].requiredMaterial || []
                            )
                          }
                        >
                          Тавигдах шаардлага
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[2].requiredMaterial || []
                            )
                          }
                        >
                          Бүрдүүлэх материал
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              staticData[2].advantage || []
                            )
                          }
                        >
                          Давуу тал
                        </button>
                      </div>
                      <div className="mt-4">
                        {requiredDataToProvide && (
                          <div className=" flex flex-col gap-2">
                            {requiredDataToProvide.map(
                              (item: string, idx: number) => (
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
                    <p className="text-gray-500">Хуримтлалын хугацаа:</p>
                    <p className="font-semibold">{infoList[1].period}</p>
                  </div>
                  <div className="container ">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              infoList[1].requiredMaterial || []
                            )
                          }
                        >
                          Тавигдах шаардлага
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              infoList[1].requiredMaterial || []
                            )
                          }
                        >
                          Бүрдүүлэх материал
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                          onClick={() =>
                            setRequiredDataToProvide(
                              infoList[1].advantage || []
                            )
                          }
                        >
                          Давуу тал
                        </button>
                      </div>
                      <div className="mt-4">
                        {requiredDataToProvide && (
                          <div className="flex flex-col gap-2">
                            {requiredDataToProvide.map(
                              (item: string, idx: number) => (
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingTabs;
