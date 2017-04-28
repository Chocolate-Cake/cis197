var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Schedule = require('./schedule');
var Event = require('./event');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  schedules: {type: Array},
  sharedByMe: {type: Array},
  sharedToMe: {type: Array}
});

//salt for securing the password
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.addUser = function(username, password, cb) {
  var newUser = new this({ 
    username: username, 
    password: password,
  });
  newUser.save(cb);
}

//function that adds a new Schedule to the user's array of schedules
userSchema.statics.addSchedule = function(username, schedulename, cb) {
	//make new schedule
  var newSchedule = new Schedule({
    name: schedulename,
    owner: username
  });

  this.findOne({username: username}, function (error, myself) {
    if (myself) {
      Schedule.findOne({owner: username, name: schedulename}, function (error, result) {
        if (result) {
          console.log('schedule already exists');
          cb(null);
        } else if (error) {
          cb(error);
        } else {
          myself.schedules.push(newSchedule);
          newSchedule.save(function (e) {
            if (e) {
              cb(e);
            } else {
              myself.save(cb);
            }
          })
        }
      });
    } else {
      cb(error);
    }
  });
}

userSchema.statics.deleteSchedule = function(username, schedulename, cb) {
  //find the user object
  this.findOne({username: username}, function (error, myself) {
    if (myself) {
      //find the schedule object to check that it actually exists
      Schedule.findOne({owner: username, name: schedulename}, function (err, sch) {
        if (sch) {
          //delete schedule from my array of schedules
          for (var i = 0; i < myself.schedules.length; i++) {
            if (myself.schedules[i].name === schedulename) {
              myself.schedules.splice(i, 1);
            }
          }
          //delete schedule from collection of schedules
          Schedule.remove({owner: username, name: schedulename}, function (err2) {
            if (err2) {
              cb(err2);
            } else {
              myself.save(cb);
            }
          });
        } else {
          cb(err);
        }
      });
    } else {
      cb(error);
    }
  });
}

userSchema.statics.addEvent = function(owner, schedulename, name, date, priority, info, cb) {
  console.log("called add event function");
  var newEvent = new Event({
    name: name,
    date: date,
    priority: priority,
    info: info,
    schedulename: schedulename,
    owner: owner
  });

  Schedule.findOne({owner: owner, name: schedulename}, function (error, result) {
    if (result){
      //check if this event exists already
      Event.findOne({owner: owner, schedulename: schedulename, name: name}, function(err, evt) {
        if (evt) {
          console.log('event already exists');
          cb(null);
        } else if (err) {
          console.log('error');
          cb(err);
        } else {
          console.log('added new event');
          result.events.push(newEvent);
          newEvent.save(function (err2) {
            if (err2) {
              console.log("ERRROR" + err2);
              cb(err2);
            } else {
              result.save(cb);
            }
          });
        }
      });
    } else {
      console.log('error finding schedule for addevent');
      cb(error);
    }
  });
}

userSchema.statics.deleteEvent = function(owner, schedulename, eventName, cb) {
  //find schedule object
  Schedule.findOne({owner: owner, name: schedulename}, function (error, result) {
    if (result) {
      //find that the event actually exists
      Event.findOne({owner: owner, schedulename: schedulename, name: eventName}, function (err, evt) {
        if (evt) {
          //delete event from array of events
          for (var i = 0; i < result.events.length; i++) {
            if (result.events[i].name === eventName) {
              result.events.splice(i, 1);
            }
          }
          //delete event from collection of events
          Event.remove({owner: owner, schedulename: schedulename, name: eventName}, function (err2) {
            if (err2) {
              cb(err2);
            } else {
              result.save(cb);
            }
          });
        } else {
          cb(err);
        }
      });
    } else {
      cb(error);
    }
  });
}

//function that adds a friend to the current user, so this person
//can now view and edit my schedules
userSchema.statics.addFriend = function(username, friendname, cb) {
  this.findOne({username: username}, function (error, result) {
    if (result) {
      var valid = true;
      for (var i = 0; i < result.sharedByMe.length; i++) {
        if (result.sharedByMe[i] === friendname) {
          valid = false;
        }
      }

      if (valid) {
        result.sharedByMe.push(friendname);
      }
      result.save(cb);
    } else {
      cb(error);
    }
  });
}

userSchema.statics.friendAddMe = function (username, friendname, cb) {
  this.findOne({username: friendname}, function (error, result) {
    if (result) {
      var valid = true;
      for (var i = 0; i < result.sharedToMe.length; i++) {
        if (result.sharedToMe[i] === username) {
          valid = false;
        }
      }

      if (valid) {
        result.sharedToMe.push(username);
      }
      result.save(cb);
    } else {
      cb(error);
    }
  });
}

//function that deletes a friend
userSchema.statics.deleteFriend = function (username, friendname, cb) {
  this.findOne({username: username}, function (error, result) {
    if (result) {
      var valid = true;
      for (var i = 0; i < result.sharedByMe.length; i++) {
        if (result.sharedByMe[i] === friendname) {
          result.sharedByMe.splice(i, 1);
        }
      }
    }
  });
}

userSchema.statics.friendDeleteMe = function (username, friendname, cb) {
  this.findOne({username: friendname}, function (error, result) {
    if (result) {
      var valid = true;
      for (var i = 0; i < result.sharedToMe.length; i++) {
        if (result.sharedToMe[i] === username) {
          result.sharedToMe.splice(i, 1);
        }
      }
      result.save(cb);
    }
  });
}

//function that manages user login
userSchema.statics.checkIfLegit = function(username, password, cb) {
  this.findOne({ username: username }, function(err, user) {
    if (!user) cb('no user');
    else {
      bcrypt.compare(password, user.password, function(err, isRight) {
        if (err) return cb(err);
        cb(null, isRight);
      });
    };
  });
}

//function that determines if this user already exists
userSchema.statics.containsUser = function(name, cb) {
  console.log('checking if user collection contains ' + name);
  User.find({username: name}, function (error, result) {
    if (error) {
      cb(error);
    } else {
      //TODO what is this and why does it work??
      cb(null, result.length > 0);
    }
  });
}

module.exports = mongoose.model('User', userSchema);