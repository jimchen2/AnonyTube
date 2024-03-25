import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UploadSuccessModal = ({ show, onHide }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/');
    onHide();
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Upload Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>Your video has been uploaded successfully!</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleRedirect}>
          Go to Homepage
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadSuccessModal;