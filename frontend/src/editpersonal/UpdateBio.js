import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Form, Button, Alert } from "react-bootstrap";

function UpdateBio({ bio, onUpdateSuccess }) {
  const [newBio, setNewBio] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);

  useEffect(() => {
    setNewBio(bio);
  }, [bio]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newBio.trim() === "") {
      setShowConfirmationAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.put(
          `${API_BASE_URL}/user/updateBio`,
          { bio: newBio },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Bio updated successfully:", response.data);
        onUpdateSuccess();
        setShowSuccessAlert(true);
      } else {
        console.error("Token not found in local storage");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleConfirmation = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.put(
          `${API_BASE_URL}/user/updateBio`,
          { bio: "" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Bio updated successfully:", response.data);
        onUpdateSuccess();
        setShowSuccessAlert(true);
      } else {
        console.error("Token not found in local storage");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }

    setShowConfirmationAlert(false);
  };

  return (
    <div>
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          Bio updated successfully!
        </Alert>
      )}
      {showConfirmationAlert && (
        <Alert
          variant="warning"
          onClose={() => setShowConfirmationAlert(false)}
          dismissible
        >
          Are you sure you want to remove your bio?
          <div className="mt-2">
            <Button
              variant="danger"
              onClick={handleConfirmation}
              className="mr-2"
            >
              Yes, remove it
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmationAlert(false)}
            >
              Cancel
            </Button>
          </div>
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Enter your bio"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default UpdateBio;
