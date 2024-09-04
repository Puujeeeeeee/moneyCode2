import axios from 'axios';

const BASE_URL = 'https://gateway.invescore.mn/api';

export const getSavings = async (regNo) => {
  const response = await axios.get(`${BASE_URL}/savings/get-savings?regNo=${regNo}`);
  return response.data;
};

export const getSavingInfo = async () => {
  const response = await axios.get(`${BASE_URL}/savings/get-savings-product`);
  return response.data;
};

export const getUserData = async () => {
  const userData = JSON.parse(localStorage.getItem('userInformation'));
  return userData;
};

export const getLocationBranch = async (latitude, longitude) => {
  const response = await axios.get(`${BASE_URL}/branch-location/get-closest-branch?orgId=1&latitude=${latitude}&longitude=${longitude}`);
  return response.data;
};
