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
app.use(methodOverride('_method'));
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
  var userId;
  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
    userId = req.session.user.id;
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
      res.redirect('/');
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
        res.redirect('/');
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});
// Logs current user out
app.get('/logout', function(req,res){
 console.log('in get /logout');
 req.session.user = null;
 res.redirect('/')
})

// Makes User's Saved Beers List
app.get('/beers', function(req,res) {
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }

  db.any(
    "SELECT * FROM beers WHERE user_id = $1", [userId]
  ).then(function(data) {
    res.render('beers', {"beers": data});
  })
});

// Makes User's Liked Beers List
app.get('/beers/liked', function(req,res) {
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }
  // Select from beers db WHERE user_id = user logged in AND liked = true
  db.any(
    "SELECT * FROM beers WHERE user_id = $1 AND liked = 'true'", [userId]
  ).then(function(data) {
    res.render('liked_beers', {"beers": data});
  })
});

// Makes User's Liked Beers List
app.get('/beers/disliked', function(req,res) {
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }
  // Select from beers db WHERE user_id = user logged in AND liked = false
  db.any(
    "SELECT * FROM beers WHERE user_id = $1 AND liked = 'false'", [userId]
  ).then(function(data) {
    res.render('disliked_beers', {"beers": data});
  })
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
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }
  //^^^ this is the data from the front end
  console.log(userId);

  db.none(
    'INSERT INTO beers (name, brewery, img_url, description, abv, liked, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [data.name, data.brewery, data.img_url, data.description, data.abv, data.liked, userId]
  )
  .catch(function() {
    res.send('Error.')
  })
  .then(function() {
    res.redirect('search')
  })
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

// Update liked beer to disliked beer in database
app.put('/update/liked/:id', function(req,res) {
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }

  db.none("UPDATE beers SET liked = 'false' WHERE id = $1", [req.params.id])
  res.redirect('/beers/liked')
})
// Update disliked beer to liked beer in database
app.put('/update/disliked/:id', function(req,res) {
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }

  db.none("UPDATE beers SET liked = 'true' WHERE id = $1", [req.params.id])
  res.redirect('/beers/disliked')
})


// Delete beer from database
app.delete('/delete/:id', function(req,res) {
  console.log(req.params)
  var userId;
  var logged_in;
  var email;
  if (req.session.user) {
   logged_in = true;
   email = req.session.user.email;
   userId = req.session.user.id;
  }

  db.none("DELETE FROM beers WHERE id = $1", [req.params.id])
  res.redirect('/beers')
})




//  db.none("UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4",
//     [user.name,user.email,user.password,id])

//   res.redirect('/users/'+id);
// });

// //show the view to make a new user.
// app.get('/create',function(req,res){
//   res.render('create')
// })

// //create a new user.
// app.post('/users',function(req, res){
//   user = req.body

//   db.none('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',
//     [user.name,user.email,user.password])

//   res.render('index')
// });

// //delete a single user.
// app.delete('/users/:id',function(req, res){
//   id = req.params.id
//   db.none("DELETE FROM users WHERE id=$1", [id])
//   res.render('index')
// });


