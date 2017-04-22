var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/db');
var Schema = mongoose.Schema;
var Event = require('./event');

var scheduleSchema = new Schema ({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true},
  events: { type: Array }
});

//function that returns a new schedule, given a name and owner name
//or undefined if a schedule of that name already exists
//callback should take result
scheduleSchema.statics.addSchedule = function(name, owner, cb) {
  var newSchedule = new this({
    name: name,
    owner: owner,
  });
  //check schedule doesn't already exist
  this.find({name: name, owner: owner}, function (error, result) {
    if (error) {
      cb(newSchedule);
    } else {
      cb(null);
    }
  }); 
  
}

//function that adds a new Event to schedule's array of events
//cb takes result and err
scheduleSchema.methods.addEvent = function(name, date, priority, info, cb) {
	Event.addEvent(name, date, priority, info, function (result, err) {
    if (err) {
      console.log(err);
      cb(err);
    }
		else if (result) {
      this.events.push(result);
    } else {
      console.log('schedule add event failed with no error');
    }
	});
}

//function that deletes an event from the schedule
//call delete on the event passed in
scheduleSchema.methods.deleteEvent = function(owner, schedule, eventName, cb) {
	Event.find({owner: owner, schedule: schedule, name: eventName}, function (result, err) {
    if (err) {
      cb(err);
    } else {
      //TODO find proper way to delete event from array
      //this.events.delete(result);
    }
  });
}

module.exports = mongoose.model('Schedule', scheduleSchema);