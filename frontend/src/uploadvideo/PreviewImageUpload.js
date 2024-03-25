import React from 'react';
import { Form } from 'react-bootstrap';

function PreviewImageUpload({ onImageChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="previewImage">
        Preview Image (Optional)
      </Form.Label>
      <Form.Control
        type="file"
        id="previewImage"
        name="previewImage"
        onChange={onImageChange}
        accept="image/*"
      />
    </Form.Group>
  );
}

export default PreviewImageUpload;
