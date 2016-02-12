// Babel ES6/JSX Compiler
require('babel-register');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Princess = require('./models/princess');
var config = require('./config');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/princess
 * Adds new princess to the database.
 */
app.post('/api/princess', function(req, res, next) {
  var gender = req.body.gender;
  var princessName = req.body.name;
  var birthday = req.body.birthday;
          try {
            var princessId = '' + Math.floor((Math.random() * 8));
            var princess = new Princess({
              princessId: princessId,
              name: princessName,
              birthday: new Date(birthday),
              gender: gender
            });
            princess.save(function(err) {
              if (err) return next(err);
              res.send({ message: princessName + ' has been added successfully!' });
            }); 
          } catch (e) {
            res.status(404).send({ message: princessName + ' resulted in some error! '+e });
          }
});

/**
 * GET /api/princesses
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/princesses', function(req, res, next) {
            res.send([]);
});

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
