// services/Profile.js
import axios from 'axios';
import { API, CONFIG } from "../configurations/configuration";

export const getProfileIDs = async () => {
  const response = await axios.get(`${CONFIG.API_GATEWAY}${API.GET_PROFILEID}`);
  return response.data; // Giả sử API trả về một mảng các profileID
};
