import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchUserProfile = async (username, setUser) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/getUserbyUsername/${username}`
    );
    console.log(response.data);
    setUser(response.data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

export const fetchFollowers = async (followers, setFollowers) => {
  try {
    const followerPromises = followers.map(async (followerUuid) => {
      const response = await axios.get(
        `${API_BASE_URL}/user/get/${followerUuid}`
      );
      return response.data;
    });
    const followerUsers = await Promise.all(followerPromises);
    setFollowers(followerUsers);
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

export const fetchFollowing = async (following, setFollowing) => {
  try {
    const followingPromises = following.map(async (followingUuid) => {
      const response = await axios.get(
        `${API_BASE_URL}/user/get/${followingUuid}`
      );
      return response.data;
    });
    const followingUsers = await Promise.all(followingPromises);
    setFollowing(followingUsers);
  } catch (error) {
    console.error("Error fetching following:", error);
  }
};

export const fetchUserVideos = async (uploaderuuid, setUserVideos) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/video/search?uploaderuuid=${uploaderuuid}`
    );
    setUserVideos(response.data.videos);
  } catch (error) {
    console.error("Error fetching user videos:", error);
  }
};
