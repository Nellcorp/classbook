var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
  name: String,
  course: String,
  supervisor: String,
  year_level: { type: Number, min: 1, max: 6 },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);
