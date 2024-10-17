import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { isAuthenticated, logOut } from "../services/authenticationService";
import Scene from "./Scene";
import Event from "../components/Event";
import apiService from "../services/apiService";
import { deleteEvent, filterEvents } from "../services/Event"; 
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateEventForm from "../components/calendar/UpdateEventForm"; 

export default function Home() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const observer = useRef();
  const lastEventElementRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      loadEvents();
    }
  }, [navigate]);

  const loadEvents = async (reset = false) => {
    setLoading(true);
    try {
      if (reset) {
        setEvents([]);
        setPage(1);
      }
      const response = await apiService.getMyEvents(page);
      setEvents((prevEvents) => [...prevEvents, ...response.result.data]);
      setTotalPages(response.result.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response?.status === 401) {
        logOut();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await filterEvents(statusFilter, priorityFilter, 1, 10);
      if (response?.data && response.data.length > 0) {
        setEvents(response.data);
        setTotalPages(response.totalPages);
      } else {
        setEvents([]);
        setSnackbarMessage("Không tìm thấy sự kiện.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error searching events:", error);
      setSnackbarMessage("Có lỗi xảy ra trong việc tìm kiếm sự kiện.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        await deleteEvent(eventId);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        setSnackbarMessage("Sự kiện đã được xóa thành công!");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting event:", error);
        setSnackbarMessage("Có lỗi xảy ra khi xóa sự kiện.");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (lastEventElementRef.current) {
      observer.current.observe(lastEventElementRef.current);
    }
  }, [events, totalPages]);

  return (
    <Scene>
      <Card sx={{ width: "100%", maxWidth: 1200, boxShadow: 3, borderRadius: 3, padding: 3, backgroundColor: "#fafafa", margin: "20px auto" }}>
        <Typography sx={{ fontSize: 24, fontWeight: "bold", marginBottom: 2, textAlign: "center", color: "#1976d2" }}>
          Sự kiện của bạn
        </Typography>

        <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "space-between" }}>
          <FormControl fullWidth variant="outlined" sx={{ marginRight: 2 }}>
            <InputLabel id="status-filter-label">Trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Chưa bắt đầu">Chưa bắt đầu</MenuItem>
              <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
              <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="priority-filter-label">Mức độ ưu tiên</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              label="Mức độ ưu tiên"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="HIGH">Cao</MenuItem>
              <MenuItem value="MEDIUM">Trung bình</MenuItem>
              <MenuItem value="LOW">Thấp</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress size="48px" />
          </Box>
        ) : events.length > 0 ? (
          <Grid container spacing={2}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} key={event.id} ref={index === events.length - 1 ? lastEventElementRef : null}>
                <Box sx={{ backgroundColor: "#e3f2fd", borderRadius: 2, padding: 2, boxShadow: 1 }}>
                  <Event event={event} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditingEvent(event)}>
                      Sửa
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(event.id)}>
                      Xóa
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
            Không có sự kiện nào.
          </Typography>
        )}

        {editingEvent && (
          <UpdateEventForm
            show={!!editingEvent}
            handleClose={() => setEditingEvent(null)}
            eventToUpdate={editingEvent}
            onEventUpdated={() => {
              loadEvents(true);
              setSnackbarMessage("Sự kiện đã được cập nhật thành công!");
              setSnackbarOpen(true);
            }}
          />
        )}
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Scene>
  );
}
