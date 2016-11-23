var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
var bodyParser = require("body-parser");
// var session = require('express-session');
var PORT = process.env.PORT || 3000;
var db = pgp(process.env.DATABASE_URL || 'postgres://gbasgaard@localhost:5432/brew_db');

/* BCrypt stuff here */
var bcrypt = require('bcrypt');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, function() {
  console.log('Brew app is running on', PORT);
});

// app.use(session({
//   secret: 'theTruthIsOutThere51',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }))

// app.get("/", function(req, res){
//   var logged_in;
//   var email;

//   if(req.session.user){
//     logged_in = true;
//     email = req.session.user.email;
//   }

//   var data = {
//     "logged_in": logged_in,
//     "email": email
//   }

//   res.render('index', data);
// });

app.get('/', function(req,res) {
  res.render('index');
});








