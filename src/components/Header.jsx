import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logOut } from "../services/authenticationService";
import { Client } from "@stomp/stompjs";

// Styled components using MUI
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);

  // Setup WebSocket client
  const client = React.useMemo(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8082/ws-notifications", // Sửa URL để khớp với endpoint WebSocket của bạn
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe("/topic/notifications", (message) => {
          const notification = JSON.parse(message.body);
          setNotifications((prev) => [...prev, notification]);
          setNotificationCount((prev) => prev + 1);
        });
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });
    return stompClient;
  }, []);

  // Activate WebSocket on mount, deactivate on unmount
  React.useEffect(() => {
    client.activate();
    return () => client.deactivate();
  }, [client]);

  // Menu handlers
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);
  const handleLogout = () => {
    handleMenuClose();
    logOut();
    window.location.href = "/login";
  };

  const handleNotificationClick = () => {
    setNotifications([]);
    setNotificationCount(0);
  };
 
  // Render the main menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <CustomMenuItem onClick={() => window.location.href = "/profile"}>
        <AccountCircle sx={{ marginRight: 1 }} />
        Thông tin cá nhân
      </CustomMenuItem>
      <CustomMenuItem>
        <SettingsIcon sx={{ marginRight: 1 }} />
        Cài đặt
      </CustomMenuItem>
      <CustomMenuItem onClick={handleLogout}>
        <ExitToAppIcon sx={{ marginRight: 1 }} />
        Đăng xuất
      </CustomMenuItem>
    </Menu>
  );

  // Render mobile menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu-mobile"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={2} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Tin nhắn</p>
      </MenuItem>
      <MenuItem onClick={handleNotificationClick}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Thông báo</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Cá nhân</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => window.location.href = "/calendar"}>
        <Box
          component="img"
          sx={{
            width: "35px",
            height: "35px",
            borderRadius: 6,
          }}
          src="/logo/abc.jpg"
          alt="Logo"
        />
      </IconButton>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={2} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton size="large" color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton size="large" color="inherit" onClick={handleProfileMenuOpen}>
          <AccountCircle />
        </IconButton>
      </Box>
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton size="large" color="inherit" onClick={handleMobileMenuOpen}>
          <MoreIcon />
        </IconButton>
      </Box>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
