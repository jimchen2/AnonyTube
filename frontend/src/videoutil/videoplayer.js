import React, { useState, useRef, useEffect, useContext } from "react";
import "video-react/dist/video-react.css";
import { useFetchSubtitles } from "./VideoHelper";
import "./VideoPlayer.css";
import VideoContainer from "./VideoContainer";
import VideoControls from "./VideoControls";
import { FRONTEND_BASE_URL } from "../config";
import { BooleanContext } from "../global/global"; // Import the context

const VideoPlayer = ({ videourl = [], subtitles = [] }) => {
  const [selectedQuality, setSelectedQuality] = useState("default");
  const [selectedSubtitles, setSelectedSubtitles] = useState([]);
  const [bgColor, setBgColor] = useState("white"); // Initial background color
  const { boolValue } = useContext(BooleanContext); // Access boolValue from context

  useEffect(() => {
    // Set initial background color based on boolValue
    setBgColor(boolValue === 0 ? "white" : "#242525");

    if (Array.isArray(subtitles) && subtitles.length > 0) {
      setSelectedSubtitles([subtitles[0]["language"]]);
    }

    // Check if 720p video is available and update selectedQuality
    const foundVideo =
      videourl.find((video) => video.quality === "720p") ||
      videourl.find((video) => video.quality === selectedQuality);

    if (foundVideo && foundVideo.quality === "720p") {
      setSelectedQuality("720p");
    } else {
      setSelectedQuality("default");
    }
  }, [subtitles, boolValue, videourl]); // Add videourl to the dependency array

  const [subtitleTexts, setSubtitleTexts] = useState([]);
  const initialFontSize = window.innerWidth > 700 ? 30 : 18;
  const [fontSize, setFontSize] = useState(initialFontSize);
  const playerRef = useRef(null);

  const selectedVideo = videourl.find(
    (video) => video.quality === selectedQuality
  );

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
  };

  const handleSubtitleSelect = (language) => {
    setSelectedSubtitles((prevSubtitles) => {
      if (prevSubtitles.includes(language)) {
        return prevSubtitles.filter((subtitle) => subtitle !== language);
      } else {
        return [...prevSubtitles, language];
      }
    });
  };

  useFetchSubtitles(selectedSubtitles, subtitles, setSubtitleTexts);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === FRONTEND_BASE_URL) {
        const receivedValue = event.data;
        console.log("Received value from parent:", receivedValue);

        // Toggle background color
        setBgColor((prevBgColor) =>
          prevBgColor === "white" ? "#242525" : "white"
        );
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div style={{ background: bgColor }}>
      <VideoContainer
        selectedVideo={selectedVideo}
        playerRef={playerRef}
        subtitleTexts={subtitleTexts}
        setSubtitleTexts={setSubtitleTexts}
        selectedSubtitles={selectedSubtitles}
        fontSize={fontSize} // Pass the fontSize prop
      />

      <VideoControls
        videourl={videourl}
        subtitles={subtitles}
        selectedQuality={selectedQuality}
        selectedSubtitles={selectedSubtitles}
        fontSize={fontSize}
        handleQualityChange={handleQualityChange}
        handleSubtitleSelect={handleSubtitleSelect}
        handleFontSizeChange={handleFontSizeChange}
      />
    </div>
  );
};

export default VideoPlayer;
