var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var TokenSchema = new mongoose.Schema({
  user: { type: String, required: true, lowercase: true, unique: true },
  created:  { type: Date, expires: "24h", required: true, index: true, default: Date.now},
  updated_at: { type: Date, default: Date.now }
});

TokenSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Token', TokenSchema);