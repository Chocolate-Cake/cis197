var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/db');
var Schema = mongoose.Schema;
var Event = require('./event');
var User = require('./user');

var scheduleSchema = new Schema ({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true},
  events: { type: Array }
});

module.exports = mongoose.model('Schedule', scheduleSchema);