const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const JWT_SECRET = 'your_secret_key'; // Replace with a secure key


// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/events', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Schemas
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  location: { type: String, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendee' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

// Define Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  assignedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  assignedAttendee: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});

// Create Models
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Attendee = mongoose.model('Attendee', attendeeSchema);
const Task = mongoose.model('Task', taskSchema);


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// **Authentication Routes**
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Routes

// **Event Routes**
app.post('/api/events', async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const newEvent = new Event({ name, description, date, location });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('attendees', 'name email')
      .populate('tasks', 'name status');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, location } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { name, description, date, location },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Task.deleteMany({ event: id });
    await Attendee.deleteMany({ assignedEvent: id });

    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

// **Attendee Routes**
app.post('/api/attendees', async (req, res) => {
  try {
    const { name, email, assignedEvent } = req.body;
    const newAttendee = new Attendee({ name, email, assignedEvent });

    if (assignedEvent) {
      const event = await Event.findById(assignedEvent);
      if (!event) {
        return res.status(404).json({ message: 'Assigned event not found' });
      }
      event.attendees.push(newAttendee._id);
      await event.save();
    }

    await newAttendee.save();
    res.status(201).json(newAttendee);
  } catch (error) {
    console.error('Error creating attendee:', error);
    res.status(500).json({ message: 'Error creating attendee', error: error.message });
  }
});

app.get('/api/attendees', async (req, res) => {
  try {
    const attendees = await Attendee.find().populate('assignedEvent', 'name');
    res.status(200).json(attendees);
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({ message: 'Error fetching attendees', error: error.message });
  }
});

app.put('/api/attendees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, assignedEvent } = req.body;

    const updatedAttendee = await Attendee.findByIdAndUpdate(
      id,
      { name, email, assignedEvent },
      { new: true }
    );

    if (!updatedAttendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }

    res.status(200).json(updatedAttendee);
  } catch (error) {
    console.error('Error updating attendee:', error);
    res.status(500).json({ message: 'Error updating attendee', error: error.message });
  }
});

app.delete('/api/attendees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const attendee = await Attendee.findById(id);
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }

    await Attendee.findByIdAndDelete(id);
    res.status(200).json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendee:', error);
    res.status(500).json({ message: 'Error deleting attendee', error: error.message });
  }
});

// **Task Routes**
app.post('/api/tasks', async (req, res) => {
  try {
    const { name, deadline, status, assignedAttendee, event } = req.body;

    const associatedEvent = await Event.findById(event);
    if (!associatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newTask = new Task({ name, deadline, status, assignedAttendee, event });
    await newTask.save();

    associatedEvent.tasks.push(newTask._id);
    await associatedEvent.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedAttendee', 'name email')
      .populate('event', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, deadline, status, assignedAttendee, event } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, deadline, status, assignedAttendee, event },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const associatedEvent = await Event.findById(task.event);
    if (associatedEvent) {
      associatedEvent.tasks = associatedEvent.tasks.filter(
        (taskId) => taskId.toString() !== id
      );
      await associatedEvent.save();
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// **New Route for Calendar Data**
app.get('/api/calendar/events', async (req, res) => {
  try {
    const events = await Event.find({}, { name: 1, date: 1, _id: 1 }).lean();
    const calendarEvents = events.map((event) => ({
      id: event._id,
      title: event.name,
      start: new Date(event.date),
      end: new Date(event.date),
    }));
    res.status(200).json(calendarEvents);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Error fetching calendar events', error: error.message });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
