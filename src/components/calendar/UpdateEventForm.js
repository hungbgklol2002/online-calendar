import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Alert, Spinner, ListGroup, Badge, InputGroup } from "react-bootstrap";
import { updateEvent, getEventById } from "../../services/Event";
import { getProfileIDs } from "../../services/profile";
import "./UpdateEventForm.css"; // Thêm CSS tuỳ chỉnh

const UpdateEventForm = ({ show, handleClose, eventToUpdate, onEventUpdated }) => {
  const [updatedEvent, setUpdatedEvent] = useState({
    id: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    participants: [],
    priority: "LOW",
  });

  const [profileIDs, setProfileIDs] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showProfileList, setShowProfileList] = useState(false);

  const participantsInputRef = useRef();

  useEffect(() => {
    const fetchProfileIDs = async () => {
      setLoadingProfiles(true);
      try {
        const profiles = await getProfileIDs();
        setProfileIDs(profiles);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách profileID:", error);
        setErrorMessage("Không thể tải danh sách người tham gia.");
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchProfileIDs();
  }, []);

  useEffect(() => {
    if (eventToUpdate) {
      setUpdatedEvent({
        ...eventToUpdate,
        participants: [],
      });
    }
  }, [eventToUpdate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleParticipantSelect = (profileID) => {
    if (!updatedEvent.participants.includes(profileID)) {
      setUpdatedEvent((prev) => ({
        ...prev,
        participants: [...prev.participants, profileID],
      }));
    }
    setShowProfileList(false);
  };

  const handleParticipantRemove = (profileID) => {
    setUpdatedEvent((prev) => ({
      ...prev,
      participants: prev.participants.filter((id) => id !== profileID),
    }));
  };

  const handleFocusParticipantsInput = () => {
    setShowProfileList(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(updatedEvent.id, updatedEvent);
      handleClose();

      const refreshedEvent = await getEventById(updatedEvent.id);
      onEventUpdated(refreshedEvent);

      setUpdatedEvent({
        id: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        participants: [],
        priority: "LOW",
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="update-event-modal">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">Cập nhật sự kiện</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={updatedEvent.title}
              onChange={handleInputChange}
              required
              placeholder="Nhập tiêu đề sự kiện"
              className="border-primary shadow-sm"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={updatedEvent.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả sự kiện"
              className="border-primary shadow-sm"
              rows={3}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Thời gian bắt đầu</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startTime"
              value={updatedEvent.startTime}
              onChange={handleInputChange}
              required
              className="border-primary shadow-sm"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Thời gian kết thúc</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endTime"
              value={updatedEvent.endTime}
              onChange={handleInputChange}
              required
              className="border-primary shadow-sm"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Địa điểm</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={updatedEvent.location}
              onChange={handleInputChange}
              placeholder="Nhập địa điểm"
              className="border-primary shadow-sm"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Người tham gia</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                ref={participantsInputRef}
                onFocus={handleFocusParticipantsInput}
                placeholder="Chọn người tham gia"
                className="border-primary shadow-sm"
                readOnly
              />
            </InputGroup>
            <div className="mt-3 d-flex flex-wrap">
              {updatedEvent.participants.map((participant) => (
                <Badge
                  key={participant}
                  pill
                  bg="info"
                  className="me-2 mb-2 text-white shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleParticipantRemove(participant)}
                >
                  {participant} ✕
                </Badge>
              ))}
            </div>
            {showProfileList && (
              <ListGroup className="mt-2 shadow">
                {loadingProfiles ? (
                  <Spinner animation="border" className="m-auto" />
                ) : (
                  profileIDs.map((profileID) => (
                    <ListGroup.Item
                      key={profileID}
                      action
                      onClick={() => handleParticipantSelect(profileID)}
                      className="list-group-item-action"
                    >
                      {profileID}
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Ưu tiên</Form.Label>
            <Form.Control
              as="select"
              name="priority"
              value={updatedEvent.priority}
              onChange={handleInputChange}
              className="border-primary shadow-sm"
            >
              <option value="LOW">Thấp</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="HIGH">Cao</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 shadow-sm">
            Cập nhật sự kiện
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateEventForm;
