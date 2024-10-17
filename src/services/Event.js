// Event.js
import { API, CONFIG } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

// Hàm tạo sự kiện
export const createEvent = async (eventData) => {
  const token = getToken();
  console.log("Token:", token);
  console.log(eventData);

  const response = await httpClient.post(`${CONFIG.API_GATEWAY}${API.POST}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.result;
};

// Hàm lọc sự kiện
export const filterEvents = async (status, priority, page = 1, size = 10) => {
  const token = getToken();

  const params = {
    status: status || '',
    priority: priority || '',
    page: page,
    size: size,
  };

  const response = await httpClient.get(`${CONFIG.API_GATEWAY}${API.FILTER_EVENTS}`, {
    params: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("API Response:", response);
  return response.data;
};


// Hàm cập nhật sự kiện
export const updateEvent = async (eventId, eventData) => {
  const token = getToken();
  const response = await httpClient.put(`${CONFIG.API_GATEWAY}${API.UPDATE_EVENT}${eventId}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.result;
};

// Hàm xóa sự kiện
export const deleteEvent = async (eventId) => {
  const token = getToken();
  const response = await httpClient.delete(`${CONFIG.API_GATEWAY}${API.DELETE_EVENT}${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.result;
};

// Hàm lấy sự kiện theo ID
export const getEventById = async (eventId) => {
  const token = getToken();
  const response = await httpClient.get(`${CONFIG.API_GATEWAY}${API.GET_EVENT_BY_EVENTID}${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.result;
};


