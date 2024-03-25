import React from "react";
import { ProgressBar } from "react-bootstrap";

function UploadProgressBar({ progress }) {
  return (
    <div>
      <ProgressBar now={progress} label={`${progress}%`} />
    </div>
  );
}

export default UploadProgressBar;