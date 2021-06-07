var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var boardData = require('./boardData.json')
var fs = require('fs')
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

let boards = [`flyin-rabbit`, 'the-gem', `rabbits-foot`]
var madeBoard = new Array;

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

app.get('/my-boards', function(req, res, next) {
  res.status(200).render('myboardspage');
})

app.get('/build-a-buni/:model/:boardName', function(req, res, next){
  console.log('param: ',req.params.model )
  var boardName = req.params.boardName
  if (boards.includes(req.params.model) && madeBoard.includes(boardName)){
    console.log("to string:", (req.params.model).replace("-", " "))
    var id = (req.params.model).replace("-", " ")
  
    res.status(200).render('boardBuilder', {
      boardModel: id, 
      name: boardData[boardName].name,
      model: boardData[boardName].model,
      height: boardData[boardName].height,
      width: boardData[boardName].width,
      thickness: boardData[boardName].thickness,
      fins: boardData[boardName].fins,
      contour: boardData[boardName].contour,
      deckColor: boardData[boardName].deckColor,
      bottomColor: boardData[boardName].bottomColor,
      rocker: boardData[boardName].rocker,
      finish: boardData[boardName].finish,
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

app.post('/my-boards', function(req, res, next){
  console.log("== req.body:", req.body)
  if (req.body){
    var boardModel = req.params.boardModel
    madeBoard.push(req.body.name)
    boardData.push({
      boardModel: req.body.boardModel,
      name: req.body.name,
      model: req.body.model,
      height: req.body.height,
      width: req.body.width,
      thickness: req.body.thickness,
      fins: req.body.fins,
      contour: req.body.contour,
      deckColor: req.body.deckColor,
      bottomColor: req.body.bottomColor,
      rocker: req.body.rocker,
      finish: req.body.finish
    })
    fs.writeFile(
      __dirname + '/boardData.json',
      JSON.stringify(boardData, null, 2),
      function (err) {
        if (err) {
          res.status(500).send("Error writing new data.  Try again later.")
        } else {
          res.status(200).send()
        }
      }
    )
  }
}) /*might be a problem when user tries to edit a saved board*/



app.get('/build-a-buni', function(req, res, next){
  res.status(302).redirect('/board-builder')
})

app.get('/board-builder', function(req, res, next){
  res.status(200).render('boardPage');
})

app.get('*', function (req, res) {
  res.status(404).render('404page');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
