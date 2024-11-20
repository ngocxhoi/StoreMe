export default (dateString: string): string => {
  const date = new Date(dateString);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Chuyển sang định dạng 12 giờ với AM/PM
    day: "2-digit",
    month: "short", // Hiển thị tháng dạng viết tắt (e.g., Nov)
  };

  // Lấy các phần cần thiết từ Date
  const time = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  return `${time}, ${formattedDate}`;
};
