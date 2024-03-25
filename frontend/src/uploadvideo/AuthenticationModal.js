// Auth.js

import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function getToken() {
  return localStorage.getItem("token");
}

async function verifyToken() {
  const token = getToken();
  if (!token) {
    return false;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/verifytoken`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.useruuid !== undefined;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

function SessionInvalidModal({ show, onHide }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    if (onHide) {
      onHide();
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Please Sign Up or Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You need to be logged in to access this page. Please sign up or login to continue.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLogin}>
          Go to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { getToken, verifyToken, SessionInvalidModal };