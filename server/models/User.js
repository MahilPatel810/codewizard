const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  name:   { type: String, required: true, trim: true },
  password:   { type: String, required: true, select: false },
  role:       { type: String, enum: ['student', 'admin'], default: 'student' },
  department: { type: String, default: 'CSE' },
  batch:      { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
