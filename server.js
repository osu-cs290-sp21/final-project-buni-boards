var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var boardData = require('./boardData.json')
var fs = require('fs')

var app = express();
var port = process.env.PORT || 3000;

let boards = [`flyin-rabbit`, 'the-gem', `rabbits-foot`]
var madeBoard = new Array;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static('public'));

var hbs = exphbs.create({})

hbs.handlebars.registerHelper('isFoot', function (value){
  return value == 'rabbits-foot'
})


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
  res.status(200).render('myboardspage', boardData);
})

app.get('/build-a-buni/:model/:id', function(req, res, next){
  console.log('param: ',req.params.model )
  var boardName = req.params.boardName
  if (boards.includes(req.params.model)){
    var model = (req.params.model).replace("-", " ")
    var id = req.params.id
    res.status(200).render('boardBuilder', {
      boardModel: model, 
      creator: boardData[id].creator,
      model: boardData[id].model,
      height: boardData[id].height,
      width: boardData[id].width,
      thickness: boardData[id].thickness,
      fins: boardData[id].fins,
      contour: boardData[id].contour,
      deckColor: boardData[id].deckColor,
      bottomColor: boardData[id].bottomColor,
      rocker: boardData[id].rocker,
      finish: boardData[id].finish,
      layout: false});
  }
  else{
    next()
  }
})

app.get('/build-a-buni/:model/', function(req, res, next){
  if (boards.includes(req.params.model)){
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
    madeBoard.push(req.body.creator)
    boardData.push({
      id: boardData.length, /* temporary */
      boardModel: req.body.boardModel,
      creator: req.body.creator,
      custom: req.body.custom,
      description: req.body.description,
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

app.delete('/my-boards/delete-board', function(req, res, next){
  boardData.splice(req.body.id, 1)
  /*changing id for no conflicts when new boards get added */
  for(i in boardData){
    boardData[i].id = i;
  }
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

})



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
