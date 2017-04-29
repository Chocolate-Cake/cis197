//CIS 197 - final
var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

//database
var User = require('./db/user');
var Schedule = require('./db/schedule');
var Event = require('./db/event');

//other setup stuff
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static('public'));

app.use(cookieSession({
  secret: 'ThisIsAPassword'
}));

app.use(bodyParser.urlencoded({extended: false}));

//PAGES BEGIN--------------------------------------
app.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

//LOGIN.HTML----------------------------------------
/*
links to register
can redirect to home
*/
app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var username = req.body.usernameBox;
  var password = req.body.passwordBox;

  User.checkIfLegit(username, password, function(err, isRight) {
    if (err) {
      res.send('failed to check if user legit');
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/home');
      } else {
        res.send('wrong password');
      }
    }
  });
});

//REGISTER.HTML-------------------------------------
/*
links to login
can redirect to home
*/
app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  var username = req.body.regNameBox;
  var password = req.body.regPassBox;

  User.addUser(username, password, function(err) {
    if (err) {
      res.send('failed to register new user');
    }
    else {
      req.session.username = username;
      res.redirect('/home');
    }
  });
}); 

//LOGOUT.HTML---------------------------------------
/*
links to login
*/
app.get('/logout', function (req, res) {
  req.session.username = '';
  res.render('logout');
});


//HOME.HTML-----------------------------------------
/*
links to logout
can redirect to viewschedule
*/
app.get('/home', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render home');
  } else {   
    User.findOne({username: req.session.username}, function (error, myself) {
      if (myself) {
        var shared = new Array();
        User.find({sharedByMe:[req.session.username]}, function (err, result) {
          if (result) {
            for (var i = 0; i < result.length; i++) {
              shared.push.apply(shared, result[i].schedules);
            }
          }

        var friends = myself.sharedByMe;
        var schedules = myself.schedules;
        res.render('home', {
          username: req.session.username, 
          arrSchedules: schedules,
          arrShared: shared,
          arrFriends: friends
        });
      });
      } else {
        res.send('failed to find user for rendering home');
      }
    });
  }
});

app.post('/home', function (req, res) {
  var type = req.body.clicked;
  var input = req.body.attr;

  switch(type) {
    case 'addschedule':
    if (input != '') {
      User.addSchedule(req.session.username, input, function (error) {
        if (error) {
          res.send('failed to add schedule');
        } else {
          req.session.view = 'schedule';
          req.session.n = input;
          res.redirect('/viewschedule');
        }
      });
    }
    break;

    case 'deleteschedule':
    if (input != '') {
      User.deleteSchedule(req.session.username, input, function (error) {
        if (error) {
          res.send('failed to delete schedule');
        } else {
          res.redirect('/home');
        }
      });
    }
    break;

    case 'addfriend':
    if (input !== '') {
      User.addFriend(req.session.username, input, function (error) {
        if (error) {
          res.send('failed to add friend');
        }
      });
    }
    break;

    case 'deletefriend':
    if (input !== '') {
      User.deleteFriend(req.session.username, input, function (e) {
        if (e) {
          res.send('failed to delete friend');
        }
      });
    }
    break;

    case 'openschedule':
      req.session.view = 'schedule';
      req.session.n = input;
      res.redirect('/viewschedule');
    break;

    case 'openshared':
      req.session.view = 'shared';
      req.session.n = input;
      req.session.o = req.body.attr2;
      res.redirect('/viewschedule');
    break;

    case 'deleteevent':
      var o = req.body.owner;
      var s = req.body.schedulename;
      var e = req.body.eventname;

      User.deleteEvent(o, s, e, function (error) {
        if (error) {
          res.send('error deleting event');
        }
      });
    break;

  }
});


//VIEWSCHEDULE.HTML--------------------------------
/*
can redirect to addevent, home, displayops
*/
app.get('/viewschedule', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render viewschedule');
  } else {
    switch(req.session.view) {
      case 'schedule':
      Schedule.findOne({owner: req.session.username, name: req.session.n}, function (error, result) {
        if (result) {
          res.render('viewschedule', {name: result.name, owner: req.session.username, arrEvents: result.events});
        } else {
          res.send("error displaying schedule");
        }
      });
      break;
      
      case 'shared':
      Schedule.findOne({owner: req.session.o, name: req.session.n}, function (error, result) {
        if (result) {
          res.render('viewschedule', {name: result.name, owner: result.owner, arrEvents: result.events});
        } else {
          res.send('errer loading up shedule');
        }
      });
      //res.render('viewschedule', {name: 'placeholder', owner: 'placeholder', arrEvents: new Array()});
      break;
    }
  }
});

app.post('/viewschedule', function (req, res) {
  var result = req.body.userOption;
  switch (result) {
    case 'addEvent':
      res.redirect('/addevent');
    break;
    case 'changeDisplay':
      console.log('result was change display');
      //TODO call function CURRENTLY DOESN'T EXIST
    break;
    case 'home':
      res.redirect('/home');
    break;
  }
  
});

//ADDEVENT.HTML------------------------------------
/*
can redirect to home
*/
app.get('/addevent', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render add event');
  } else {
    User.findOne({username: req.session.username}, function (error, myself) {
      //find me
      if (myself) {
        User.find({sharedByMe: [req.session.username]}, function (err, result) {
          if (result) {
            //get schedules of everyone who shared schedules with me
            var arr = new Array();
            for (var i = 0; i < result.length; i++) {
              arr.push.apply(arr, result[i].schedules);
            }
          } else {
            cb(err);
          }
          res.render('addevent', {arrList: myself.schedules, arrList2: arr});
          
        });
      } else {
        res.send('could not find user');
      }
    });
  }
});

app.post('/addevent', function (req, res) {
  var type = req.body.clicked;
  var owner = req.body.owner;
  var schedule = req.body.schedule;
  var eventName = req.body.eventName;
  var eventDate = req.body.eventDate;
  var eventPriority = req.body.eventPriority;
  var eventInfo = req.body.eventInfo;

  switch(type) {
    case 'newEvent':
    req.session.view = 'schedule';
    if (schedule !== '' && eventName !== '') {
      User.addEvent(req.session.username, schedule, eventName, eventDate,
        eventPriority, eventInfo, function (error) {
        if (error) {
          res.send('error adding event');
        }
      });
      req.session.n = schedule;
      res.redirect('/viewschedule');
    } else {
      res.send('invalid event details');
    }
    res.redirect('/viewschedule');
    break;
    
    case 'sharedEvent':
    req.session.view = 'shared';
    if (schedule !== '' && eventName !== '') {
      User.addEvent(owner, schedule, eventName, eventDate,
        eventPriority, eventInfo, function (error) {
        if (error) {
          res.send('error adding event');
        }
      });
      req.session.n = schedule;
      res.redirect('/viewschedule');
    } else {
      res.send('invalid event details');
    }
    break;
  }

  
});

//TEST.HTML---------------------------------------
/*
do nothing
purpose is to log the entire database of information
*/
app.get('/test', function (req, res) {
  res.render('test');
  User.find(function (error, result) {
    if(result) {
      console.log('USER INFO');
      console.log(result);
    }
  });
  Schedule.find(function (error, result) {
    if(result) {
      console.log('SCHEDULE INFO');
      console.log(result);
    }
  });
  Event.find(function (error, result) {
    if (result) {
      console.log('EVENT INFO');
      console.log(result);
    }
  });
});

//CLEAR.HTML-----------------------------
/*
do nothing
purpose is to delete entire database
*/
app.get('/clear', function (req, res) {
  User.remove({}, function (err) {
    if (err) {
      console.log('failed to clear user');
    }
  });
  Schedule.remove({}, function (err) {
    if (err) {
      console.log('failed to clear schedule');
    }
  });
  Event.remove({}, function (err) {
    if (err) {
      console.log('failed to clear event');
    }
  });
  req.session.username = '';
  res.render('clear');
});



app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});

