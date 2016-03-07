var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
  title: { type: String, required: false, lowercase: true, trim: true},
  schedule: { type: String, required: true, lowercase: true, trim: true},
  summary: { type: String, required: true, trim: true},
  start: Date,
  started: Date,
  end: Date,
  missing: [String],
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
