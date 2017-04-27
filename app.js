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
    User.findOne({username: req.session.username}, function (error, result) {
      if (!result) {
        res.send('failed to find user for rendering home');
      } else {
        //console.log("this user is " + result);
        var shared = result.shared;
        var friends = result.friends;
        var schedules = result.schedules;
        res.render('home', {
          username: req.session.username, 
          arrSchedules: schedules,
          arrShared: shared,
          arrFriends: friends
        });
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
      User.addFriend(req.session.username, input, function (error) {
        if (error) {
          console.log('failed to add new friend');
        } else {
          res.redirect('/home');
        }
      });
    }
    break;

    case 'deletefriend':
    if (input !== '') {
      User.deleteFriend(req.session.username, input, function (error) {
        if (error) {
          console.log('failed to delete friend');
        } else {
          res.redirect('/home');
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
      res.redirect('/viewschedule');
    break;
  }
});


//VIEWSCHEDULE.HTML--------------------------------
/*
redirects to addevent, addeditor, home, addfriend
*/
app.get('/viewschedule', function (req, res) {
  //TODO CURRENTLY CANNOT TEST
  if (!req.session.username || req.session.username === '') {
    res.send('failed to render viewschedule');
  } else {
    console.log('user ' + req.session.username);
    console.log('param ' + req.session.n);
    switch(req.session.view) {
      case 'schedule':
      User.displaySchedule(req.session.username, req.session.n, function (error, result) {
        if (result) {
          console.log(result);
          res.render('viewschedule', {name: result.name, arrEvents: result.events});
        } else {
          console.log('error retrieving schedule');
        }
      });
      break;
      
      case 'shared':
      User.displayShared(req.session.username, req.session.n, function (error, result) {
        if (result) {
          res.render('viewschedule', {name: result.name, arrEvents: result.events});
        } else {
          console.log('error retrieving schedule');
        }
      })
      break;
    }
    //res.render('viewschedule');
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
      //TODO call function CURRENT DOESN'T EXIST
    break;
    case 'addEditor':
      console.log('result was add editor');
      res.redirect('/addeditor');
    break;
    case 'switchSchedule':
      res.redirect('/home');
    break;
    case 'addFriend':
      console.log('result was add friend');
      res.redirect('/addfriend');
    break;
  }
  
});


//ADDEDITOR.HTML-----------------------------------
/*
redirects to home
*/
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
            res.redirect('/home');
          }
      });
    }
  });
});

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
        res.render('addevent', {arrList: myself.schedules});
      } else {
        console.log('could not find user');
      }
    });
  }
});

app.post('/addevent', function (req, res) {
  var schedule = req.body.schedule;
  var eventName = req.body.eventName;
  var eventDate = req.body.eventDate;
  var eventPriority = req.body.eventPriority;
  var eventInfo = req.body.eventInfo;

  console.log(schedule);
  console.log(eventName);
  console.log(eventDate);
  console.log(eventPriority);
  console.log(eventInfo);

  
  User.addEvent(req.session.username, schedule, eventName, eventDate,
    eventPriority, eventInfo, function (error) {
    if (error) {
      console.log('error adding event');
    }
  })

});

//ERROR.HTML--------------------------------------
app.get('/error', function (req, res) {
  res.render('error');
})


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});

