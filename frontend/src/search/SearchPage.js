import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import VideoCard from "./VideoCard";
import SearchForm from "./SearchForm";
import { fetchSearchResults } from "./searchUtils";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [videos, setVideos] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    query: searchParams.get("query") || "",
    duration: searchParams.get("duration") || "",
    uploadedTime: searchParams.get("uploadedTime") || "",
    language: searchParams.get("language") || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchResults = await fetchSearchResults(searchOptions, navigate);
        setVideos(searchResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchData();
  }, [searchOptions, navigate]);

  useEffect(() => {
    const newSearchOptions = {
      query: searchParams.get("query") || "",
      duration: searchParams.get("duration") || "",
      uploadedTime: searchParams.get("uploadedTime") || "",
      language: searchParams.get("language") || "",
    };
    setSearchOptions(newSearchOptions);
  }, [location.search]);

  const handleSearchOptionChange = (event) => {
    const { name, value } = event.target;
    setSearchOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  return (
    <Container>
      <br />
      <SearchForm
        searchOptions={searchOptions}
        handleSearchOptionChange={handleSearchOptionChange}
      />
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
