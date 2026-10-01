const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  slotTime: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  facultyName: { type: String, required: true },
  facultyCode: { type: String, required: true, uppercase: true },
  roomId: { type: String, required: true },
  batch: { type: String, default: 'Division-1' }
}, { timestamps: true });

timetableSchema.index({ roomId: 1, day: 1, slotTime: 1 }, { unique: true });
timetableSchema.index({ facultyCode: 1, day: 1, slotTime: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
