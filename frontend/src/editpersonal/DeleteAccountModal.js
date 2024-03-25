// DeleteAccountModal.js
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Modal, Button, Form } from "react-bootstrap";

function DeleteAccountModal({ show, onHide, onDeleteSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          `${API_BASE_URL}/user/delete`,
          { password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("token");
        onDeleteSuccess();
      } else {
        console.error("Token not found in local storage");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.response && error.response.status === 401) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred while deleting the account.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please enter your password to confirm account deletion:</p>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {error && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteAccountModal;
