import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

function VideoFileUpload({ onFileChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="videoFile">
        Video File
      </Form.Label>
      <Form.Control
        type="file"
        id="videoFile"
        name="videoFile"
        onChange={onFileChange}
        required
      />
    </Form.Group>
  );
}

export default VideoFileUpload;
