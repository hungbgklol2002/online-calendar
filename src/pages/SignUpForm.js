import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignUp } from "../services/SignUp";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setSnackBarMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
      setSnackBarOpen(true);
      return;
    }

    try {
      const response = await SignUp(
        username,
        password,
        firstname,
        lastname,
        dob,
        address,
        email
      );

      if (response.status === 200) {
        setSnackBarMessage("Đăng ký thành công");
        navigate("/login");
      }
    } catch (error) {
      const errorResponse = error.response?.data?.message || "Đã xảy ra lỗi";
      setSnackBarMessage(errorResponse);
      setSnackBarOpen(true);
    }
  };

  return (
    <>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackBar} severity="error" variant="filled">
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{
          backgroundImage: "url('link_to_your_image.jpg')", // Hoặc gradient
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 450,
            boxShadow: 3,
            borderRadius: 3,
            padding: 4,
            backgroundColor: "#fff",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 0 }}>
              TẠO TÀI KHOẢN
            </Typography>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Tên người dùng"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Nhập lại mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Họ"
                variant="outlined"
                fullWidth
                margin="normal"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Tên"
                variant="outlined"
                fullWidth
                margin="normal"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Ngày sinh"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                margin="normal"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 0 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 0 }}
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      bgcolor: "#1976d2",
                      '&:hover': {
                        bgcolor: "#115293",
                      },
                      mb: 1,
                    }}
                  >
                    TẠO TÀI KHOẢN
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      '&:hover': {
                        borderColor: "#115293",
                        color: "#115293",
                      },
                    }}
                  >
                    TRỞ VỀ TRANG ĐĂNG NHẬP
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
