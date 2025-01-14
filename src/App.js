import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar, EventManagement, AttendeeManagement, TaskTracker } from './components';
import CalendarView from './components/CalendarView/CalendarView'; // Import CalendarView
import LoginSignup from './components/LoginSignup/LoginSignup.js'; // Import LoginSignup
import img from './images/welcome.jpeg';
import './App.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  const handleLogin = () => {
    setIsAuthenticated(true); // Set authenticated to true after successful login
  };

  if (!isAuthenticated) {
    return <LoginSignup onLogin={handleLogin} />; // Render LoginSignup if not authenticated
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/attendee-management" element={<AttendeeManagement />} />
          <Route path="/task-tracker" element={<TaskTracker />} />
          <Route path="/calendar-view" element={<CalendarView />} />
          <Route
            path="*"
            element={
              <div>
                <h2 style={{ color: 'blue' }}>Welcome to Event Management Dashboard!</h2>
                <p>
                  The event-management feature provides a preconfigured dashboard that gives a broad
                  overview of your event-planning activities and the overall results for all your
                  events. It also provides a wall feed that tracks all activities that are linked to
                  the primary event-related records. Use the dashboard to get a quick overview of
                  all the events you're planning and to see how successful your previous events
                  have been.
                </p>
                <img src={img} width="100%" alt="Welcome" />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
