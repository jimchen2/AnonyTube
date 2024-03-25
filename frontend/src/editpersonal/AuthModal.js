// AuthModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AuthModal({ show, onHide }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
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

export default AuthModal;