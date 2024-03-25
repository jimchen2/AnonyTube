// hooks/updateProfileImageAfterSignup.js
import axios from "axios";
import { API_BASE_URL, FRONTEND_BASE_URL } from "../config";

export async function updateProfileImageAfterSignup(token) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/updateProfileImage`,
      {
        userimageurl: `${FRONTEND_BASE_URL}/userpreview.png`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Profile image updated successfully");
  } catch (error) {
    console.error(
      "Error updating profile image:",
      error.response ? error.response.data : error.message
    );
  }
}
