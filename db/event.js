var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/db');
var Schema = mongoose.Schema;

var eventSchema = new Schema ({
  name: {type: String, required: true},
  date: {type: Date, required: true},
  priority: {type: Number, required: true},
  info: {type: String, required: true},
  schedulename: {type: String, required: true}
});

module.exports = mongoose.model('Event', eventSchema);