export default (fileName?: string): string => {
  if (!fileName) return "i-heroicons-chart-pie-solid";

  const fileExtension = fileName.split(".").pop();
  switch (fileExtension) {
    case "txt":
    case "docx":
      return "i-heroicons-document-text-solid";
    case "jpg":
    case "jpeg":
    case "png":
      return "i-heroicons-photo-solid";
    case "mp3":
    case "mp4":
      return "i-heroicons-video-camera-solid";
    default:
      return "i-heroicons-chart-pie-solid";
  }
};
