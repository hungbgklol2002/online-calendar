import React, { useState, useEffect } from "react";
import {
  format, addMonths, subMonths, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, parseISO, addDays, subDays, setYear, getYear, setHours
} from "date-fns";
import { initializeGapiClient, fetchEvents } from "../../services/api";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CreateEventForm from "./CreateEventForm";
import Header from "../Header";
import { useTheme } from "@mui/material";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const initializeAndFetchEvents = async () => {
      try {
        await initializeGapiClient(); // Khởi tạo Google API client
        const fetchedEvents = await fetchEvents(currentDate);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error initializing GAPI and fetching events:', error);
      }
    };

    initializeAndFetchEvents();
  }, [currentDate]);

  const handleCreateEvent = () => setShowEventModal(true);
  const handleCloseModal = () => setShowEventModal(false);

  const renderEvents = (day) => {
    const dayEvents = events.filter((event) =>
      isSameDay(parseISO(event.start.dateTime || event.start.date), day)
    );

    return dayEvents.map((event) => (
      <div
        key={event.id}
        className="event"
        style={{
          height: "20px",
          lineHeight: "20px",
          margin: "2px 0",
          backgroundColor: event.summary.includes("Holiday") ? "green" : "red",
          borderRadius: "4px",
          padding: "2px",
          color: "#fff",
        }}
      >
        {event.summary}{" "}
        <span style={{ fontSize: "12px" }}>
          {event.start.dateTime
            ? format(parseISO(event.start.dateTime), "HH:mm")
            : ""}
        </span>
      </div>
    ));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="body">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, new Date())
                ? "selected"
                : ""
            }`}
            onClick={() => setCurrentDate(day)}
          >
            <span className="number">{format(day, "d")}</span>
            {renderEvents(day)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => {}}>
            <MenuIcon />
          </IconButton>
          <Header />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateEvent}
            sx={{ marginLeft: "30px" }}
          >
            Tạo mới sự kiện
          </Button>
        </Toolbar>
      </AppBar>

      <div style={{ marginTop: theme.mixins.toolbar.minHeight }}>
        <div className="calendar-container">
          <div className="calendar">
            {renderCells()}
          </div>
        </div>
      </div>

      <CreateEventForm
        show={showEventModal}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default Calendar;
