var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true },
  school: { type: String, required: true, lowercase: true, trim: true },
  supervisor: {
    firstname: { type: String, lowercase: true, trim: true },
    lastname: { type: String, lowercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, lowercase: true, trim: true }
  },
  updated_at: { type: Date, default: Date.now }
});

CourseSchema.index({school: 1, name: 1}, {unique: true});

CourseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Course', CourseSchema);