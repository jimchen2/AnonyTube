// fetchData.js
import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchVideoData = async (videoUuid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/video/get/${videoUuid}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error fetching video data:", error);
    return { data: null, error: "Failed to fetch video data" };
  }
};

export const fetchUploaderData = async (uploaderUuid) => {
  try { 
    const response = await axios.get(
      `${API_BASE_URL}/user/get/${uploaderUuid}`
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error fetching uploader data:", error);
    return { data: null, error: "Failed to fetch uploader data" };
  }
};

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const likeVideo = async (videoUuid) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/video/like/${videoUuid}`,
      null,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const unlikeVideo = async (videoUuid) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/video/unlike/${videoUuid}`,
      null,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const isUserLiked = async (videoUuid) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(
      `${API_BASE_URL}/video/isLiked/${videoUuid}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const addVideoView = async (videoUuid) => {
  try {
    const authToken = getAuthToken();
    // console.log("dphaifdh");
    // console.log(videoUuid);
    // console.log(authToken);
    const response = await axios.post(
      `${API_BASE_URL}/video/addview/${videoUuid}`,
      null,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
