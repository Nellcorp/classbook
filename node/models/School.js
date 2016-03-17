var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true },
  //name: String,
  country: { type: String, required: true, lowercase: true, trim: true},
  city: { type: String, required: true, lowercase: true, trim: true},
  address: { type: String, required: true, lowercase: true, trim: true},
  phone: { type: String, required: true, lowercase: true, trim: true},
  semesters: {
    first: {start: Date,end: Date},
    second: {start: Date,end: Date},
  },
  updated_at: { type: Date, default: Date.now }
});

SchoolSchema.plugin(uniqueValidator);
module.exports = mongoose.model('School', SchoolSchema);
