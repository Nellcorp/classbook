var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true },
  school: { type: String, required: true, lowercase: true, trim: true },
  updated_at: { type: Date, default: Date.now }
});

GroupSchema.index({school: 1, name: 1}, {unique: true});

GroupSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Group', GroupSchema);
