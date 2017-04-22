var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/db');
var Schema = mongoose.Schema;

var eventSchema = new Schema ({
  name: {type: String, required: true},
  date: {type: Date, required: true},
  priority: {type: Number},
  info: {type: String}
});

module.exports = mongoose.model('Event', eventSchema);