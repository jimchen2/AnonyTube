import React from "react";
import { Modal } from "react-bootstrap";

function CalculatingDurationModal({ show }) {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Calculating Duration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please wait while we calculate the video duration...</p>
      </Modal.Body>
    </Modal>
  );
}

export default CalculatingDurationModal;