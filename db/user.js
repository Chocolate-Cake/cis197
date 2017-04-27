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
  shared: {type: Array},
  friends: {type: Array}
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
    password: password
  });
  newUser.save(cb);
}

userSchema.statics.deleteUser = function(username, cb) {
  User.remove({username: username}, function (error) {
    if (error) {
      cb(error);
    } else {
      cb(null);
    }
  });
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
      var valid = true;
      //check schedule doesn't already exist
      for (var i = 0; i < myself.schedules.length; i++) {
        if (myself.schedules[i].name === schedulename) {
          console.log('schedule already exists');
          valid = false;
        }
      }

      if (valid) {
        console.log('added new schedule');
        myself.schedules.push(newSchedule);
      } else {
        console.log('did not add new schedule');
      }
      myself.save(cb);
    } else {
      cb(error);
    }
  });
}

userSchema.statics.deleteSchedule = function(username, schedulename, cb) {
  this.findOne({username: username}, function (error, myself) {
    if (myself) {
      for (var i = 0; i < myself.schedules.length; i++) {
        if (myself.schedules[i].name === schedulename) {
          myself.schedules.splice(i, 1);
        }
      }
      myself.save(cb);
    } else {
      cb(error);
    }
  });
}

userSchema.statics.displaySchedule = function(username, name, cb) {
  this.findOne({username: username}, function (error, myself) {
    if (myself) {
      for (var i = 0; i < myself.schedules.length; i++) {
        if (myself.schedules[i].name === name) {
          cb(null, myself.schedules[i]);
        }
      }
    } else {
      cb(error);
    }
  });
}

userSchema.statics.displayShared = function(username, name, cb) {
  this.findOne({username: username}, function (error, myself) {
    if (myself) {
      for (var i = 0; i < myself.shared.length; i++) {
        if (myself.shared[i].name === name) {
          cb(null, myself.shared[i]);
        }
      }
    } else {
      cb(error);
    }
  }); 
}

userSchema.statics.addEvent = function(owner, schedulename, name, date, priority, info, cb) {
  var newEvent = new Event({
    name: name,
    date: date,
    priority: priority,
    info: info,
  });
  
  this.findOne({username: owner}, function (error, myself) {
    if (myself) {
      for (var i = 0; i < myself.schedules.length; i++) {
        if (myself.schedules[i].name === schedulename) {
          var s = myself.schedules[i];
          console.log('SCHEDULE:' + s);
          console.log(myself);
          var valid = true;

          for (var j = 0; j < s.events.length; j++) {
            if (s.events[j].name === name) {
              console.log('event already exists');
              valid = false;
            }
          }

          if (valid) {
            console.log('added new event');
            s.events.push(newEvent);
            s.save(cb);
          }
        }
      }
    } else {
      cb(error);
    }
  });
}

userSchema.statics.deleteEvent = function(owner, schedulename, eventName, cb) {
  this.findOne({username: owner}, function (error, myself) {
    if (myself) {
      for (var i = 0; i < myself.schedules.length; i++) {
        if (myself.schedules[i].name === schedulename) {
          var s = myself.schedules[i];

          for (var i = 0; i < s.events.length; i++) {
            if (s.events[i].name === eventName) {
              s.events.splice(i, 1);
            }
          }
        }
      }

      myself.save(cb);
    } else {
      cb(error);
    }
  });
}

//function that adds a friend to the current user, so now you have the
//option of sharing schedules with this person
userSchema.statics.addFriend = function(username, friendname, cb) {
  var top = this;
  this.findOne({username: friendname}, function (error, friend) {
    //if friend is an existing user
    if (friend) {
      top.findOne({username: username}, function (err, myself) {
        //find self and push friend
        if (myself) {
          var valid = true;

          for (var i = 0; i < myself.friends.length; i++) {
            if (myself.friends[i] === friendname) {
              valid = false;
            }
          }

          if (valid) {
            console.log('added new friend');
            myself.friends.push((friend.username + ''));

            //share all my schedules with friend
            for (var i = 0; i < myself.schedules.length; i++) {
              friend.shared.push(myself.schedules[i]);
            }
          }
          myself.save(friend.save(cb));

        } else {
          cb(err);
        }
      });
    } else {
      cb(error);
    }
  });
}

//function that deletes a friend and all the shedules shared with this person
userSchema.statics.deleteFriend = function (username, friendname, cb) {
  var top = this;

  this.findOne({username: friendname}, function (error, friend) {
    if (friend) {
      //find me and delete friend my my array
      top.findOne({username: username}, function (err, myself) {
        if (myself) {
          for (var i = 0; i < myself.friends.length; i++) {
            if (myself.friends[i] === friendname) {
              myself.friends.splice(i, 1);
            }
          }

        //get indices of friend's schedules that are mine
        var arr;
        for (var i = 0; i < friend.shared.length; i++) {
          if (friend.shared[i].owner === username) {
            arr.push(i);
          }
        }
        if (arr) {
          //delete these schedules
          for (var i = arr.length - 1; i >= 0; i--) {
            friend.shared.splice(arr[i], 1);
          }
        }

        myself.save(cb);
        } else {
          cb(err);
        }
      });
    } else {
      cb(error);
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