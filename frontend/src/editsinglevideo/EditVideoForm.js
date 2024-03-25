import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken } from "./AuthenticationModal";
import LanguageInput from "./LanguageInput";
import PreviewImageUpload from "./PreviewImageUpload";
import TagInput from "./TagInput";
import { uploadPreviewImage } from "./utils";
import VideoDescriptionInput from "./VideoDescriptionInput";
import VideoTitleInput from "./VideoTitleInput";
import { deleteVideo } from "./deleteVideo";

function EditVideoForm({ video, navigate }) {
  console.log(video);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [language, setLanguage] = useState(video.language);
  const [previewImage, setPreviewImage] = useState(null);
  const [tags, setTags] = useState(video.tags);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setPreviewImage(file);
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      const token = getToken();
      let previewImageUrl = video.previewimageurl;

      if (previewImage) {
        previewImageUrl = await uploadPreviewImage(previewImage);
      }

      await axios.patch(
        `${API_BASE_URL}/video/update/${video.uuid}`,
        {
          title,
          description,
          language,
          previewimageurl: previewImageUrl,
          tags,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating video:", error);
      setIsUpdating(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(`/edit`);
  };

  const handleDeleteVideo = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDeleteVideo = async () => {
    setIsDeleting(true);
    try {
      await deleteVideo(video.uuid);
      navigate("/edit");
    } catch (error) {
      console.error("Error deleting video:", error);
      setIsDeleting(false);
    }
  };

  const handleCancelDeleteVideo = () => {
    setShowDeleteConfirmModal(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <VideoTitleInput title={title} onTitleChange={handleTitleChange} />
        <VideoDescriptionInput
          description={description}
          onDescriptionChange={handleDescriptionChange}
        />
        <LanguageInput
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <PreviewImageUpload onImageChange={handleImageChange} />
        <TagInput tags={tags} onTagsChange={handleTagsChange} />

        <Button variant="primary" type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Video"}
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteVideo}
          disabled={isDeleting}
          style={{ marginLeft: "10px" }}
        >
          {isDeleting ? "Deleting..." : "Delete Video"}
        </Button>
      </Form>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Video Updated Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your video has been updated successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteConfirmModal} onHide={handleCancelDeleteVideo}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Video Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this video?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDeleteVideo}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDeleteVideo}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditVideoForm;
