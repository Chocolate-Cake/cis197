var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Schedule = require('./schedule');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
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
	//make new schedule
  var newSchedule = new Schedule({
    name: schedulename,
    owner: this.username
  });

  //find all schedules with these same attributes
  Schedule.find({name: schedulename, owner: this.username}, function (error) {
    if (error) {
      cb(error);
    }
    //if already exists
    if (result.length > 0) {
      throw new Error('schedule already exists');
    } 
    //if everything is fine
    else {
      this.schedules.push(newSchedule);
      this.save(cb);
    }
  });
}

userSchema.methods.addFriend = function(friendname, cb) {
  
  var has = this.containsUser(friendname, function (error, result) {
    //if true that friend is a user
    if (result) {
      var arr = this.friends;
      for (var i = 0; i < friends.length; i++) {
        if (arr[i] === friendname) {
          cb (new Error());
        } 
      }
      this.friends.push(friendname);
      this.save(cb);
    } else {
      cb(new Error('person doesnt exist'));
    }
  });
}


userSchema.methods.deleteSchedule = function(schedulename, cb) {
  //TODO
}

//function that determines if this user already exists
userSchema.statics.containsUser = function(name, cb) {
  console.log('checking if user collection contains ' + name);
  User.find({name: name}, function (error, result) {
    if (error) {
      cb(error);
    } else {
      //TODO what is this and why does it work??
      cb(null, result.length > 0);
    }
  });
}

module.exports = mongoose.model('User', userSchema);