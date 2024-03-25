import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

function VideoTitleInput({ title, onTitleChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="title">
        Title
      </Form.Label>
      <Form.Control
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={onTitleChange}
        placeholder="Enter video title"
        required
      />
    </Form.Group>
  );
}

export default VideoTitleInput;
