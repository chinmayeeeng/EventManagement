import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventForm = ({ selectedEvent, refreshEvents, clearSelectedEvent }) => {
  const [event, setEvent] = useState({ name: '', description: '', date: '', location: '' });

  useEffect(() => {
    if (selectedEvent) {
      setEvent({
        name: selectedEvent.name,
        description: selectedEvent.description || '',
        date: selectedEvent.date,
        location: selectedEvent.location,
      });
    } else {
      setEvent({ name: '', description: '', date: '', location: '' });
    }
  }, [selectedEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await axios.put(`http://localhost:5000/api/events/${selectedEvent._id}`, event);
      } else {
        await axios.post('http://localhost:5000/api/events', event);
      }
      refreshEvents();
      clearSelectedEvent();
      setEvent({ name: '', description: '', date: '', location: '' });
      alert("Event added successfully");
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <div className="event-form">
      <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
          style={{width:'100%'}}  
          rows='3'       
          value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
          ></textarea>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={event.date}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            required
          />
        </div>
        <button type="submit">{selectedEvent ? 'Update Event' : 'Add Event'}</button>
      </form>
      {selectedEvent && (
        <button onClick={clearSelectedEvent} style={{ marginTop: '10px' }}>
          Cancel Edit
        </button>
      )}
    </div>
  );
};

export default EventForm;
