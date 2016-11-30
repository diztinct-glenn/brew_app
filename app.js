// Start Up/Requires
var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var session = require('express-session');
var parseJson = require('parse-json');
var request = require('request');
var PORT = process.env.PORT || 3000;
var db = pgp(process.env.DATABASE_URL || 'postgres://gbasgaard@localhost:5432/brew_db');
var bcrypt = require('bcrypt');
var KEY = process.env.BREWERY_DB_API;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, function() {
  console.log('Brew app is running on', PORT);
});

// Create Session
app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// Makes home/log-in page for existing users
app.get("/", function(req, res){
  var logged_in;
  var email;
  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }
  var data = {
    "logged_in": logged_in,
    "email": email
  }
  res.render('index', data);
});

// Makes new account page
app.get('/signup', function(req,res) {
  res.render('signup')
})

// Adds new user info into users database
app.post('/signup', function(req, res){
  var data = req.body;
  console.log(data);
  bcrypt.hash(data.password, 10, function(err, hash){
    db.none(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
      [data.email, hash]
    ).catch(function(user) {
      res.send('Error. New user not created.')
    }).then(function(){
      res.send('New user created!');
    })
  })
})

// Logs existing user in
app.post('/login', function(req, res){
  var data = req.body;
  console.log(data)
  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.send('Email/Password not found.')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect('/beers');
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});

// Makes User's Saved Beers List
app.get('/beers', function(req,res) {
  res.render('beers');
});

// Makes User's Liked Beers List
app.get('/beers/liked', function(req,res) {
  // Select from beers db WHERE user_id = user logged in AND liked = true
  res.render('beers');
});

// Makes User's Liked Beers List
app.get('/beers/disliked', function(req,res) {
  // Select from beers db WHERE user_id = user logged in AND liked = false
  res.render('beers');
});

// Makes Individual Beer Info Page
app.get('/beers/name', function(req,res) {
  res.render('beer_info')
})



// Adds Beer Info into beers database
//get the data from the saveBeer function on the front end
//put it into the database with INSERT INTO
app.post('/beers/search', function(req,res) {
  var data = req.body;
  // var json = data;
  // JSON.parse(json);
  //^^^ this is the data from the front end
  console.log(data)
  console.log(data.name);

  // db.none(
  //   'INSERT INTO beers (name, brewery, img_url, description, abv, ibu, liked) VALUES ($1, $2, $3, $4, $5)', [data.name, data.brewery, data.img_url, data.description, data.abv, data.ibu, data.liked]
  // )
  // .catch(function(user) {
  //   res.send('Error.')
  // })
  // .then(function(user) {
  //   res.send('Beer Saved!')
  // })
})

// Makes Beer Search Page
app.get('/beers/search', function(req,res) {
  res.render('search');
});

app.get('/search/:beer_name', function(req, res){
    console.log(req.params) // Logs beer name I type into Search Bar on front end
    var beer_name = req.params.beer_name;
    var api = 'http://api.brewerydb.com/v2/beers?name=' + beer_name + '&withBreweries=Y&key=' + KEY;
    request(api, function(err, resp, body){
      // console.log(body) // Logs JSON object from the external API of the specific beer I searched
      body = JSON.parse(body);
      res.send(body) // sends json object back to front end
    })
  });



