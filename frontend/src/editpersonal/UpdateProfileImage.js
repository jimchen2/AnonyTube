import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, Public_Bucket_URL } from "../config";
import { Form, Button, Alert, Image } from "react-bootstrap";

function UpdateProfileImage({ userimageurl, placeholder, onUpdateSuccess }) {
  const [newImageUrl, setNewImageUrl] = useState(userimageurl);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Generate a presigned URL for image upload
        const presignedUrlResponse = await axios.post(
          `${API_BASE_URL}/generatePresignedUrl`,
          { type: "image" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { url, objectKey } = presignedUrlResponse.data;

        // Upload the image to the presigned URL
        await axios.put(url, selectedImage, {
          headers: {
            "Content-Type": selectedImage.type,
          },
        });

        // Update the user's profile image URL
        await axios.put(
          `${API_BASE_URL}/user/updateProfileImage`,
          {
            userimageurl: `${Public_Bucket_URL}/${objectKey}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNewImageUrl(`${Public_Bucket_URL}/${objectKey}`);
        setShowSuccessAlert(true);
        onUpdateSuccess();
      } else {
        console.error("Token not found in local storage");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  return (
    <div>
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          Profile image updated successfully!
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formProfileImage">
          <Form.Label>Select Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={!selectedImage}>
          Update
        </Button>
      </Form>
      <div className="mt-3">
        <Image
          src={newImageUrl || placeholder}
          alt="Profile"
          thumbnail
          style={{ width: "150px", height: "150px" }}
        />
      </div>
      {newImageUrl && <div></div>}
    </div>
  );
}

export default UpdateProfileImage;
