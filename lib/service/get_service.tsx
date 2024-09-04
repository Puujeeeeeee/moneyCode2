// services.js
import axios from 'axios';
import { parseCookies } from 'nookies'; // npm install nookies

const API_URL = 'https://yourapi.com'; // Base URL for your API

const getAuthHeaders = () => {
  const cookies = parseCookies();
  const token = cookies.token; // Assuming the token is stored in cookies
  return {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const postRequest = async (bodyData:any, url:any, token = true) => {
  try {
    const response = await axios.post(`${API_URL}/${url}`, bodyData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.log('Unauthorized access, handling...');
      // Example: redirect to login or refresh token
    }
    throw error;
  }
};

export const getRequest = async (url:any, token = true) => {
  try {
    const response = await axios.get(`${API_URL}/${url}`, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access, handling...');
    }
    throw error;
  }
};

export const deleteRequest = async (url:any, token = true, msgcode:number) => {
  try {
    const response = await axios.delete(`${API_URL}/${url}`, {
      headers: {
        ...getAuthHeaders(),
        'code': msgcode,
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access, handling...');
    }
    throw error;
  }
};

export const putRequest = async (bodyData:any, url:any, token = true) => {
  try {
    const response = await axios.put(`${API_URL}/${url}`, bodyData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access, handling...');
    }
    throw error;
  }
};

export const uploadImages = async (filePath:any, fileName:any, url:any, token = true) => {
  const formData = new FormData();
  formData.append('file', filePath, fileName);

  try {
    const response = await axios.post(`${API_URL}/${url}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access, handling...');
    }
    throw error;
  }
};
