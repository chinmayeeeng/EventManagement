import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendeeForm from './AttendeeForm';
import AttendeeList from './AttendeeList';
import './AttendeeManagement.css';

const AttendeeManagement = () => {
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch all attendees
  const fetchAttendees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attendees');
      setAttendees(response.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchAttendees();
    fetchEvents();
  }, []);

  return (
    <div className="attendee-management">
      <h1>Attendee Management</h1>
      <AttendeeForm
        selectedAttendee={selectedAttendee}
        refreshAttendees={fetchAttendees}
        clearSelectedAttendee={() => setSelectedAttendee(null)}
        events={events}
      />
      <AttendeeList
        attendees={attendees}
        refreshAttendees={fetchAttendees}
        setSelectedAttendee={setSelectedAttendee}
      />
    </div>
  );
};

export default AttendeeManagement;
