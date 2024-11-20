export default (fileName?: string): string => {
  if (!fileName) return "Other File";

  const fileExtension = fileName.split(".").pop();
  switch (fileExtension) {
    case "txt":
    case "docx":
      return "document";
    case "jpg":
    case "jpeg":
    case "png":
      return "image";
    case "mp3":
    case "mp4":
      return "media";
    default:
      return "other";
  }
};
