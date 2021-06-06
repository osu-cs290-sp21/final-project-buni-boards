var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function(req, res, next){
  res.status(200).render('homepage');
})

app.get('/meet-the-team', function(req, res, next) {
  res.status(200).render('aboutpage');
})

app.get('/contact-us', function(req, res, next) {
  res.status(200).render('contactpage');
})

app.get('/blog', function(req, res, next) {
  res.status(200).render('blogpage');
})

app.get('/build-a-buni', function(req, res, next){
  res.status(200).render('boardBuilder', {layout: false});
})

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
