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

//function that adds a new Event to schedule's array of events
//cb takes result and err
scheduleSchema.statics.addEvent = function(owner, schedulename, name, date, priority, info, cb) {
  var newEvent = new Event({
    name: name,
    date: date,
    priority: priority,
    info: info,
  });
  
  this.findOne({owner: owner, name: schedulename}, function (error, result) {
    if (result) {
      var valid = true;
      for (var i = 0; i < result.events.length; i++) {
        if (result.events[i].name === name) {
          console.log('event already exists in this schedule');
          valid = false;
        }
      }

      if (valid) {
        result.events.push(newEvent);
      }
      result.save(cb);
    } else {
      cb(error);
    }
  });
}


//function that deletes an event from the schedule
//call delete on the event passed in
scheduleSchema.methods.deleteEvent = function(owner, schedulename, eventName, cb) {
  this.findOne({owner: owner, name: schedulename}, function (error, schedule) {
    if (schedule) {
      for (var i = 0; i < schedule.events.length; i++) {
        if (schedule.events[i].name === eventName) {
          schedule.events.splice(i, 1);
        }
      }
      schedule.save(cb);
    } else {
      cb(error);
    }
  });
}

scheduleSchema.statics.addEditor = function(owner, schedulename, editorname, cb) {
  //check this person exists
  User.findOne({username: editorname}, function (error, editor) {
    if (editor) {
      var valid = true;
      for (var i = 0; i < editor.shared.length; i++) {
        if (editor.shared[i].name === schedulename) {
          console.log('schedule already shared');
          valid = false;
        }
      }

      if (valid) {
        this.findOne({owner: owner, name: schedulename}, function (err, schedule) {
          if (schedule) {
            editor.shared.push(schedule);
          } else {
            cb(err);
          }
        });
      }
      editor.save(cb);
    } else {
      cb(error);
    }
  });
}


module.exports = mongoose.model('Schedule', scheduleSchema);