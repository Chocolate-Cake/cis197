//CIS 197 - final
var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

//database
var User = require('./db/user');
var Schedule = require('./db/schedule');
var Event = require('./db/event');

//functions
var getOption = require('./public/js/option');

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
      res.send('Error! ' + err);
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
app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  var username = req.body.usernameBox;
  var password = req.body.passwordBox;

  console.log(username);
  console.log(password);
  /*
  User.addUser(req.body.usernameBox, req.body.passwordBox, function(err) {
    if (err) res.send('error' + err);
    else res.send('new user registered with username ' + req.body.username);
  });
  */
  res.redirect('/');
}); 

//HOME.HTML-----------------------------------------
app.get('/home', function (req, res) {
  //TODO check permissions
  res.render('home');
});

//SCHEDULES.HTML------------------------------------
app.get('/schedules', function (req, res) {
  //TODO check permissions
  res.render('schedules');
});

app.post('/schedules', function (req, res) {
  //TODO show the chosen schedule on 
  //the viewschedule page
});

//VIEWSCHEDULE.HTML--------------------------------
app.get('/viewschedule', function (req, res) {
  res.render('viewschedule');
});

app.post('/viewschedule', function (req, res) {
  var result = req.body.userOption;
  switch (result) {
    case 'addEvent':
      console.log("result was add event");
      res.redirect('addevent');
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
      res.redirect('/schedules');
    break;
    case 'addFriend':
      console.log('result was add friend');
      res.redirect('/addfriend');
    break;
    default:
      console.log('do nothing');
  }
  
});


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});

