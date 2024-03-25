// src/PopularTagsMenu.js
import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import popularTags from "../static/popularTags";
import SearchPage from "./SearchPage";

const PopularTagsMenu = () => {
  const [activeTag, setActiveTag] = useState(null);
  const [subTags, setSubTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTag, setActiveSubTag] = useState(null);

  const handleMainTagClick = (tag) => {
    setActiveTag(tag);
    setSearchQuery(tag);
    const subTags = popularTags.filter((t) => t.startsWith(tag + "/"));
    setSubTags(subTags);
    setActiveSubTag(null); // Reset active sub-tag when main tag is clicked
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setActiveSubTag(tag); // Set the active sub-tag
  };

  const mainTags = popularTags.filter((tag) => !tag.includes("/"));

  return (
    <div>
      <div style={{ marginTop: "10px" }}></div>

      <Nav variant="pills" as="ul">
        {mainTags.map((tag) => (
          <Nav.Item key={tag} as="li">
            <Nav.Link
              eventKey={tag}
              onClick={() => handleMainTagClick(tag)}
              active={activeTag === tag}
            >
              {tag}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <div style={{ marginTop: "10px" }}></div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {subTags.map((subTag) => (
          <span
            key={subTag}
            style={{
              marginRight: "10px",
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: activeSubTag === subTag ? "#007bff" : "#f0f0f0", // Change color based on active sub-tag
              color: activeSubTag === subTag ? "#fff" : "#000", // Change text color based on active sub-tag
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleTagClick(subTag)}
          >
            {subTag.split("/").pop()}
          </span>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}></div>

      <SearchPage query={searchQuery} />
    </div>
  );
};

export default PopularTagsMenu;
