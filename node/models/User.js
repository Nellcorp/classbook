var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  title: String,
  email: String,
  firstname: String,
  lastname: String,
  school: String,
  address: String,
  city: String,
  state: String,
  bio: String,
  postal: String,
  phone: String,
  discipline: String,
  supervisor: {
    firstname: { type: String, lowercase: true, trim: true },
    lastname: { type: String, lowercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, lowercase: true, trim: true }
  },
  course: String,
  type: String,
  year_level: { type: Number, min: 1, max: 6 },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
