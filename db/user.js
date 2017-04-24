var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Schedule = require('./schedule');

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

//function that adds a new Schedule to the user's array of schedules
userSchema.statics.addSchedule = function(username, schedulename, cb) {
	//make new schedule
  var newSchedule = new Schedule({
    name: schedulename,
    owner: this.username
  });

  this.findOne({username: username}, function (error, myself) {
    var valid = true;
    if (myself) {
      for (var i = 0; i < myself.schedules.length; i++) {
        if (myself.schedules[i].name === schedulename) {
          console.log('schedule already exists');
          valid = false;
        }
      }

      if (valid) {
        console.log('added new schedule');
        myself.schedules.push(newSchedule);
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

//function that adds a friend to the current user, so now you have the
//option of sharing schedules with this person
userSchema.statics.addFriend = function(username, friendname, cb) {
  var top = this;
  this.findOne({username: friendname}, function (error, friend) {
    //if friend is an existing user
    if (friend) {
      console.log('friend exists');
      top.findOne({username: username}, function (err, myself) {
        //find self and push friend
        //TODO check no double push
        if (myself) {
          console.log('i exist');
          console.log(myself);
          console.log('array: ' + myself.friends);
          console.log('length: ' + myself.friends.length);
          var valid = true;

          for (var i = 0; i < myself.friends.length; i++) {
            if (myself.friends[i] === friendname) {
              console.log('friend already added');
              valid = false;
            }
          }

          if (valid) {
            console.log('added new friend');
            myself.friends.push((friend.username + ''));
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

//function that deletes a friend and all the shedules shared with this person
userSchema.statics.deleteFriend = function (username, friendname, cb) {
  User.findOne({username: friendname}, function (error, friend) {
    if (friend) {
      //delete friend my my array
      User.findOne({username: username}, function (err, myself) {
        for (var i = 0; i < myself.friends.length; i++) {
          if (myself.friends[i] === friendname) {
            myself.friends.splice(i, 1);
          }
        }
      });

      //delete my schedules from friend's shared
      for (var i = 0; i < friend.shared.length; i++) {
        if (friend.shared[i].owner === username) {
          friend.shared.splice(i, 1);
        }
      }
      myself.save(cb);
    } else {
      cb(error);
    }
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