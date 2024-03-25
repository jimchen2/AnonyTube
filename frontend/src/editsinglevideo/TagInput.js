import React, { useState } from "react";
import { FormControl, Badge } from "react-bootstrap";
import popularTags from "../static/popularTags";
import { Form } from "react-bootstrap";

function TagInput({ tags, onTagsChange }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = popularTags.filter(
      (tag) =>
        tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
    );
    setSuggestions(filteredSuggestions);
  };

  const handleTagAdd = (tag) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const handleTagDelete = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    onTagsChange(newTags);
  };

  const handleSuggestionClick = (tag) => {
    handleTagAdd(tag);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault(); // Prevent form submission
      handleTagAdd(inputValue.trim());
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Form.Label>Tags (Optional)</Form.Label>

      <FormControl
        type="text"
        placeholder="Enter tags (e.g., music, sport, technology) Press Enter to add"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      {suggestions.length > 0 && (
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            width: "100%",
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            marginTop: "2px",
            boxSizing: "border-box",
          }}
        >
          {suggestions.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
              onClick={() => handleSuggestionClick(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
      <div>
        {tags.map((tag) => (
          <Badge key={tag} variant="primary" className="mr-2">
            {tag}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleTagDelete(tag)}
            >
              &times;
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default TagInput;
