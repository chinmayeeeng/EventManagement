import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ selectedTask, refreshTasks, clearSelectedTask, events, attendees }) => {
  const [task, setTask] = useState({ name: '', deadline: '', status: 'Pending', event: '', attendee: '' });

  useEffect(() => {
    if (selectedTask) {
      setTask({
        name: selectedTask.name,
        deadline: selectedTask.deadline,
        status: selectedTask.status || 'Pending',
        event: selectedTask.event?._id || '',
        attendee: selectedTask.attendee?._id || '',
      });
    } else {
      setTask({ name: '', deadline: '', status: 'Pending', event: '', attendee: '' });
    }
  }, [selectedTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: task.name,
        deadline: task.deadline,
        status: task.status,
        event: task.event,
        assignedAttendee: task.attendee,
      };

      if (selectedTask) {
        await axios.put(`http://localhost:5000/api/tasks/${selectedTask._id}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/tasks', payload);
      }
      refreshTasks();
      clearSelectedTask();
      setTask({ name: '', deadline: '', status: 'Pending', event: '', attendee: '' });
      alert("Task added successfully");
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="task-form">
      <h2>{selectedTask ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name:</label>
          <input
            type="text"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input
            type="date"
            value={task.deadline}
            onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Event:</label>
          <select
            value={task.event}
            onChange={(e) => setTask({ ...task, event: e.target.value })}
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Attendee:</label>
          <select
            value={task.attendee}
            onChange={(e) => setTask({ ...task, attendee: e.target.value })}
            required
          >
            <option value="">Select Attendee</option>
            {attendees.map((attendee) => (
              <option key={attendee._id} value={attendee._id}>
                {attendee.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{selectedTask ? 'Update Task' : 'Add Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;
