export default (sizeInBytes?: number): string => {
  if (!sizeInBytes) return "0 MB";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const size = sizeInBytes / Math.pow(1024, index);
  return `${size.toFixed(2)} ${units[index]}`;
};
