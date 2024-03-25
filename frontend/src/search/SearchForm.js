import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const SearchForm = ({ searchOptions, handleSearchOptionChange }) => {
  return (
    <Form>
      <Row>
        <Col>
          <Form.Group controlId="duration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              as="select"
              name="duration"
              value={searchOptions.duration}
              onChange={handleSearchOptionChange}
            >
              <option value="">All</option>
              <option value="short">Under 4 minutes</option>
              <option value="medium">4-20 minutes</option>
              <option value="long">Over 20 minutes</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="uploadedTime">
            <Form.Label>Date</Form.Label>
            <Form.Control
              as="select"
              name="uploadedTime"
              value={searchOptions.uploadedTime}
              onChange={handleSearchOptionChange}
            >
              <option value="">All</option>
              <option value="24 hours ago-now">Last 24 hours</option>
              <option value="one week ago-now">Last 7 days</option>
              <option value="one month ago-now">Last 30 days</option>
              <option value="one year ago-now">Last 365 days</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="language">
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              name="language"
              value={searchOptions.language}
              onChange={handleSearchOptionChange}
            >
              <option value="">All</option>
              <option value="en">English</option>
              <option value="zh">Chinese (Simplified)</option>
              <option value="ru">Russian</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="sortBy">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              name="sortBy"
              value={searchOptions.sortBy}
              onChange={handleSearchOptionChange}
            >
              <option value="uploaddate">Upload Date</option>
              <option value="views">View Count</option>
              <option value="likes">Rating</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
