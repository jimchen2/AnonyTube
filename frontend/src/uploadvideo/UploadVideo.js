import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken, SessionInvalidModal } from "./AuthenticationModal";
import VideoFileUpload from "./VideoFileUpload";
import PreviewImageUpload from "./PreviewImageUpload";
import VideoDescriptionInput from "./VideoDescriptionInput";
import VideoTitleInput from "./VideoTitleInput";
import LanguageInput from "./LanguageInput";
import UploadProgressBar from "./UploadProgressBar";
import { uploadVideo } from "./uploadService";
import { Button } from "react-bootstrap";
import TagInput from "./TagInput";
import { formatBytes, getTimeRemaining } from "./utils";
import UploadSuccessModal from "./UploadSuccessModal";
import CalculatingDurationModal from "./CalculatingDurationModal";

function UploadVideoPage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("en");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tags, setTags] = useState([]);
  const [videoSize, setVideoSize] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [showCalculatingDurationModal, setShowCalculatingDurationModal] =
    useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!(await verifyToken())) {
        setShowModal(true);
      }
    };

    initialize();
  }, [navigate]);

  const handleRedirect = () => {
    navigate("/");
  };

  const handleTagsChange = (selectedTags) => setTags(selectedTags);
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoSize(file.size);
  };
  const handlePreviewImageChange = (e) => setPreviewImage(e.target.files[0]);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      videoFile,
      previewImage,
      title,
      description,
      language,
      tags,
    };

    try {
      const startTime = Date.now();
      await uploadVideo(
        formData,
        (progress) => {
          setUploadProgress(progress);
          const elapsedTime = (Date.now() - startTime) / 1000; // In seconds
          const uploadedBytes = (progress / 100) * videoSize;
          const speed = uploadedBytes / elapsedTime;
          setUploadSpeed(speed);
        },
        setShowCalculatingDurationModal
      );
      setShowUploadSuccessModal(true); // Show the success modal
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div style={{ fontSize: "16px" }}>
      <SessionInvalidModal show={showModal} onRedirect={handleRedirect} />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <VideoFileUpload onFileChange={handleVideoFileChange} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <PreviewImageUpload onImageChange={handlePreviewImageChange} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <VideoTitleInput title={title} onTitleChange={handleTitleChange} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <LanguageInput
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <TagInput tags={tags} onTagsChange={handleTagsChange} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <VideoDescriptionInput
            description={description}
            onDescriptionChange={handleDescriptionChange}
          />
        </div>
        <Button type="submit" disabled={uploadProgress > 0}>
          Upload Video
        </Button>
      </form>
      {uploadProgress > 0 && (
        <div>
          <UploadProgressBar progress={uploadProgress} />
          <div style={{ fontSize: "14px" }}>
            Video Size: {formatBytes(videoSize)}
            <br />
            Time Remaining:{" "}
            {getTimeRemaining(uploadSpeed, videoSize, uploadProgress)}
          </div>
        </div>
      )}
      <CalculatingDurationModal show={showCalculatingDurationModal} />
      <UploadSuccessModal
        show={showUploadSuccessModal}
        onHide={() => setShowUploadSuccessModal(false)}
      />
    </div>
  );
}

export default UploadVideoPage;
