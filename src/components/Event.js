import React, { useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";

// Hàm để xác định màu sắc dựa trên priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'LOW':
      return '#81c784'; // Màu xanh dịu
    case 'MEDIUM':
      return '#ffeb3b'; // Màu vàng
    case 'HIGH':
      return '#f44336'; // Màu đỏ
    default:
      return '#000'; // Mặc định là màu đen
  }
};

// Component để hiển thị mô tả sự kiện
const EventDescription = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Hàm để chuyển đổi trạng thái mở rộng/thu gọn
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box>
      {/* Mô tả */}
      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        sx={{
          maxHeight: isExpanded ? "none" : "60px", // Giới hạn chiều cao khi không mở rộng
          overflow: "hidden", // Ẩn phần nội dung vượt quá khi không mở rộng
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "none" : 3, // Giới hạn 3 dòng khi không mở rộng
          WebkitBoxOrient: "vertical",
          transition: "max-height 0.3s ease-in-out", // Hiệu ứng mượt khi thay đổi chiều cao
        }}
      >
        {event.description}
      </Typography>

      {/* Nút để mở rộng/thu gọn mô tả */}
      <Button
        onClick={toggleDescription}
        variant="text"
        sx={{ textTransform: "none", paddingLeft: 0 }}
      >
        {isExpanded ? "Ẩn bớt" : "Xem thêm"}
      </Button>
    </Box>
  );
};

const Event = React.forwardRef(({ event }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        background: "linear-gradient(135deg, #bbdefb, #d1e8e2)", // Gradient background dịu
        marginBottom: 2,
        width: '400px', // Chiều rộng cố định
        height: 'auto', // Để chiều cao tự động thay đổi theo nội dung
        transition: "transform 0.2s, box-shadow 0.2s, background-color 0.3s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
          background: "linear-gradient(135deg, #d1e8e2, #bbdefb)", // Đổi màu nền khi hover
        },
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: "#1976d2" }}>
        {event.title}
      </Typography>

      {/* Hiển thị mô tả sự kiện */}
      <EventDescription event={event} />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="#424242">
          <strong>Địa điểm:</strong> {event.location}
        </Typography>

        {/* Box bọc Priority */}
        <Box
          sx={{
            backgroundColor: getPriorityColor(event.priority), // Màu nền tùy theo priority
            borderRadius: 5,
            padding: "4px 8px",
            minWidth: "80px", // Đảm bảo box có chiều rộng tối thiểu
            textAlign: "center", // Căn giữa nội dung
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
            {event.priority}
          </Typography>
        </Box>
      </Box>

      {/* Tách Start Time và End Time thành hai dòng riêng biệt */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="#424242">
          <strong>Thời gian bắt đầu:</strong>{" "}
          <span style={{ fontWeight: "bold", color: "#1976d2" }}>
            {new Date(event.startTime).toLocaleString("vi-VN", {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </span>
        </Typography>
      </Box>
    
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="#424242">
          <strong>Thời gian kết thúc:</strong>{" "}
          <span style={{ fontWeight: "bold", color: "#1976d2" }}>
            {new Date(event.endTime).toLocaleString("vi-VN", {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </span>
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Người tham gia:</strong>
      </Typography>
      <Box
        sx={{
          display: "flex", // Sử dụng flexbox
          flexWrap: "wrap", // Cho phép xuống dòng
          gap: 1, // Khoảng cách giữa các participant
          ml: 2, // Lề trái
          mb: 2,
        }}
      >
        {event.participants.map((participant, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "#e0f7fa", // Màu nền nhẹ nhàng
              padding: "6px 12px", // Padding
              borderRadius: "20px", // Bo tròn khung
              marginBottom: "4px",
              display: 'flex', // Hiển thị dưới dạng flex
              alignItems: 'center', // Căn giữa nội dung theo chiều dọc
              boxShadow: 1, // Đổ bóng nhẹ cho box
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic"}}>
              Tên: {participant.name} - 
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              ID: {participant.profileId}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="#424242">
        <strong>Trạng thái:</strong>{" "}
        <span style={{ fontWeight: "bold", color: "#1976d2" }}>{event.status}</span>
      </Typography>
    </Box>
  );
});

export default Event;
