var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Schedule = require('./schedule');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

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



//function that makes a new user and saves it somewhere
//TODO figure out how/why this works
userSchema.statics.addUser = function(username, password, cb) {
  var newUser = new this({ 
    username: username, 
    password: password
  });
  newUser.save(cb);
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
userSchema.methods.addSchedule = function(schedulename, cb) {
	Schedule.addSchedule(schedulename, this.username, function (result, err) {
    if (err) {
      console.log(err);
      cb(err);
    }
    else if (result) {
      this.schedules.push(result);
    } else {
      console.log('user add schedule failed with no error');
    }
  });
}

userSchema.methods.deleteSchedule = function(schedulename, cb) {
  //TODO
}

//function that determines if this user already exists
userSchema.statics.containsUser = function(name, callback) {
  console.log('checking if user collection contains ' + name);
  User.find({name: name}, function (error, result) {
    if (error) {
      callback(error);
    } else {
      //TODO what is this and why does it work??
      callback(null, result.length > 0);
    }
  });
}

module.exports = mongoose.model('User', userSchema);