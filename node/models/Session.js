var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
  title: String,
  school: String,
  course: String,
  subject: String,
  lecture: String,
  professor: String,
  summary: String,
  start: Date,
  end: Date,
  year_level: { type: Number, min: 1, max: 6 },
  year: { type: Number, min: 2016, max: 2050 },
  completed: { type: Boolean, default: false },
  missing_professor: { type: Boolean, default: false },
  missing_students: [String],
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
