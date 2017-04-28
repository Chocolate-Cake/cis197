//CIS 197 - final
var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

//database
var User = require('./db/user');
var Schedule = require('./db/schedule');
var Event = require('./db/event');

var pointer = undefined;

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
redirects to home, error
*/
app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var username = req.body.usernameBox;
  var password = req.body.passwordBox;

  console.log(username);
  console.log(password);

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
redirects to error, home
*/
app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  var username = req.body.regNameBox;
  var password = req.body.regPassBox;

  console.log('username ' + username);
  console.log('password ' + password);

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
app.get('/logout', function (req, res) {
  req.session.username = '';
  res.render('logout');
});


//HOME.HTML-----------------------------------------
/*
links to addschedule, addfriend, viewschedule
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
        console.log("shared " + shared.length);
        res.render('home', {
          username: req.session.username, 
          arrSchedules: schedules,
          arrShared: shared,
          arrFriends: friends
        });
      });
      } else {
        console.log('failed to find user for rendering home');
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
          console.log('failed to delete schedule');
        } else {
          res.redirect('/home');
        }
      });
    }
    break;

    case 'deleteschedule':
    if (input != '') {
      User.deleteSchedule(req.session.username, input, function (error) {
        if (error) {
          console.log('failed to add new schedule');
        } else {
          res.redirect('/home');
        }
      });
    }
    break;

    case 'addfriend':
    if (input !== '') {
      User.friendAddMe(req.session.username, input, function (error) {
        if (error) {
          console.log('failed to add new friend');
        } else {
          User.addFriend(req.session.username, input, function (err) {
            if (err) {
              console.log('failed to add new friend');
            } 
          })
        }
      });
    }
    break;

    case 'deletefriend':
    if (input !== '') {
      User.friendDeleteMe(req.sessoin.username, input, function (e) {
        if (e) {
          console.log('error');
        } else {
          User.deleteFriend(req.session.username, input, function (e2) {
            if (e2) {
              console.log('error');
            }
          })
        }
      });
    }
    break;

    case 'openschedule':
      console.log('openschedule');
      console.log(input);
      req.session.view = 'schedule';
      req.session.n = input;
      res.redirect('/viewschedule');
    break;

    case 'openshared':
      console.log('openshared');
      console.log(input);
      req.session.view = 'shared';
      req.session.n = input;
      req.session.o = req.body.attr2;
      res.redirect('/viewschedule');
    break;

    case 'deleteevent':
      console.log('home received del event');
      var o = req.body.owner;
      var s = req.body.schedulename;
      var e = req.body.eventname;

      console.log(o);
      console.log(s);
      console.log(e);

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
redirects to addevent, addeditor, home, addfriend
*/
app.get('/viewschedule', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render viewschedule');
  } else {
    console.log('open my own schedule');
    switch(req.session.view) {
      case 'schedule':
      Schedule.findOne({owner: req.session.username, name: req.session.n}, function (error, result) {
        if (result) {
          res.render('viewschedule', {name: result.name, owner: req.session.username, arrEvents: result.events});
        } else {
          console.log("error displaying schedule");
        }
      });
      break;
      
      case 'shared':
      Schedule.findOne({owner: req.session.o, name: req.session.n}, function (error, result) {
        if (result) {
          res.render('viewschedule', {name: result.name, owner: result.owner, arrEvents: result.events});
        } else {
          console.log('errer loading up shedule');
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
      console.log("result was add event");
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


//ADDEDITOR.HTML-----------------------------------
/*
redirects to home
*/
/*
app.get('/addeditor', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render add editor');
  } else {
    res.render('addeditor');
  }
});

app.post('/addeditor', function (req, res) {
  var friend = res.body.friend;
  var schedulename = res.body.schedule;
  var myname = req.session.username + "";
  //console.log('my name is ' + myname);
  //check schedule doesn't already exist
  Schedule.find({name: schedulename, owner: myname}, 
    function (err, result) {
      if (!result) {
        res.send('failed to add editor because no such schedule');
      } else {
        result.addEditor(req.body.friend, function (error) {
          if (error) {
            res.send('failed to add editor because function didnt work');
          } 
          else {
            console.log('did add editor');
            res.redirect('/viewschedule');
          }
      });
    }
  });
});
*/
//ADDEVENT.HTML------------------------------------
/*
redirects to home
*/
app.get('/addevent', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render add event');
  } else {
    User.findOne({username: req.session.username}, function (error, myself) {
      if (myself) {
        //get schedules of everyone who shared schedules with me
        var arr = new Array();
        for (var i = 0; i < myself.sharedToMe.length; i++) {
          arr.push.apply(arr, myself.sharedToMe[i].schedules);
        }

        res.render('addevent', {arrList: myself.schedules, arrList2: arr});
      } else {
        console.log('could not find user');
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

  console.log(type);
  console.log(owner);
  console.log(schedule);
  console.log(eventName);
  console.log(eventDate);
  console.log(eventPriority);
  console.log(eventInfo);


  switch(type) {
    case 'newEvent':
    if (schedule !== '' && eventName !== '') {
      User.addEvent(req.session.username, schedule, eventName, eventDate,
        eventPriority, eventInfo, function (error) {
        if (error) {
          console.log('error adding event');
        }
      })
      req.session.n = schedule;
      res.redirect('/viewschedule');
    } else {
      console.log('failed to add event');
      res.send('invalid schedule or event name');
    }
    res.redirect('/viewschedule');
    break;
    
    case 'sharedEvent':
    if (schedule !== '' && eventName !== '') {
      //TODO
    }
    break;
  }

  
});

//ERROR.HTML--------------------------------------
app.get('/error', function (req, res) {
  res.render('error');
})

//TEST.HTML---------------------------------------
app.get('/test', function (req, res) {
  res.render('test');
  console.log("DISPLAY ALL USER INFO");

  User.find(function (error, result) {
    if(result) {
      console.log(result);
    }
  });
  
  console.log("DISPLAY ALL SCHEDULE INFO");

  Schedule.find(function (error, result) {
    if(result) {
      console.log(result);
    }
  });

  console.log("DISPLAY ALL EVENT INFO");

  Event.find(function (error, result) {
    if (result) {
      console.log(result);
    }
  });
});

//CLEAR.HTML-----------------------------

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

