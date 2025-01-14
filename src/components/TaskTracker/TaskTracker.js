import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './TaskTracker.css';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchEventsAndAttendees = async () => {
    try {
      const eventsResponse = await axios.get('http://localhost:5000/api/events');
      const attendeesResponse = await axios.get('http://localhost:5000/api/attendees');
      setEvents(eventsResponse.data);
      setAttendees(attendeesResponse.data);
    } catch (error) {
      console.error('Error fetching events or attendees:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEventsAndAttendees();
  }, []);

  return (
    <div className="task-tracker">
      <h1>Task Tracker</h1>
      <TaskForm
        selectedTask={selectedTask}
        refreshTasks={fetchTasks}
        clearSelectedTask={() => setSelectedTask(null)}
        events={events}
        attendees={attendees}
      />
      <TaskList
        tasks={tasks}
        refreshTasks={fetchTasks}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
};

export default TaskTracker;
