import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logIn, isAuthenticated } from "../services/authenticationService";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate(); // Điều hướng người dùng

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const handleGoogleLogin = () => {
    const googleLoginUrl =
      "http://localhost:8080/oauth2/authorization/google";
    window.location.href = googleLoginUrl; 
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/calendar");
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, [navigate]);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/google",
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const { accessToken } = response.data;
      console.log("Access Token:", accessToken);
  
      // Lưu token vào localStorage
      localStorage.setItem("accessToken", accessToken);
  
      // Điều hướng về trang chủ sau khi đăng nhập thành công
      navigate("/home");
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      setSnackBarMessage("Đăng nhập bằng Google thất bại");
      setSnackBarOpen(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await logIn(username, password);
      console.log("Response body:", response.data);

      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/calendar");
    } catch (error) {
      const errorResponse = error.response?.data;
      setSnackBarMessage(errorResponse?.message || "Đăng nhập thất bại");
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
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor={"#f0f2f5"}
      >
        <Card
          sx={{
            minWidth: 300,
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 5,
            padding: 4,
            bgcolor: "#ffffff",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              Chào mừng đến với lịch trực tuyến
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
                label="Tên đăng nhập"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  mt: "15px",
                  mb: "25px",
                  borderRadius: 5,
                  "&:hover": { backgroundColor: "#3f51b5" },
                }}
              >
                Đăng nhập
              </Button>

              <Divider />

              <Box display="flex" flexDirection="column" width="100%" gap="15px">
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleGoogleLogin}
                  fullWidth
                  sx={{
                    gap: "10px",
                    borderRadius: 5,
                    "&:hover": { backgroundColor: "#f50057" },
                  }}
                >
                  <GoogleIcon />
                  Tiếp tục với Google
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  color="success"
                  size="large"
                  onClick={handleCreateAccount}
                  sx={{
                    borderRadius: 5,
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#4caf50",
                      color: "#ffffff",
                    },
                  }}
                >
                  Tạo tài khoản
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
