import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import {
  getToken,
  verifyToken,
  SessionInvalidModal,
  UnauthorizedModal,
} from "./AuthenticationModal";
import EditVideoForm from "./EditVideoForm";
import { fetchVideo, updateVideo } from "./utils";

function EditVideoPage() {
  const { videoUuid } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [userUuid, setUserUuid] = useState(null);

  useEffect(() => {
    const checkAuthenticationAndFetchVideo = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        setShowSessionModal(true);
        setIsLoading(false);
        return;
      }

      try {
        const userUuid = await verifyToken();
        setUserUuid(userUuid);
        setIsAuthenticated(true);

        const videoData = await fetchVideo(videoUuid, token);
        setVideo(videoData);

        if (videoData.uploaderuuid !== userUuid) {
          setShowUnauthorizedModal(true);
        }
      } catch (error) {
        console.error("Error fetching video or verifying token:", error);
        setIsAuthenticated(false);
        setShowSessionModal(true);
      }

      setIsLoading(false);
    };

    checkAuthenticationAndFetchVideo();
  }, [videoUuid, navigate]);

  const handleUpdateVideo = async (updatedVideoData) => {
    const token = getToken();
    try {
      await updateVideo(videoUuid, updatedVideoData, token);
      // Refresh the video data after successful update
      const updatedVideoData = await fetchVideo(videoUuid, token);
      setVideo(updatedVideoData);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated && video && video.uploaderuuid === userUuid ? (
        <EditVideoForm
          video={video}
          onUpdateVideo={handleUpdateVideo}
          navigate={navigate}
        />
      ) : (
        <>
          <SessionInvalidModal
            show={showSessionModal}
            onHide={() => setShowSessionModal(false)}
          />
          <UnauthorizedModal
            show={showUnauthorizedModal}
            onHide={() => setShowUnauthorizedModal(false)}
          />
        </>
      )}
    </div>
  );
}

export default EditVideoPage;