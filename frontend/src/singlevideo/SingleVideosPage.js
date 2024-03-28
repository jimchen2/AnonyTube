// SingleVideoPage.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchVideoData, fetchUploaderData, addVideoView } from "./fetchData";
import VideoDetails from "./VideoDetails";
import { BooleanContext } from "../global/global"; // Import the context where boolean value is stored
import "./iframeStyle.css";

const SingleVideoPage = () => {
  const { videoUuid } = useParams();
  const [video, setVideo] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { boolValue } = useContext(BooleanContext); // Access boolValue from context
  const iframeRef = useRef(null); // Reference to the iframe element

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: videoData, error: videoError } = await fetchVideoData(
          videoUuid
        );
        if (videoError) {
          setError(videoError);
          setLoading(false);
          return;
        }

        setVideo(videoData);

        const { data: uploaderData, error: uploaderError } =
          await fetchUploaderData(videoData.uploaderuuid);
        if (uploaderError) {
          setError(uploaderError);
        } else {
          setUploader(uploaderData);
        }

        setLoading(false);
        await addVideoView(videoUuid);
      } catch (error) {
        setError("An error occurred while fetching video data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [videoUuid]);

  useEffect(() => {
    const sendMessageToIframe = (value) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(value, "*"); // The target origin should be set to a specific domain for security reasons
      }
    };

    // Call sendMessageToIframe whenever boolValue changes
    sendMessageToIframe(boolValue);
  }, [boolValue]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>Video not found.</div>;
  }

  const iframeStyle = {
    border: "none",
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <div className="video-wrapper">
            <iframe
              ref={iframeRef}
              src={`/static/embed/${videoUuid}`}
              title={video.title}
              allowFullScreen
              style={iframeStyle}
              allow="autoplay; fullscreen"
            ></iframe>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <VideoDetails
            video={video}
            uploader={uploader}
            videoUuid={videoUuid}
          />
        </Col>
      </Row>
      <br />
      <br />
      <br />
    </Container>
  );
};

export default SingleVideoPage;
