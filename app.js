// CIS 197 - final
var express = require('express');
var app = express();
//var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
//var MongoClient = require('mongodb').MongoClient;
//var MONGO_URI = 'mongodb://localhost/db';

//Database Stuff
//var db = mongoose.createConnection('mongodb://localhost/db');
//var User = require('./schemas/user.js');
//var Schedule = require('./schemas/schedule.js');
//var Event = require('./schemas/event.js');


//Pages
var login = require('./customjs/login');
var home = require('./customjs/home');


app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(cookieSession({
  secret: 'ThisIsAPassword'
}));

app.use(bodyParser.urlencoded({extended: false}));


app.get('/', function (req, res) {
  res.redirect('/login');
  /*
  if (req.session.username && req.session.username !== '') {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
  */
});

//LOGIN.JS / LOGIN.HTML--------------------------
app.get('/login', function (req, res) {
	res.render('login');
});

app.post('/login', function(req, res) {
	//TODO: are these right??? where are they coming from?
	/*username = req.body.username;
	password = req.body.password;
  
	User.checkIfLegit(username, password, function(err, isRight) {
    if (err) {
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/protected');
      } else {
        res.send('wrong password');
      }
    }
  });
*/
});


//app.use('/login', login);
/*
TODO implement these pages when I have basics working

app.get('/register', function (req, res) {
	res.render('register');
});

app.post('/register', function(req, res) {
	User.addUser(req.body.username, req.body.password, function(err) {
		if (err) res.send('error ' + err);
		else res.send('new user registered with username ' + req.body.username);
	});
});

app.get('/logout', function(req, res) {
	req.session.username = '';
	res.render('logout');
});
*/


/*
//HOME.JS / HOME.HTML----------------------------
app.get('/home', function(req, res) {
	res.render('home');
});

app.post('/home', function(req, res) {
	//TODO
});

//TODO how to do this??
app.use('/home', home);
*/





app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});

/*
MongoClient.connect(MONGO_URI, function (err, db) {
  if (err) return console.log(err);

  app.listen(3000, function() {
    console.log('listening on 3000');
  });
});
*/