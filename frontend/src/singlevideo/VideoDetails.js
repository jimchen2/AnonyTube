// VideoDetails.js
import React, { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import LikeButton from "./LikeButton";
import { FRONTEND_BASE_URL } from "../config";
import FollowButton from "../profile/FollowButton";
import { fetchUploaderData } from "./fetchData";

const VideoDetails = ({ video, uploader: initialUploader, videoUuid }) => {
  const [uploader, setUploader] = useState(initialUploader);

  const handleFollowStatusChange = async () => {
    try {
      const { data: uploaderData, error: uploaderError } = await fetchUploaderData(video.uploaderuuid);
      if (uploaderError) {
        console.error("Error fetching uploader data:", uploaderError);
      } else {
        setUploader(uploaderData);
      }
    } catch (error) {
      console.error("Error fetching uploader data:", error);
    }
  };

  return (
    <>
      <h2>{video.title}</h2>
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-center">
          <a href={`${FRONTEND_BASE_URL}/profile/${uploader.username}`}>
            <img
              src={uploader.userimageurl}
              alt={uploader.username}
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
          </a>
          <div>
            <a href={`${FRONTEND_BASE_URL}/profile/${uploader.username}`}>
              <strong>{uploader.username}</strong>
            </a>
            <br />
            <small className="text-muted">
              {uploader.followercount} followers
            </small>
          </div>
          <span style={{width:"20px"}}/>
          <FollowButton
  profileUserId={uploader.useruuid}
  onFollowStatusChange={handleFollowStatusChange}
/>
        </div>
        <div>
          <LikeButton videoUuid={videoUuid} />
        </div>

      </div>
      <div className="mt-3">
        {video.videourl.map((format) => (
          <Button
            key={format.quality}
            variant="Dark"
            className="me-2 mb-2"
            href={format.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download ({format.quality})
          </Button>
        ))}
      </div>
      <Card className="mt-3">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <span>Views: {video.viewscount}</span>
            <small className="text-muted">
              Uploaded on {new Date(video.createdAt).toLocaleDateString()}
            </small>
          </div>
          <Card.Text className="mt-2">{video.description}</Card.Text>
        </Card.Body>
      </Card>
      <div className="mt-3">
        {video.tags.map((tag, index) => (
          <Badge key={index} bg="secondary" className="me-1">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default VideoDetails;
