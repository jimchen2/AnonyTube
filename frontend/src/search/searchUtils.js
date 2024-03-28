import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchSearchResults = async (searchOptions, navigate) => {
  try {
    const params = new URLSearchParams();

    if (searchOptions.query) {
      params.append("query", searchOptions.query);
    }

    if (searchOptions.duration) {
      switch (searchOptions.duration) {
        case "short":
          params.append("durationMax", "240");
          break;
        case "medium":
          params.append("durationMin", "240");
          params.append("durationMax", "1200");
          break;
        case "long":
          params.append("durationMin", "1200");
          break;
        default:
          break;
      }
    }

    if (searchOptions.sortBy) {
      switch (searchOptions.sortBy) {
        case "views":
          params.append("sort", "views");
          break;
        case "likes":
          params.append("sort", "likes");
          break;
        case "date":
          params.append("sort", "uploaddate");
          break;
        default:
          break;
      }
    }

    if (searchOptions.uploadedTime) {
      const currentDate = new Date();
      switch (searchOptions.uploadedTime) {
        case "24 hours ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        case "one week ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 7 * 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        case "one month ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 30 * 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        case "one year ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 365 * 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        default:
          break;
      }
      params.append("uploadedBefore", currentDate.toISOString());
    }

    if (searchOptions.language) {
      params.append("language", searchOptions.language);
    }

    params.append("limit", 20);
    params.append("start", searchOptions.start || 0);

    const response = await axios.get(
      `${API_BASE_URL}/video/search?${params.toString()}`
    );
    console.log(`${API_BASE_URL}/video/search?${params.toString()}`);
    const videos = response.data.videos;

    return videos;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

export const fetchTotalSearchResultsCount = async (searchOptions) => {
  try {
    const params = new URLSearchParams();

    if (searchOptions.query) {
      params.append("query", searchOptions.query);
    }

    if (searchOptions.duration) {
      switch (searchOptions.duration) {
        case "short":
          params.append("durationMax", "240");
          break;
        case "medium":
          params.append("durationMin", "240");
          params.append("durationMax", "1200");
          break;
        case "long":
          params.append("durationMin", "1200");
          break;
        default:
          break;
      }
    }

    if (searchOptions.uploadedTime) {
      const currentDate = new Date();
      switch (searchOptions.uploadedTime) {
        case "24 hours ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        case "one week ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 7 * 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        case "one month ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 30 * 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        case "one year ago-now":
          params.append(
            "uploadedAfter",
            new Date(currentDate - 365 * 24 * 60 * 60 * 1000).toISOString()
          );
          break;
        default:
          break;
      }
      params.append("uploadedBefore", currentDate.toISOString());
    }

    if (searchOptions.language) {
      params.append("language", searchOptions.language);
    }

    const response = await axios.get(
      `${API_BASE_URL}/video/search/count?${params.toString()}`
    );
    const totalResults = response.data.totalResults;

    return totalResults;
  } catch (error) {
    console.error("Error fetching total search results count:", error);
    throw error;
  }
};
