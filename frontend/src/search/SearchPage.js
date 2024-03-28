// ./searchpage
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import VideoCard from "./VideoCard";
import SearchForm from "./SearchForm";
import { fetchSearchResults, fetchTotalSearchResultsCount } from "./searchUtils";
import Pagination from "./Pagination";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [videos, setVideos] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState({
    query: searchParams.get("query") || "",
    duration: searchParams.get("duration") || "",
    uploadedTime: searchParams.get("uploadedTime") || "",
    language: searchParams.get("language") || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchResults = await fetchSearchResults(
          { ...searchOptions, start: (currentPage - 1) * 20 },
          navigate
        );
        setVideos(searchResults);

        const totalCount = await fetchTotalSearchResultsCount(searchOptions);
        setTotalResults(totalCount);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchData();
  }, [searchOptions, currentPage, navigate]);

  useEffect(() => {
    const newSearchOptions = {
      query: searchParams.get("query") || "",
      duration: searchParams.get("duration") || "",
      uploadedTime: searchParams.get("uploadedTime") || "",
      language: searchParams.get("language") || "",
    };
    setSearchOptions(newSearchOptions);
    setCurrentPage(1);
  }, [location.search]);

  const handleSearchOptionChange = (event) => {
    const { name, value } = event.target;
    setSearchOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalResults / 20);

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
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
};

export default SearchPage;