import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      const calendarEvents = response.data.map((event) => ({
        id: event._id,
        title: event.name,
        start: new Date(event.date),
        end: new Date(event.date),
        location: event.location,
      }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = isSelected ? '#ff6347' : '#4caf50';
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        padding: '5px',
      },
    };
  };

  return (
    <div className="calendar-view">
      <h1>Event Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, margin: '50px' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => alert(`Event: ${event.title}\nLocation: ${event.location}`)}
      />
    </div>
  );
};

export default CalendarView;
