import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CircularProgress, Typography, Button } from "@mui/material";
import { getMyInfo } from "../services/userService";
import { isAuthenticated, logOut } from "../services/authenticationService";
import ChangePassword from "../components/ChangePassword"; // Import ChangePassword component
import Scene from "./Scene";

export default function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false); // State to toggle Change Password form

  const getUserDetails = async () => {
    try {
      const response = await getMyInfo();
      const data = response.data;

      setUserDetails(data.result);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      getUserDetails();
    }
  }, [navigate]);

  // Function to handle Change Password toggle
  const handleChangePassword = () => {
    setShowChangePassword(!showChangePassword); // Toggle the visibility of the form
  };

  return (
    <Scene>
      {userDetails ? (
        <Card
          sx={{
            minWidth: 350,
            maxWidth: 500,
            boxShadow: 3,
            borderRadius: 2,
            padding: 3,
            margin: "20px auto",
            backgroundColor: "#fff",
            transition: "0.3s",
            "&:hover": {
              boxShadow: 6,
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              textAlign: "center",
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            Thông tin người dùng
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
            }}
          >
            {[ 
              { label: "Profile ID:", value: userDetails.profileID },
              { label: "Họ:", value: userDetails.firstName },
              { label: "Tên:", value: userDetails.lastName },
              { label: "Ngày sinh:", value: userDetails.dob },
            ].map((field, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: 1,
                  color: "#333",
                }}
              >
                <Typography fontWeight="600" color="#555">{field.label}</Typography>
                <Typography color="#333">{field.value}</Typography>
              </Box>
            ))}

            {/* Add Change Password Button */}
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                borderRadius: 5,
                padding: '10px 20px',
                textTransform: 'none',
              }}
              onClick={handleChangePassword}
            >
              Đổi mật khẩu
            </Button>

            {/* Conditionally render Change Password form */}
            {showChangePassword && <ChangePassword />} {/* Show Change Password form */}
          </Box>
        </Card>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
          <Typography>Loading ...</Typography>
        </Box>
      )}
    </Scene>
  );
}
