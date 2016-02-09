var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  name: String,
  supervisor: String,
  year_level: { type: Number, min: 1, max: 6 },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
