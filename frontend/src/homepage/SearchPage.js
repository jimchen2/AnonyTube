// src/SearchPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import VideoCard from "../search/VideoCard";

const SearchPage = ({ query }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      fetchRandomVideos();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/video/search`, {
        params: { query },
      });
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const fetchRandomVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/video/search`, {
        params: { sort: "random", limit: 20 },
      });
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching random videos:", error);
    }
  };

  return (
    <Container>
      <Row>
        {videos.map((video) => (
          <Col key={video._id} sm={12} md={4} lg={3}>
            <VideoCard video={video} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchPage;
