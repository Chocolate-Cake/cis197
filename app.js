// CIS 197 - final
var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static('public'));

app.use(cookieSession({
  secret: 'ThisIsAPassword'
}));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
  res.redirect('/login');
});

//LOGIN.JS / LOGIN.HTML--------------------------
app.get('/login', function (req, res) {
	res.render('login');
});

app.post('/login', function(req, res) {
});




app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});

