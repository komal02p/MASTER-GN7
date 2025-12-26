const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Note: Ensure you have MONGODB_URI in your .env file
// Connects to local mongodb on port 27017 to database 'master_gn7'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/master_gn7')
  .then(() => console.log('Connected to MongoDB at mongodb://localhost:27017/master_gn7'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Schemas & Models ---

const MedicalHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Identifier to link data to a user
  conditions: { type: String, default: '' },
  surgeries: { type: String, default: '' },
  allergies: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const MedicationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true },
  lastTakenDate: { type: String } // Stored as ISO date string YYYY-MM-DD
});

const AppointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true },
  type: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  }
});

const MedicalHistory = mongoose.model('MedicalHistory', MedicalHistorySchema);
const Medication = mongoose.model('Medication', MedicationSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// --- Routes ---

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Master GN7 Backend is running', admins: ['Komal Pokale', 'Vanshika Tikale'] });
});

// 1. Medical History Routes
app.get('/api/history/:userId', async (req, res) => {
  try {
    const history = await MedicalHistory.findOne({ userId: req.params.userId });
    // Return empty structure if no history found, to match frontend expectation
    res.json(history || { conditions: '', surgeries: '', allergies: '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { userId, conditions, surgeries, allergies } = req.body;
    // Upsert: Update if exists, Insert if new
    const history = await MedicalHistory.findOneAndUpdate(
      { userId },
      { conditions, surgeries, allergies, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history/:userId', async (req, res) => {
  try {
    await MedicalHistory.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Medication Routes
app.get('/api/medications/:userId', async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.params.userId });
    res.json(medications.map(med => ({
      id: med._id, // Map MongoDB _id to frontend 'id'
      name: med.name,
      dosage: med.dosage,
      time: med.time,
      lastTakenDate: med.lastTakenDate
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/medications', async (req, res) => {
  try {
    const newMedication = new Medication(req.body);
    const savedMed = await newMedication.save();
    res.status(201).json({
      id: savedMed._id,
      name: savedMed.name,
      dosage: savedMed.dosage,
      time: savedMed.time,
      lastTakenDate: savedMed.lastTakenDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/medications/:id', async (req, res) => {
  try {
    await Medication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/medications/:id/toggle', async (req, res) => {
  try {
    const { date } = req.body; // Expecting the date (YYYY-MM-DD) to toggle
    const med = await Medication.findById(req.params.id);
    
    if (!med) return res.status(404).json({ error: 'Medication not found' });

    // Toggle logic: if dates match, clear it; otherwise set it
    if (med.lastTakenDate === date) {
      med.lastTakenDate = null;
    } else {
      med.lastTakenDate = date;
    }
    
    await med.save();
    res.json({
      id: med._id,
      lastTakenDate: med.lastTakenDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Appointment Routes
app.get('/api/appointments/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.json(appointments.map(appt => ({
      id: appt._id,
      patientName: appt.patientName,
      date: appt.date,
      time: appt.time,
      type: appt.type,
      status: appt.status
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const newAppt = new Appointment(req.body);
    const savedAppt = await newAppt.save();
    res.status(201).json({
      id: savedAppt._id,
      ...req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
      await Appointment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Appointment deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Master GN7 Backend running on port ${PORT} for Admin: Komal Pokale & Vanshika Tikale`);
});