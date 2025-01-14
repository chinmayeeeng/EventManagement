import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendeeForm = ({ selectedAttendee, refreshAttendees, clearSelectedAttendee, events }) => {
  const [attendee, setAttendee] = useState({ name: '', email: '', assignedEvent: '' });

  // Populate the form when an attendee is selected
  useEffect(() => {
    if (selectedAttendee) {
      setAttendee({
        name: selectedAttendee.name,
        email: selectedAttendee.email,
        assignedEvent: selectedAttendee.assignedEvent?._id || '', // Use assigned event ID
      });
    } else {
      setAttendee({ name: '', email: '', assignedEvent: '' });
    }
  }, [selectedAttendee]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAttendee) {
        await axios.put(`http://localhost:5000/api/attendees/${selectedAttendee._id}`, attendee);
      } else {
        await axios.post('http://localhost:5000/api/attendees', attendee);
      }
      refreshAttendees();
      clearSelectedAttendee();
      setAttendee({ name: '', email: '', assignedEvent: '' });
      alert("Attendee added successfully");
    } catch (error) {
      console.error('Error saving attendee:', error);
    }
  };

  return (
    <div className="attendee-form">
      <h2>{selectedAttendee ? 'Edit Attendee' : 'Add Attendee'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={attendee.name}
            onChange={(e) => setAttendee({ ...attendee, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={attendee.email}
            onChange={(e) => setAttendee({ ...attendee, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Assign to Event:</label>
          <select
            value={attendee.assignedEvent}
            onChange={(e) => setAttendee({ ...attendee, assignedEvent: e.target.value })}
          >
            <option value="">None</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{selectedAttendee ? 'Update Attendee' : 'Add Attendee'}</button>
      </form>
      {selectedAttendee && (
        <button onClick={clearSelectedAttendee} style={{ marginTop: '10px' }}>
          Cancel Edit
        </button>
      )}
    </div>
  );
};

export default AttendeeForm;
