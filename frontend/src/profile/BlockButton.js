import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function BlockButton({ profileUserId, onBlockStatusChange }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            `${API_BASE_URL}/user/getUserbyToken`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCurrentUserId(response.data.useruuid);
        } else {
          console.error("Token not found in local storage");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/getUserBeingBlocked/${profileUserId}`
        );
        console.log(response.data);
        setIsBlocked(response.data.beingBlocked.includes(currentUserId));
      } catch (error) {
        console.error("Error checking block status:", error);
      }
    };

    if (currentUserId) {
      checkBlockStatus();
    }
  }, [currentUserId, profileUserId]);

  const handleBlockClick = async () => {
    try {
      if (isBlocked) {
        await axios.post(
          `${API_BASE_URL}/user/unblock/${profileUserId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsBlocked(false);
        setAlertMessage("User unblocked successfully!");
        onBlockStatusChange(false); // Pass false to indicate unblocking
      } else {
        await axios.post(`${API_BASE_URL}/user/block/${profileUserId}`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsBlocked(true);
        setAlertMessage("User blocked successfully!");
      }
      setShowAlert(true);
      onBlockStatusChange(true); // Pass true to indicate blocking
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      if (
        error.response &&
        error.response.data.message === "Invalid or expired token"
      ) {
        setAlertMessage("You must be logged in to block/unblock users.");
      } else {
        setAlertMessage("An error occurred. Please try again.");
      }
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert
          variant={isBlocked ? "success" : "danger"}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Button
        variant={isBlocked ? "secondary" : "danger"}
        onClick={handleBlockClick}
      >
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    </>
  );
}

export default BlockButton;
