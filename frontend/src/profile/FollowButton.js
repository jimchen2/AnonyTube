import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function FollowButton({
  profileUserId,
  onFollowStatusChange,
  blockStatusUpdated,
}) {
  const [isFollowing, setIsFollowing] = useState(false);
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
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/getUserFollowers/${profileUserId}`
        );
        setIsFollowing(response.data.followers.includes(currentUserId));
      } catch (error) {
        console.error("Error checking block status:", error);
      }
    };

    if (currentUserId) {
      checkFollowStatus();
    }
  }, [currentUserId, profileUserId, blockStatusUpdated]);

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        await axios.post(
          `${API_BASE_URL}/user/unfollow/${profileUserId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFollowing(false);
        setAlertMessage("Unfollowed successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/user/follow/${profileUserId}`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsFollowing(true);
        setAlertMessage("Followed successfully!");
      }
      setShowAlert(true);
      onFollowStatusChange();
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      if (error.response) {
        if (error.response.data.message === "Invalid or expired token") {
          setAlertMessage("You must be logged in to follow/unfollow.");
        } else if (
          error.response.data.message ===
          "Following is prohibited due to a block relationship"
        ) {
          setAlertMessage("You are blocked or have blocked this user.");
        } else {
          setAlertMessage("An error occurred. Please try again.");
        }
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
          variant={isFollowing ? "success" : "danger"}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Button
        variant={isFollowing ? "secondary" : "primary"}
        onClick={handleFollowClick}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </>
  );
}

export default FollowButton;
