var mongoose = require('mongoose');

var ClassSchema = new mongoose.Schema({
  name: String,
  school: String,
  course: String,
  subject: String,
  professor: String,
  schedule: {
    monday: {start: String,end: String},
    tuesday: {start: String,end: String},
    wednesday: {start: String,end: String},
    thursday: {start: String,end: String},
    friday: {start: String,end: String},
    saturday: {start: String,end: String}
  },
  year_level: { type: Number, min: 1, max: 6 },
  year: { type: Number, min: 2016, max: 2050 },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', ClassSchema);
