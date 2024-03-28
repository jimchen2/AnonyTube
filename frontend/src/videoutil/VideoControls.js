import React from "react";
import { Dropdown, ButtonGroup, Button, Form } from "react-bootstrap";

const VideoControls = ({
  videourl,
  subtitles,
  selectedQuality,
  selectedSubtitles,
  fontSize,
  handleQualityChange,
  handleSubtitleSelect,
  handleFontSizeChange,
}) => {
  return (
    <ButtonGroup>
      <Dropdown as={ButtonGroup} align="end">
        <Button variant="secondary">{selectedQuality}</Button>
        <Dropdown.Toggle split variant="secondary" id="quality-dropdown" />
        <Dropdown.Menu>
          {videourl.map((video) => (
            <Dropdown.Item
              key={video.quality}
              onClick={() => handleQualityChange(video.quality)}
              active={selectedQuality === video.quality}
            >
              {video.quality}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown as={ButtonGroup} align="end">
        <Button variant="info">
          {selectedSubtitles.length === 0
            ? "No Subtitles"
            : selectedSubtitles.join(", ")}
        </Button>
        <Dropdown.Toggle split variant="info" id="subtitle-dropdown" />
        <Dropdown.Menu>
          <Form className="subtitle-checkboxes">
            {subtitles.map((subtitle) => (
              <Form.Check
                key={subtitle.language}
                type="checkbox"
                label={subtitle.language}
                checked={selectedSubtitles.includes(subtitle.language)}
                onChange={() => handleSubtitleSelect(subtitle.language)}
                className="subtitle-checkbox"
              />
            ))}
          </Form>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown as={ButtonGroup} align="end">
        <Button variant="success">{fontSize}px</Button>
        <Dropdown.Toggle split variant="success" id="font-size-dropdown" />
        <Dropdown.Menu>
          {[15, 20, 25, 30, 35].map((size) => (
            <Dropdown.Item
              key={size}
              onClick={() => handleFontSizeChange(size)}
              active={fontSize === size}
            >
              {size}px
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default VideoControls;