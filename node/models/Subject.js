var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true },
  school: { type: String, required: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true },
  course: { type: String, required: true, lowercase: true, trim: true },
  year: { type: Number, min: 1, max: 6 },
  updated_at: { type: Date, default: Date.now }
});

SubjectSchema.index({school: 1, course: 1, name: 1}, {unique: true});

SubjectSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Subject', SubjectSchema);
