import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PopularTagsMenu from "./PopularTagsMenu"; // Import the new component

const HomePage = () => {


  return (
    <Container>
      <PopularTagsMenu />
      <br />
    </Container>
  );
};

export default HomePage;
