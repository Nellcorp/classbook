var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var AbsenceSchema = new mongoose.Schema({
  user: { type: String, required: true, lowercase: true, trim: true },
  user_message: { type: String, required: true },
  supervisor_message: { type: String, required: true },
  session: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true, lowercase: true, trim: true },
  created:  { type: Date, required: true, default: Date.now},
  updated_at: { type: Date, default: Date.now }
});

AbsenceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Absence', AbsenceSchema);