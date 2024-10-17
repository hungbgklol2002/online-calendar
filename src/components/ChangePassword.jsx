import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { changePassword } from "../services/authenticationService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { removeToken } from "../services/localStorageService"; // Import hàm removeToken

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", { oldPassword, newPassword }); // Kiểm tra giá trị
  
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
  
    try {
      await changePassword({
        oldPassword,
        newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      removeToken(); 
      navigate("/login"); 
    
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      setError("Đã xảy ra lỗi khi đổi mật khẩu.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" align="center" mb={2}>
        Đổi Mật Khẩu
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Mật khẩu cũ"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Đổi Mật Khẩu
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
