var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var AbsenceSchema = new mongoose.Schema({
  user: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true},
  school: { type: String, required: true, trim: true},
  year: { type: Number, min: 1, max: 6 },
  course: { type: String, required: true, trim: true},
  subject: { type: String, required: true, trim: true},
  session: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  supervisor_phone: { type: String, required: true },
  supervisor_message: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now},
  updated_at: { type: Date, default: Date.now }
});

AbsenceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Absence', AbsenceSchema);