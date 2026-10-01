const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId:    { type: String, required: true, unique: true, trim: true },
  name:      { type: String, required: true, trim: true },
  institute: { type: String, required: true, enum: ['CSPIT', 'DEPSTAR', 'PDPIAS', 'RPCP', 'ARIP', 'CMPICA', 'I2IM', 'MTIN', 'BDIAS'] },
  type:      { type: String, required: true, enum: ['Classroom', 'Lab', 'Auditorium', 'Seminar Hall'] },
  capacity:  { type: Number, required: true },
  hasAC:     { type: Boolean, default: false },
  floor:     { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
