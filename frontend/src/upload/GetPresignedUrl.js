import Cookies from "js-cookie";


export const getPresignedUrl = async (fileName) => {
  const token = Cookies.get("token");

  const presignedUrlResponse = await fetch(
    `http://localhost:8080/api/storage/presigned_url?file_name=${fileName}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!presignedUrlResponse.ok) {
    throw new Error("Failed to obtain presigned URL for video upload.");
  }

  const { presigned_url } = await presignedUrlResponse.json();
  return presigned_url;
};
