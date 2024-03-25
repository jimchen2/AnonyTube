// UpdatePassword.js
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Form, Button, Alert } from "react-bootstrap";

function UpdatePassword({ onUpdateSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.trim() === "") {
      setErrorMessage("New password cannot be empty!");
      setShowErrorAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.put(
          `${API_BASE_URL}/user/updatePasswordNew`,
          { newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Password updated successfully:", response.data);
        onUpdateSuccess();
        setShowSuccessAlert(true);
        setNewPassword("");
      } else {
        console.error("Token not found in local storage");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("An error occurred while updating the password.");
      setShowErrorAlert(true);
    }
  };

  return (

    <div style={{maxWidth:"400px"}}>
      <br/>
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          Password updated successfully!
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
        <Form.Group controlId="formNewPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Password
        </Button>
      </Form>
    </div>
  );
}

export default UpdatePassword;
