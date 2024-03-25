// hooks/useSignupForm.js
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, FRONTEND_BASE_URL } from "../config";

export function useSignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!username || !password) {
      setError("Username and password are required");
      return false;
    }
    setError("");
    return true;
  };

  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  const updateProfileImageAfterSignup = async (token) => {
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
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/user/create`, {
        username,
        password,
      });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        setUsername("");
        setPassword("");
        setError("");

        // Update the user's profile image after successful signup
        await updateProfileImageAfterSignup(response.data.token);

        // Redirect to the homepage after successful signup
        window.location.href = "/";
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}
