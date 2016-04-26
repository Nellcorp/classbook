var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var ScheduleSchema = new mongoose.Schema({
  subject: { type: String, unique: true, required: true, lowercase: true, trim: true },
  professor: { type: String, required: true, lowercase: true, trim: true },
  school: { type: String, required: true, lowercase: true, trim: true },
  course: { type: String, required: true, trim: true},
  schedule: {
    monday: {
      start: { type: String, lowercase: true, trim: true },
      end:  { type: String, lowercase: true, trim: true }
    },
    tuesday: {
      start: { type: String, lowercase: true, trim: true },
      end:  { type: String, lowercase: true, trim: true }
      },
    wednesday: {
      start: { type: String, lowercase: true, trim: true },
      end:  { type: String, lowercase: true, trim: true }
      },
    thursday: {
      start: { type: String, lowercase: true, trim: true },
      end:  { type: String, lowercase: true, trim: true }
      },
    friday: {
      start: { type: String, lowercase: true, trim: true },
      end:  { type: String, lowercase: true, trim: true }
      }
    },
  updated_at: { type: Date, default: Date.now }
});

ScheduleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Schedule', ScheduleSchema);


//Add minutes after midnight: http://jsfiddle.net/rhq0Lma5/3/