var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var SubjectNameSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true, uniqueCaseInsensitive: true },
  updated_at: { type: Date, default: Date.now }
});

SubjectNameSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SubjectName', SubjectNameSchema);