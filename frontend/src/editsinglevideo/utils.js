// ./utils.js
import axios from "axios";
import { API_BASE_URL, Public_Bucket_URL, FRONTEND_BASE_URL } from "../config";

const getPresignedUrl = async (type) => {
  const authToken = getToken();

  const response = await axios.post(
    `${API_BASE_URL}/generatePresignedUrl`,
    {
      type,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};

const uploadFile = async (uploadUrl, file, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl.url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && setUploadProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(progress);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error("File upload failed."));
      }
    };
    xhr.onerror = () => {
      reject(new Error("File upload failed."));
    };
    xhr.send(file);
  });
};

function getToken() {
  return localStorage.getItem("token");
}

export const uploadPreviewImage = async (previewImage) => {
  const previewImageUploadUrl = await getPresignedUrl("image");
  await uploadFile(previewImageUploadUrl, previewImage);
  console.log(`${Public_Bucket_URL}/${previewImageUploadUrl.objectKey}`);
  return `${Public_Bucket_URL}/${previewImageUploadUrl.objectKey}`;
};

export async function fetchVideo(videoUuid, token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/video/get/${videoUuid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateVideo(videoUuid, updatedVideoData, token) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/video/update/${videoUuid}`,
      updatedVideoData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
