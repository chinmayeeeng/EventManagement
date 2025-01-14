import React from 'react';
import axios from 'axios';

const TaskList = ({ tasks, refreshTasks, setSelectedTask }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleStatus = async (task) => {
    try {
      const updatedTask = { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' };
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updatedTask);
      refreshTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks available. Add a new task!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.name}</strong> - {task.deadline} - {task.status}
              <br />
              Event: {task.event?.name || 'None'} | Attendee: {task.attendee?.name || 'None'}
              <button onClick={() => setSelectedTask(task)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
              <button onClick={() => toggleStatus(task)}>
                Mark as {task.status === 'Pending' ? 'Completed' : 'Pending'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
