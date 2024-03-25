// LikeButton.js
import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import {
  likeVideo,
  unlikeVideo,
  isUserLiked,
  fetchVideoData,
} from "./fetchData";

const LikeButton = ({ videoUuid }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: isLikedData, error: isLikedError } = await isUserLiked(
        videoUuid
      );
      if (!isLikedError) {
        setIsLiked(isLikedData.isLiked);
      } else {
        setError(isLikedError);
        // Handle authentication error, e.g., redirect to login page
        if (isLikedError.includes("401")) {
          // Redirect to login page or show an error message
        }
      }

      const { data: videoData, error: videoError } = await fetchVideoData(
        videoUuid
      );
      if (!videoError) {
        setLikeCount(videoData.likecount);
      } else {
        setError(videoError);
      }
    };

    fetchData();
  }, [videoUuid]);

  const handleLikeClick = async () => {
    if (isLiked) {
      const { data: unlikeData, error: unlikeError } = await unlikeVideo(
        videoUuid
      );
      if (!unlikeError) {
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        setError(unlikeError);
        if (unlikeError.includes("401")) {
          setShowAlert(true);
        }
      }
    } else {
      const { data: likeData, error: likeError } = await likeVideo(videoUuid);
      if (!likeError) {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      } else {
        setError(likeError);
        if (likeError.includes("403")) {
          setShowAlert(true);
        }
      }
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          You must be logged in to follow/unfollow.
        </Alert>
      )}
      <Button
        variant={isLiked ? "primary" : "outline-primary"}
        onClick={handleLikeClick}
      >
        {isLiked ? "Liked" : "Like"} ({likeCount})
      </Button>
    </>
  );
};

export default LikeButton;
