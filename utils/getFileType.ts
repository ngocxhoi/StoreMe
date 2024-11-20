export default (fileName?: string): string => {
  if (!fileName) return "Other File";

  const fileExtension = fileName.split(".").pop();
  switch (fileExtension) {
    case "txt":
    case "docx":
      return "Text File";
    case "jpg":
    case "jpeg":
    case "png":
      return "Image File";
    case "mp3":
    case "mp4":
      return "Media File";
    default:
      return "Other File";
  }
};
