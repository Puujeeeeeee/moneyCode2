"use client";
import React, { useState } from "react";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Button } from "@mui/material";

const RequirementTabs = ({ subProduct }: { subProduct: any }) => {
  const [activeTab, setActiveTab] = useState<string>("Тавигдах шаардлага");

  const tabNames = ["Тавигдах шаардлага", "Бүрдүүлэх материал", "Барьцаа"];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getUniqueRequirements = (requirements: string[], limit?: number) => {
    let uniqueRequirements = Array.from(new Set(requirements));
    if (limit) {
      uniqueRequirements = uniqueRequirements.splice(0, limit);
    }
    return uniqueRequirements;
  };

  const getRequirementsForTab = (tabName: string) => {
    switch (tabName) {
      case "Тавигдах шаардлага":
        return getUniqueRequirements(subProduct.borrowerRequirement || [], 5); // Show only first 5 unique items
      case "Бүрдүүлэх материал":
        return getUniqueRequirements(subProduct.requiredMaterials || [], 5); // Show only first 5 unique items
      case "Барьцаа":
        return getUniqueRequirements(subProduct.collateral || [], 5); // Show only first 5 unique items
      default:
        return [];
    }
  };

  return (
    <div>
      <div className="flex space-x-2 mb-2">
        {tabNames.map((tabName) => (
          <div
            key={tabName}
            onClick={() => handleTabClick(tabName)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg ${
              activeTab === tabName
                ? "bg-gradient-to-r from-[#255DBE] to-[#5A9BF8] text-white"
                : "bg-[#E7F0F9] text-blue-500"
            }`}
          >
            {tabName}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium">{activeTab}</h2>
        <ul>
          {getRequirementsForTab(activeTab).map(
            (value: string, index: number) => (
              <div key={index} className="flex gap-2 items-center text-sm">
                <CheckCircleOutlineOutlinedIcon className="text-blue-500" />
                <p>{value}</p>
              </div>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default RequirementTabs;
