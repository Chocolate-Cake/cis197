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

//PAGES BEGIN
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
      res.redirect('/error');
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
  var username = req.body.usernameBox;
  var password = req.body.passwordBox;

  console.log(username);
  console.log(password);

  User.addUser(req.body.usernameBox, req.body.passwordBox, function(err) {
    if (err) {
      res.redirect('/error');
    }
    else {
      req.session.username = username;
      res.redirect('/home');
    }
  });
}); 

//HOME.HTML-----------------------------------------
/*
links to addschedule, addfriend, viewschedule
*/
app.get('/home', function (req, res) {
  //TODO populate div with results
  if (!req.session.username || req.session.username === '') {
    res.redirect('/error');
  } else {
    res.render('home', {username: req.session.username });
  }
});


//VIEWSCHEDULE.HTML--------------------------------
/*
redirects to addevent, addeditor, home, addfriend
*/
app.get('/viewschedule', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/error');
  } else {
    res.render('viewschedule');
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
      //TODO call function
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
    default:
      console.log('do nothing');
  }
  
});


//ADDEDITOR.HTML-----------------------------------
/*
redirects to home
*/
app.get('/addeditor', function (res, req) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/error');
  } else {
    res.render('addeditor');
  }
});

app.post('/addeditor', function (res, req) {
  //TODO Schedule.add editor
});

//ADDEVENT.HTML------------------------------------
/*
redirects to home
*/
app.get('/addevent', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/error');
  } else {
    res.render('addevent');
  }
});

app.post('/addevent', function (res, req) {
  //TODO schedule.add event
});

//ADDFRIEND.HTML-----------------------------------
/*
redirects to home
*/
app.get('/addfriend', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/error');
  } else {
    res.render('addfriend');
  }
});

app.post('/addfriend', function (req, res) {
  //TODO user.add friend
})

//ADDSCHEDULE.HTML---------------------------------
/*
redirects to home
*/
app.get('/addschedule', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/error');
  } else {
    res.render('addschedule');
  }
})

app.post('/addschedule', function (req, res) {
  //TODO user.add schedule
});

//ERROR.HTML--------------------------------------
app.get('/error', function (req, res) {
  res.render('error');
})







app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});

