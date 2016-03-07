var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true, lowercase: true, trim: true},
  lastname: { type: String, required: true, lowercase: true, trim: true},
  email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, sparse: false },
  phone: { type: String, required: true, unique: true },
  school: { type: String, required: true, lowercase: true, trim: true},
  title: { type: String, lowercase: true, trim: true},
  discipline: { type: String, lowercase: true, trim: true},
  supervisor: {
    firstname: { type: String, lowercase: true, trim: true },
    lastname: { type: String, lowercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, lowercase: true, trim: true }
  },
  course: { type: String, lowercase: true, trim: true},
  type: { type: String, required: true, lowercase: true, trim: true},
  year: { type: Number, min: 1, max: 6 },
  updated_at: { type: Date, default: Date.now }
});

UserSchema.plugin(uniqueValidator);

UserSchema.plugin(passportLocalMongoose,{
    usernameField: 'phone',
    interval: 100
  });

module.exports = mongoose.model('User', UserSchema);
