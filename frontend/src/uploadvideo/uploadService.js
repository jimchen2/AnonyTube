import axios from "axios";
import { API_BASE_URL, Public_Bucket_URL, FRONTEND_BASE_URL } from "../config";

export const uploadVideo = async (
  formData,
  setUploadProgress,
  setShowCalculatingDurationModal
) => {
  try {
    const videoUploadUrl = await getPresignedUrl("video");
    await uploadFile(videoUploadUrl, formData.videoFile, setUploadProgress);

    const videoUrl = `${Public_Bucket_URL}/${videoUploadUrl.objectKey}`;

    let previewImageUrl = `${FRONTEND_BASE_URL}/previewvideo.webp`;
    if (formData.previewImage) {
      previewImageUrl = await uploadPreviewImage(formData.previewImage);
    }

    setShowCalculatingDurationModal(true); // Show the modal before calculating duration

    const duration = await getVideoDuration(videoUrl);

    const videoData = {
      videourl: [
        {
          quality: "default",
          url: videoUrl,
        },
      ],
      title: formData.title,
      description: formData.description,
      language: formData.language,
      duration: duration,
      previewimageurl: previewImageUrl,
      tags: formData.tags,
    };

    await createVideo(videoData);

    setShowCalculatingDurationModal(false); // Hide the modal after duration calculation
  } catch (error) {
    setShowCalculatingDurationModal(false); // Hide the modal on error
    throw error;
  }
};

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

const createVideo = async (videoData) => {
  const authToken = getToken();

  const response = await axios.post(`${API_BASE_URL}/video/create`, videoData, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

const uploadPreviewImage = async (previewImage) => {
  const previewImageUploadUrl = await getPresignedUrl("image");
  await uploadFile(previewImageUploadUrl, previewImage);
  return `${Public_Bucket_URL}/${previewImageUploadUrl.objectKey}`;
};

const getVideoDuration = async (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      resolve(video.duration);
    };
    video.onerror = () => {
      reject(new Error("Failed to load video."));
    };
  });
};
