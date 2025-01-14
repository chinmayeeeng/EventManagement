import React from 'react';
import axios from 'axios';

const EventList = ({ events, refreshEvents, setSelectedEvent }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      refreshEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="event-list">
      <h2>Event List</h2>
      {events.length === 0 ? (
        <p>No events available. Add a new event!</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <strong>{event.name}</strong>
              <br />
              Description: {event.description || 'No description provided'}
              <br />
              Date: {new Date(event.date).toDateString()}
              <br />
              Location: {event.location}
              <br />
              Attendees: {event.attendees?.length || 0}
              <br />
              <button onClick={() => setSelectedEvent(event)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
