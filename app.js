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

  User.addUser(req.body.usernameBox, req.body.passwordBox, function(err) {
    if (err) {
      res.send('error' + err);
    }
    else res.send('new user registered with username ' + req.body.username);
  });

  res.redirect('/');
}); 

//HOME.HTML-----------------------------------------
app.get('/home', function (req, res) {
  //TODO populate div with results
  //TODO check permissions
  res.render('home');
});

//VIEWSCHEDULE.HTML--------------------------------
app.get('/viewschedule', function (req, res) {
  //TODO check permissions
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
app.get('/addeditor', function (res, req) {
  //TODO check permissions
  res.render('addeditor');
});

app.post('/addeditor', function (res, req) {
  //TODO Schedule.add editor
});

//ADDEVENT.HTML------------------------------------
app.get('/addevent', function (req, res) {
  //TODO check permissions
  res.render('addevent');
});

app.post('/addevent', function (res, req) {
  //TODO schedule.add event
});

//ADDFRIEND.HTML-----------------------------------
app.get('/addfriend', function (req, res) {
  //TODO check permissions
  res.render('addfriend');
});

app.post('/addfriend', function (req, res) {
  //TODO user.add friend
})

//ADDSCHEDULE.HTML---------------------------------
app.get('/addschedule', function (req, res) {
  //TODO check permissions
  res.render('addschedule');
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

