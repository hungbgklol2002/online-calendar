import React, { useState, useEffect } from "react";
import { Modal, Form, Button, ListGroup, Badge } from "react-bootstrap";
import { createEvent } from "../../services/Event";
import { getProfileIDs } from "../../services/profile"; // Sử dụng hàm getProfileIDs
import "./CreateEventForm.css";

const CreateEventForm = ({ show, handleClose, onEventCreated }) => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    participants: [],
    priority: "LOW",
  });

  const [currentTime, setCurrentTime] = useState("");
  const [profileIDs, setProfileIDs] = useState([]); // Danh sách profileIDs
  const [showProfileList, setShowProfileList] = useState(false); // Trạng thái hiển thị danh sách profile

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setCurrentTime(formattedTime);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    const fetchProfileIDs = async () => {
      try {
        const ids = await getProfileIDs(); // Gọi API để lấy danh sách profileID
        setProfileIDs(ids);
      } catch (error) {
        console.error("Failed to fetch profile IDs:", error);
      }
    };

    fetchProfileIDs();

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventToSubmit = {
        ...newEvent,
        startTime: newEvent.startTime || currentTime,
        endTime: newEvent.endTime || currentTime,
      };
      await createEvent(eventToSubmit);
      handleClose();
      onEventCreated(); // Gọi hàm thông báo rằng sự kiện đã được tạo
      setNewEvent({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        participants: [],
        priority: "LOW",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleUseCurrentTime = (field) => {
    setNewEvent((prev) => ({
      ...prev,
      [field]: currentTime,
    }));
  };

  const handleSelectProfileID = (profileID) => {
    if (!newEvent.participants.includes(profileID)) {
      setNewEvent((prev) => ({
        ...prev,
        participants: [...prev.participants, profileID], // Thêm profileID vào danh sách người tham gia
      }));
    }
    setShowProfileList(false); // Đóng danh sách sau khi chọn
  };

  const handleParticipantRemove = (profileID) => {
    setNewEvent((prev) => ({
      ...prev,
      participants: prev.participants.filter((id) => id !== profileID), // Xóa profileID khỏi danh sách
    }));
  };

  const toggleProfileList = () => {
    setShowProfileList((prev) => !prev); // Đảo ngược trạng thái hiển thị danh sách
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="create-event-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Tạo mới sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
                placeholder="Nhập tiêu đề sự kiện"
                className="border-primary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả sự kiện"
                className="border-primary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Thời gian bắt đầu</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                  required
                  className="border-primary"
                />
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleUseCurrentTime("startTime")}
                >
                  Sử dụng thời gian hiện tại
                </Button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Thời gian kết thúc</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  required
                  className="border-primary"
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa điểm</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                placeholder="Nhập địa điểm"
                className="border-primary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Người tham gia</Form.Label>
              <div>
                <Form.Control
                  type="text"
                  value={newEvent.participants.join(", ")} // Hiển thị danh sách người tham gia
                  onClick={toggleProfileList} // Mở danh sách khi nhấp vào
                  placeholder="Chọn người tham gia"
                  readOnly
                  className="border-primary participants-input" // Thêm class để áp dụng CSS
                />
                <div className="mt-2 d-flex flex-wrap">
                  {newEvent.participants.map((participant) => (
                    <Badge
                      key={participant}
                      pill
                      bg="info"
                      className="me-2 mb-2 text-white shadow-sm"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleParticipantRemove(participant)} // Xóa người tham gia khi nhấp vào
                    >
                      {participant} ✕
                    </Badge>
                  ))}
                </div>
                {showProfileList && (
                  <div className="profile-list">
                    <ListGroup className="mt-2">
                      {profileIDs.map((profileID) => (
                        <ListGroup.Item
                          key={profileID}
                          action
                          onClick={() => handleSelectProfileID(profileID)} // Chọn profileID khi nhấp vào
                          className="list-group-item-action"
                        >
                          {profileID}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ưu tiên</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newEvent.priority}
                onChange={handleInputChange}
                className="border-primary"
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Tạo sự kiện
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateEventForm;
