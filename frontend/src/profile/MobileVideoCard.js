import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const formatDuration = (duration) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  let formattedDuration = "";

  if (hours > 0) {
    formattedDuration += `${hours}:`;
  }

  if (minutes > 0 || hours > 0) {
    formattedDuration += `${minutes < 10 && hours > 0 ? "0" : ""}${minutes}:`;
  }

  formattedDuration += `${seconds < 10 ? "0" : ""}${seconds}`;

  return formattedDuration;
};

const MobileVideoCard = ({ video }) => {
  return (
    <Card className="mb-4">
      <div className="position-relative" style={{ paddingTop: "56.25%" }}>
        <Card.Img
          variant="top"
          src={video.previewimageurl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div className="position-absolute bottom-0 right-0 mb-2 mr-2 p-1 bg-dark text-white rounded">
          {formatDuration(video.duration)}
        </div>
      </div>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <Link to={`/profile/${video.uploaderusername}`}>
              <Card.Subtitle className="mb-0 text-muted">
                {video.uploaderusername}
              </Card.Subtitle>
            </Link>
          </div>
        </div>
        <Link to={`/video/${video.uuid}`}>
          <Card.Title
            className="text-truncate"
            style={{ maxHeight: "3rem", lineHeight: "1.5rem" }}
          >
            {video.title}
          </Card.Title>
        </Link>
        <small className="text-muted">
          {video.viewscount} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </small>
      </Card.Body>
    </Card>
  );
};

export default MobileVideoCard;
