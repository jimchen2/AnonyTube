import axios from "axios";
import { API_BASE_URL } from "../config";

import { popularSocialMedia } from "./PopularSocialMedia";

export const handleSubmit = async (
  e,
  newSocialLinks,
  onUpdateSuccess,
  setShowAlert
) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    if (token) {
      const response = await axios.put(
        `${API_BASE_URL}/user/updateSocialLinks`,
        { socialMediaLinks: newSocialLinks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   console.log("Social links updated successfully:", response.data);
      onUpdateSuccess();
      setShowAlert(true);
    } else {
      console.error("Token not found in local storage");
    }
  } catch (error) {
    console.error("Error updating social links:", error);
  }
};

export const handleAddLink = (newSocialLinks, setNewSocialLinks) => {
  const updatedLinks = [...newSocialLinks, { name: "", url: "" }];
  setNewSocialLinks(updatedLinks);
};
export const handleRemoveLink = (index, newSocialLinks, setNewSocialLinks) => {
  const updatedLinks = [...newSocialLinks];
  updatedLinks.splice(index, 1);
  setNewSocialLinks(updatedLinks);
};

export const handleLinkChange = (
  e,
  index,
  field,
  newSocialLinks,
  setNewSocialLinks,
  setSuggestions
) => {
  const updatedLinks = [...newSocialLinks];
  updatedLinks[index][field] = e.target.value;
  setNewSocialLinks(updatedLinks);

  if (field === "name") {
    const filteredSuggestions = popularSocialMedia.filter((platform) =>
      platform.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSuggestions(filteredSuggestions.slice(0, 5));
  }
};

export const handleSuggestionClick = (
  index,
  name,
  newSocialLinks,
  setNewSocialLinks,
  setSuggestions
) => {
  const updatedLinks = [...newSocialLinks];
  updatedLinks[index].name = name;
  setNewSocialLinks(updatedLinks);
  setSuggestions([]);
};
