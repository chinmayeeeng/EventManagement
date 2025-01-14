import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import EventList from './EventList';
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="event-management">
      <h1>Event Management</h1>
      <EventForm
        selectedEvent={selectedEvent}
        refreshEvents={fetchEvents}
        clearSelectedEvent={() => setSelectedEvent(null)}
      />
      <EventList
        events={events}
        refreshEvents={fetchEvents}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
};

export default EventManagement;
