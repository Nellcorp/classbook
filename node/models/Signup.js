var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var SignupSchema = new mongoose.Schema({
  school: { type: String, required: true, lowercase: true, trim: true, unique: true },
  firstname: { type: String, required: true, lowercase: true, trim: true},
  lastname: { type: String, required: true, lowercase: true, trim: true},
  email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, sparse: false },
  phone: { type: String, required: true, lowercase: true, trim: true, unique: true},
  school_phone: { type: String, required: true, lowercase: true, trim: true, unique: true},
  country: { type: String, required: true, lowercase: true, trim: true},
  city: { type: String, required: true, lowercase: true, trim: true},
  address: { type: String, required: true, lowercase: true, trim: true},
  semesters: {
    first: {start: Date,end: Date},
    second: {start: Date,end: Date},
  },
  created:  { type: Date, expires: "30d", required: true, index: true, default: Date.now},
  updated_at: { type: Date, default: Date.now }
});

SignupSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Signup', SignupSchema);
