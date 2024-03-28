import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "./videoplayer";
import { API_BASE_URL } from "../config";

function VideoIframe({}) {
  const { uuid } = useParams();

  const [videoUrl, setVideoUrl] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Fetch video URL and subtitles from the same URL
        const response = await axios.get(`${API_BASE_URL}/video/get/${uuid}`);
        const videoData = response.data;

        // Set the fetched video URL
        if (videoData.videourl && videoData.videourl.length > 0) {
          setVideoUrl(videoData.videourl);
        }

        if (videoData.subtitles && Array.isArray(videoData.subtitles)) {
          setSubtitles(videoData.subtitles);
        }

        setIsFetchSuccessful(true); // Set fetch status to successful
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchVideoData();
  }, [uuid]);

  return isFetchSuccessful ? (
    <VideoPlayer videourl={videoUrl} subtitles={subtitles} />
  ) : null;
}

export default VideoIframe;
