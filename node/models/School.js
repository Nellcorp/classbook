var mongoose = require('mongoose');

var SchoolSchema = new mongoose.Schema({
  name: String,
  country: String,
  city: String,
  address: String,
  phone: String,
  account_manager: String,
  director: {
    firstname: { type: String, lowercase: true, trim: true },
    lastname: { type: String, lowercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, lowercase: true, trim: true }
  },
  periods: {
    first: {start: Date,end: Date},
    second: {start: Date,end: Date},
    third: {start: Date,end: Date}
  },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('School', SchoolSchema);
