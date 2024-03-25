// LanguageInput.js
import React from 'react';
import { Form } from 'react-bootstrap';

const LanguageInput = ({ language, onLanguageChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="language">Language</Form.Label>
      <Form.Select
        as="select"
        id="language"
        name="language"
        value={language}
        onChange={onLanguageChange}
      >
        <option value="en">English</option>
        <option value="zh">Chinese</option>
        <option value="ru">Russian</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="ar">Arabic</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
      </Form.Select>
    </Form.Group>
  );
};

export default LanguageInput;
