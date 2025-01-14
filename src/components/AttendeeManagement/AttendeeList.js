import React from 'react';
import axios from 'axios';

const AttendeeList = ({ attendees, refreshAttendees, setSelectedAttendee }) => {
  // Handle deletion of an attendee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/attendees/${id}`);
      refreshAttendees();
    } catch (error) {
      console.error('Error deleting attendee:', error);
    }
  };

  return (
    <div className="attendee-list">
      <h2>Attendee List</h2>
      {attendees.length === 0 ? (
        <p>No attendees available. Add a new attendee!</p>
      ) : (
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee._id}>
              <strong>{attendee.name}</strong> ({attendee.email}) - Assigned to:{' '}
              {attendee.assignedEvent?.name || 'None'}
              <button onClick={() => setSelectedAttendee(attendee)}>Edit</button>
              <button onClick={() => handleDelete(attendee._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendeeList;
