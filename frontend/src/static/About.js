import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { aboutContent } from "./AboutContent";

function About() {
  const customComponents = {
    h2: ({ node, ...props }) => (
      <h2 style={{ fontSize: "1.25rem" }} {...props} /> // Adjust the font size as needed
    ),
    h3: ({ node, ...props }) => (
      <h3 style={{ fontSize: "1.25rem" }} {...props} /> // Adjust the font size as needed
    ),
    p: ({ node, ...props }) => (
      <p style={{ fontSize: "1rem" }} {...props} /> // Adjust the font size as needed
    ),
    // Custom styling for bullet lists
    ul: ({ node, ...props }) => (
      <ul style={{ fontSize: "1rem" }} {...props} /> // Customize as needed
    ),
  };

  return (
    <div style={{ fontFamily: "'Ubuntu', sans-serif" }}>
      <ReactMarkdown components={customComponents}>
        {aboutContent}
      </ReactMarkdown>
    </div>
  );
}

export default About;
