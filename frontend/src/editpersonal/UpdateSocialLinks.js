import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Dropdown, FormControl } from "react-bootstrap";

import {
  handleSubmit,
  handleAddLink,
  handleRemoveLink,
  handleLinkChange,
  handleSuggestionClick,
} from "./updateSocialLinksHandlers";

function UpdateSocialLinks({ socialMediaLinks, onUpdateSuccess }) {
  const [newSocialLinks, setNewSocialLinks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setNewSocialLinks(socialMediaLinks);
  }, [socialMediaLinks]);

  return (
    <div>
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          Social links updated successfully!
        </Alert>
      )}
      <Form
        onSubmit={(e) =>
          handleSubmit(e, newSocialLinks, onUpdateSuccess, setShowAlert)
        }
      >
        <Form.Label>Social Links</Form.Label>
        <br />
        {newSocialLinks.map((link, index) => (
          <div key={index}>
            <Form.Group controlId={`formSocialLinkName-${index}`}>
              <Form.Label>platform</Form.Label>
              <Dropdown show={suggestions.length > 0}>
                <FormControl
                  type="text"
                  value={link.name}
                  onChange={(e) =>
                    handleLinkChange(
                      e,
                      index,
                      "name",
                      newSocialLinks,
                      setNewSocialLinks,
                      setSuggestions
                    )
                  }
                />
                <Dropdown.Menu>
                  {suggestions.map((platform) => (
                    <Dropdown.Item
                      key={platform}
                      onClick={() =>
                        handleSuggestionClick(
                          index,
                          platform,
                          newSocialLinks,
                          setNewSocialLinks,
                          setSuggestions
                        )
                      }
                    >
                      {platform}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group controlId={`formSocialLinkUrl-${index}`}>
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                value={link.url}
                onChange={(e) =>
                  handleLinkChange(
                    e,
                    index,
                    "url",
                    newSocialLinks,
                    setNewSocialLinks
                  )
                }
              />
            </Form.Group>
            <Button
              variant="danger"
              type="button"
              onClick={() =>
                handleRemoveLink(index, newSocialLinks, setNewSocialLinks)
              }
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="primary"
          type="button"
          onClick={() => handleAddLink(newSocialLinks, setNewSocialLinks)}
        >
          Add Link
        </Button>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default UpdateSocialLinks;
