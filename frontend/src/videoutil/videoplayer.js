import React, { useState, useRef } from "react";
import { Player, ControlBar, LoadingSpinner, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { Dropdown, ButtonGroup, Button, Form } from "react-bootstrap";
import { useFetchSubtitles, handleTimeUpdate } from "./VideoHelper";
import "./VideoPlayer.css";
import { useEffect } from "react";

const VideoPlayer = ({ videourl = [], subtitles = [] }) => {
  const [selectedQuality, setSelectedQuality] = useState("default");
  const [selectedSubtitles, setSelectedSubtitles] = useState([]);
  useEffect(() => {
    if (Array.isArray(subtitles) && subtitles.length > 0) {
      console.log(subtitles[0]);
      setSelectedSubtitles([subtitles[0]["language"]]);
    }
  }, [subtitles]);

  const [subtitleTexts, setSubtitleTexts] = useState([]);
  const [fontSize, setFontSize] = useState(30);
  const playerRef = useRef(null);

  const selectedVideo = videourl.find(
    (video) => video.quality === selectedQuality
  );

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
  };

  const handleSubtitleSelect = (language) => {
    setSelectedSubtitles((prevSubtitles) => {
      console.log(prevSubtitles);
      if (prevSubtitles.includes(language)) {
        return prevSubtitles.filter((subtitle) => subtitle !== language);
      } else {
        return [...prevSubtitles, language];
      }
    });
  };

  useFetchSubtitles(selectedSubtitles, subtitles, setSubtitleTexts);

  const SubtitleComponent = () => {
    const subtitleLines = selectedSubtitles.map((language) => {
      const subtitleText = subtitleTexts
        .filter((subtitle) => subtitle.language === language)
        .map((subtitle) => subtitle.text)
        .join("\n");
      return (
        <p
          key={language}
          className="subtitle-text"
          style={{ fontSize: `${fontSize}px` }}
        >
          {subtitleText}
        </p>
      );
    });

    return (
      <div
        className={`subtitle-overlay ${
          subtitleLines.length === 0 ? "hidden" : ""
        }`}
      >
        <div className="subtitle-background">{subtitleLines}</div>
      </div>
    );
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: 0,
          paddingBottom: "56.25%",
          position: "relative",
        }}
      >
        <Player
          ref={playerRef}
          onTimeUpdate={() =>
            handleTimeUpdate(playerRef, subtitleTexts, setSubtitleTexts)
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          key={selectedVideo.url} // Add this line
        >
          <source src={selectedVideo.url} />
          <LoadingSpinner />
          <BigPlayButton position="center" />

          <ControlBar />

          <SubtitleComponent />
        </Player>{" "}
      </div>
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
    </div>
  );
};

export default VideoPlayer;
