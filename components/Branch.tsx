
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchSelection = () => {
  const [selectedBranch, setSelectedBranch] = useState({});
  const [branchList, setBranchList] = useState([]);
  const [loader, setLoader] = useState(true);

  const latlng = 47.911585011514276;
  const longitd = 106.92994417119706;

  const getLocationBranch = async () => {
    const url = `https://your-core-url.com/branch-location/get-closest-branch?orgId=1&latitude=${latlng}&longitude=${longitd}`;
    
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setBranchList(response.data);
        setSelectedBranch(response.data[0]);
        setLoader(false);
      }
    } catch (error) {
      console.error('Error fetching branch data:', error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getLocationBranch();
  }, []);

  if (loader) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <select
        value={selectedBranch?.branchName || ''}
        onChange={(e) => {
          const branch = branchList.find(branch => branch.branchName === e.target.value);
          setSelectedBranch(branch);
        }}
        className="border border-gray-300 rounded-lg p-2 w-full"
      >
        {branchList.map((branch, index) => (
          <option key={index} value={branch.branchName}>
            {branch.branchName}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <h2>Selected Branch:</h2>
        <p>{selectedBranch?.branchName || 'None selected'}</p>
      </div>
    </div>
  );
};

export default BranchSelection;
