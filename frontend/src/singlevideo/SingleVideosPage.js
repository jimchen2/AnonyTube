// SingleVideoPage.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchVideoData, fetchUploaderData, addVideoView } from "./fetchData";
import VideoDetails from "./VideoDetails";
import "./iframeStyle.css"; // Import the CSS file

const SingleVideoPage = () => {
  const { videoUuid } = useParams();
  const [video, setVideo] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>Video not found.</div>;
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <div className="video-wrapper">
            <iframe
              src={`/static/embed/${videoUuid}`}
              title={video.title}
              allowFullScreen
              style={{ border: "none" }}
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
