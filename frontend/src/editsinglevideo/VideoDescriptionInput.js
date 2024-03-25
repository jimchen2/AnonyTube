import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

function VideoDescriptionInput({ description, onDescriptionChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="description">
        Description (Optional)
      </Form.Label>
      <Form.Control
        as="textarea"
        id="description"
        name="description"
        value={description}
        onChange={onDescriptionChange}
        placeholder="Enter video description"
      />
    </Form.Group>
  );
}

export default VideoDescriptionInput;
