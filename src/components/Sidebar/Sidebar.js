import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/event-management">Event Management</NavLink></li>
        <li><NavLink to="/attendee-management">Attendee Management</NavLink></li>
        <li><NavLink to="/task-tracker">Task Tracker</NavLink></li>
        <li><NavLink to="/calendar-view">Calendar View</NavLink></li> {/* Added Calendar View */}
      </ul>
    </div>
  );
}

export default Sidebar;
