// authService.js
import axios from "axios";
import { API_BASE_URL } from "../config";

export function getToken() {
  return localStorage.getItem("token");
}

export async function fetchUser(setUser) {
  const token = getToken();
  if (token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/getUserbyToken`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.useruuid) {
        setUser(response.data);
        // console.log(response.data);
      } else {
        console.error("Username not found in the response data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
}
