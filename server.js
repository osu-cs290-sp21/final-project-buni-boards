var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var boardData = require('./boardData.json')
console.log(boardData)

//Import the mongoose module
// var mongoose = require('mongoose');

// //Set up default mongoose connection
// var mongoDB = 'mongodb://127.0.0.1/my_database';
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();
var port = process.env.PORT || 3000;

let boards = [`flyin'-rabbit`, 'the-gem', `rabbit's-foot`]

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
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

app.get('/build-a-buni/:model/:name', function(req, res, next){
  console.log("boards", boardData["boardsArr"][0])
  console.log('param: ',req.params.model )
  if (boards.includes(req.params.model)){
    console.log("to string:", (req.params.model).replace("-", " "))
    var id = (req.params.model).replace("-", " ")
  
    res.status(200).render('boardBuilder', {
      boardModel: id, 
      name: boardData["boardsArr"][0].name,
      model: boardData["boardsArr"][0].model,
      height: boardData["boardsArr"][0].height,
      width: boardData["boardsArr"][0].width,
      thickness: boardData["boardsArr"][0].thickness,
      fins: boardData["boardsArr"][0].fins,
      contour: boardData["boardsArr"][0].contour,
      deckColor: boardData["boardsArr"][0].deckColor,
      bottomColor: boardData["boardsArr"][0].bottomColor,
      rocker: boardData["boardsArr"][0].rocker,
      finish: boardData["boardsArr"][0].finish,
      layout: false});
  }
  else{
    next()
  }
})

app.get('/build-a-buni/:model/', function(req, res, next){
  if (boards.includes(req.params.model)){
    console.log("to string:", (req.params.model).replace("-", " "))
    var id = (req.params.model).replace("-", " ")
    res.status(200).render('boardBuilder', {
      boardModel: id, 
      layout: false});
  }
  else{
    next()
  }
})



app.get('/build-a-buni', function(req, res, next){
  res.status(302).redirect('/board-builder')
})

app.get('/board-builder', function(req, res, next){
  res.status(200).render('boardPage');
})

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
