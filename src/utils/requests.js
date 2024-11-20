import axios from 'axios';
import { toast } from 'react-hot-toast';

const raiseAlerts = (msg, type = 'error', res = {}) => {
  console.log('msg, type', msg, type);
  if (type === 'code') {
    toast.error(`Response Code: ${msg}`);
    console.log('response:', res);
  } else if (type === 'success') {
    toast.success(msg);
  } else {
    console.log('error occured at request:', msg);
  }
};

const handleError = (error) => {
  console.log(typeof error === 'object', typeof error);
  if (typeof error === 'object') {
    if ([400, 401, 403].includes(error.status)) {
      toast.error(`Invalid Request - ${error?.data?.detail}`);
    }
    if ([404].includes(error.status)) {
      toast.error(`Not Found`);
    }
  }
  console.error('error:', error);
};

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

axios.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (error) => {
    if (error && error.response) {
      if (error.response.status === 401) {
        raiseAlerts('Unauthorised User Token');
        localStorage.removeItem('accessToken');
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  },
);

const getDefaultHeaders = () => {
  return {
    'Content-Type': 'application/json',
    // "ngrok-skip-browser-warning": true,
  };
};

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getAccessToken()}`,
    ...getDefaultHeaders(),
  };
};

const reqPatch = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getAuthHeaders();
    const response = await axios.patch(url, data, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqAnonPatch = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getDefaultHeaders();
    const response = await axios.patch(url, data, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqPut = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getAuthHeaders();
    const response = await axios.put(url, data, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqAnonPut = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getDefaultHeaders();
    const response = await axios.put(url, data, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqPost = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getAuthHeaders();
    const response = await axios.post(url, data, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqAnonPost = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getDefaultHeaders();
    const response = await axios.post(url, data, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqGet = async (url, params = {}, headers = false) => {
  try {
    if (!headers) headers = getAuthHeaders();
    const response = await axios.get(url, { params, headers });
    if (response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    handleError(error);
    return false;
  }
};

const reqAnonGet = async (url, params = {}, headers = false) => {
  try {
    if (!headers) headers = getDefaultHeaders();
    const response = await axios.get(url, { params, headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

const reqDelete = async (url, data = {}, headers = false) => {
  try {
    if (!headers) headers = getAuthHeaders();
    const response = await axios.delete(url, { headers });
    if (response.status < 300) {
      return response.data;
    }
    raiseAlerts(response.status, 'code');
    return null;
  } catch (error) {
    raiseAlerts(error);
    return false;
  }
};

export {
  getDefaultHeaders,
  getAuthHeaders,
  reqPost,
  reqGet,
  reqPut,
  reqPatch,
  reqAnonPost,
  reqAnonGet,
  reqAnonPut,
  reqAnonPatch,
  reqDelete,
  getAccessToken,
};
