var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var CourseNameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, lowercase: true, trim: true },
  updated_at: { type: Date, default: Date.now }
});

CourseNameSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CourseName', CourseNameSchema);