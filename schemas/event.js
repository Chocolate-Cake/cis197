var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/db');
var Schema = mongoose.Schema;

var eventSchema = new Schema ({
  name: {type: String, required: true},
  date: {type: Date, required: true},
  priority: {type: Number},
  info: {type: String}
});

//function that adds a new event 
//cb should take a result
eventSchema.statics.addEvent = function(owner, schedule, eventName, date, priority, info, cb) {
  var newEvent = new this({
    name: eventname,
    date: date,
    priority: priority,
    info: info
  });
  //check if this event already exists for this owner's this calendar
  Event.find({owner: owner, schedule: schedule, name: eventName}, function (error, result) {
    if (error) {
      cb(newEvent);
    } else {
      cb(null);
    }
  });
}

/*
TODO have edit function if I have time
eventSchema.methods.edit = function(cb) {
  var e = this;
  
}
*/

eventSchema.statics.print = function() {
  console.log('successfully required event');
}


var Event = mongoose.model('Event', eventSchema);

module.exports = Event;