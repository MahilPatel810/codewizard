const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, index: true },
  timeDuration: { type: String, required: true },
  purpose: { type: String, required: true, enum: ['Extra Lecture', 'Lab Session', 'Exam', 'Club Activity', 'Guest Lecture', 'Workshop'] },
  clubName: { type: String },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Confirmed', 'Completed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

bookingSchema.index({ room: 1, date: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
