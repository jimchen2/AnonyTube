import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Form, Button, Alert } from "react-bootstrap";

function UpdateUsername({ username, placeholder, onUpdateSuccess }) {
  const [newUsername, setNewUsername] = useState(username);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newUsername.trim() === "") {
      setErrorMessage("Username cannot be empty!");
      setShowErrorAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.put(
          `${API_BASE_URL}/user/updateUsername`,
          { username: newUsername },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Username updated successfully:", response.data);
        onUpdateSuccess();
        setShowSuccessAlert(true);
      } else {
        console.error("Token not found in local storage");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Username is already taken."
      ) {
        setErrorMessage("Username is already taken!");
      } else {
        setErrorMessage("An error occurred while updating the username.");
      }
      setShowErrorAlert(true);
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
          Username updated successfully!
        </Alert>
      )}
      {showErrorAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowErrorAlert(false)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder={placeholder}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default UpdateUsername;
