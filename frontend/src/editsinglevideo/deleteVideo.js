import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken } from "./AuthenticationModal";

export const deleteVideo = async (uuid) => {
  const token = getToken();
  await axios.delete(`${API_BASE_URL}/video/delete/${uuid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};