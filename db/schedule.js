var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/db');
var Schema = mongoose.Schema;
var Event = require('./event');

var scheduleSchema = new Schema ({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true},
  events: { type: Array },
  editors: { type: Array }
});

//function that adds a new Event to schedule's array of events
//cb takes result and err
scheduleSchema.methods.addEvent = function(name, date, priority, info, cb) {
  var newEvent = new Event({
    name: name,
    date: date,
    priority: priority,
    info: info,
    schedulename: this.name
  });
  var arr = this.events;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === name) {
      cb(new Error('event already present'));
    }
  }
  this.events.push(newEvent);
  this.save(cb);
}

scheduleSchema.methods.addEditor = function(name, cb) {
  var arr = this.editors;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === name) {
      cb(new Error('editor already present'));
    }
  }
  this.editors.push(name);
  this.save(cb);
}


//function that deletes an event from the schedule
//call delete on the event passed in
scheduleSchema.methods.deleteEvent = function(owner, schedule, eventName, cb) {
  //TODO
}

module.exports = mongoose.model('Schedule', scheduleSchema);