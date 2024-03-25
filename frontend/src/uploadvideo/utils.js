export const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  
  export const getTimeRemaining = (uploadSpeed, videoSize, uploadProgress) => {
    if (uploadSpeed === 0) return "-- s";
    const remainingBytes = videoSize - (uploadProgress / 100) * videoSize;
    const remainingSeconds = Math.ceil(remainingBytes / uploadSpeed);
    return remainingSeconds + " s";
  };