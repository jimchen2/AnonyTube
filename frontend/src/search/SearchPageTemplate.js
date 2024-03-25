// src/SearchPage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import VideoCard from "./VideoCard";

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchSearchResults();
  }, [location.search]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/video/search`, {
        params: Object.fromEntries(searchParams),
      });
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <Container>
      {/* <h1>Search Results</h1> */}
      <Row>
        {videos.map((video) => (
          <Col key={video._id} sm={6} md={4} lg={3}>
            <VideoCard video={video} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchPage;
