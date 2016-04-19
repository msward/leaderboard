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
var Nation = require('./models/nation');
var Tribe = require('./models/tribe');
var Event = require('./models/event');
var Princess = require('./models/princess');
var Member = require('./models/member');
var Score = require('./models/score');
var config = require('./config');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var cors = require('cors');

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
app.use(cors());

var corsOptions = {
   origin: 'http://yprincess.icfworkshops.com'
};
		 

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*.icfworkshops.com");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


app.get('/api/initialize', function(req, res, next) {
  try {
	  var shawnee = new Nation({
	     name: "Chickahominy"
	  });
	  shawnee.save(function(err) {
	     if (err) return next(err);
	  });
	  var archery = new Event({
		 name: 'Archery',
		 scoring: 'Points'
	  });
	  var riflery = new Event({
	     name: 'Riflery',
	     scoring: 'Points'
	  });
	  var canoeing = new Event({
	     name: 'Canoeing',
	     scoring: 'Time'
	  });
	  archery.save();
	  riflery.save();
	  canoeing.save();	  
	  res.status(200).send('ok');
  } catch (e) {
      res.status(404).send({ message: ' initialize resulted in some error! '+e });
  }
});

app.post('/api/import', function(req, res, next) {
	
   var data = req.body;
   var tribeName;
   for(var index in data){
      var jobj = data[index];
      tribeName = jobj["Tribe"];
   }
   importTribe(jobj["Tribe"], data);

   
   // After the import, initialize all tribes with nation
   Nation.findOne({name:'Chickahominy'}, function(err, nation) {
      if (err) return next(err);
      if (nation) {
    	  Tribe.update({}, { $set: { nationId: nation._id }}).exec();    	  
      };
   });
   
   // After the import, initialize all scores for all events for all princesses
   Event.find({}, function(err, events) {
      var userMap = {};
      events.forEach(function(event) {
         insertScores(event);
      });
   });
   
   function insertScores(event) {
	  console.log('Inserting scores for '+event.name);
	  Princess.find({}, function(err, princesses) {
		  console.log(princesses);
		  princesses.forEach(function(aPrincess) {
			  console.log('princess='+aPrincess.moniker);
			  console.log('new score for '+event.name+' with '+event.scoring);
		      var score = new Score({
		         eventId: event._id,
		         kind: event.scoring
		      });
		      score.save(function(err) {
		          if (err) { 
		        	  console.log('asdfasdflkfsdklsdflkjsdfljksdf '+err);
		        	  return next(err);
		          }
		      });
		      Princess.update({_id: aPrincess._id },
		         { $push:
		            {
		              scores:  score 
		            }
		         },
		         function(err) {
		            if (err) {
			        	console.log('uioriuoriourweiouerwiouerw '+err);
		            	return next(err);
		            }
		      });
		  });
	  });
   };	   
   
   // This high-order function is invoked for any need to import or update a tribe.
   // The method takes a callback function which is subsequently called to populate tribe's princesses
   function importTribe(tribeName, data) {
	   console.log('Inside high-order importTribe function. Passed the tribeName='+tribeName);
	   Tribe.findOneAndUpdate(
         {name: tribeName},
         { $set: { name: tribeName }},
         {safe: true, upsert: true, new: true},        
         function(err, tribe) {
       		for (var index in data) {
       		   var jobj = data[index];
       		   var princess = new Princess({
       		      firstName: jobj['First Name'],
       		      lastName: jobj['Last Name'],
       		      moniker: jobj['Princess Name'],
       		      birthday: new Date(jobj['Birthday']),
       		      gender: "female",
       		      tribe: tribe._id
       		   });		  
       		   princess.save(function(err) {
       		      if (err) return next(err);
       		   });
            }
       });	   	   
   };
   
   res.status(200).send(data);
});

app.get('/api/initialscores', function(req, res, next) {

   var archery = new Event({
      name: 'Archery'
   });
   var riflery = new Event({
      name: 'Riflery'
   });
   var canoeing = new Event({
      name: 'Canoeing'
   });
   archery.save();
   riflery.save();
   canoeing.save();

   function getPrincessIdByMoniker(moniker, callback) {
     Tribe.findOne({name:'Barking Spider'}, function(err, tribe) {
       if (err) return next(err);
       if (!tribe) {
         res.status(404).send({message: 'no bark in bite'});
       }
       Princess.findOneAndUpdate({moniker: moniker}, {tribe: tribe}, function(err, princess) {
          callback(princess);
       });
     });
   };

   getPrincessIdByMoniker("Golden Butterfly", function(princess) {
      var score1 = new Score({
         eventId: archery._id,
            kind: 'points',
            value: '156',
            metadata: [{
              key: 'bullseyes',
              value: '2'
            }]
      });
      var score2 = new Score({
         eventId: riflery._id,
            kind: 'points',
            value: '48',
            metadata:[{
              key: 'bullseyes',
              value: '1'
            }]
      });
      var score3 = new Score({
         eventId: canoeing._id,
            kind: 'time',
            value: '1:0:0:001'
      });
      score1.save(function(err) {
          if (err) return next(err);
      });
      score2.save(function(err) {
          if (err) return next(err);
      });
      score3.save(function(err) {
          if (err) return next(err);
      });
      Princess.update({_id: princess._id},
         { $set:
            {
              scores: [ score1, score2, score3 ]
            }
         },
         function(err) {
            if (err) return next(err);
      });
   });

   getPrincessIdByMoniker("Fluttering Ladybug", function(princess) {
      var score1 = new Score({
         eventId: archery._id,
            kind: 'points',
            value: '63',
            metadata: [{
              key: 'bullseyes',
              value: '4'
            }]
      });
      var score2 = new Score({
         eventId: riflery._id,
            kind: 'points',
            value: '55',
            metadata: [{
              key: 'bullseyes',
              value: '3'
            }]
      });
      var score3 = new Score({
         eventId: canoeing._id,
            kind: 'time',
            value: '1:0'
      });
      score1.save(function(err) {
          if (err) return next(err);
      });
      score2.save(function(err) {
          if (err) return next(err);
      });
      score3.save(function(err) {
          if (err) return next(err);
      });
      Princess.update({_id: princess._id},
         { $set:
            {
              scores: [ score1, score2, score3 ]
            }
         },
         function(err) {
            if (err) return next(err);
      });
   });
   res.status(200).send({message: 'ok'});
});

/**
 * GET /api/events/
 * Gets list of events
 */
app.get('/api/events', cors(corsOptions), function(req, res, next) {
  Event.find().lean().exec(function (err, events) {
      return res.end(JSON.stringify(events));
  });
});

app.get('/api/scores/:tribe/:event', function(req, res, next) {
  var tribeId = req.params.tribe;
  var eventId = req.params.event;
  Princess.find({tribe: tribeId})
      .populate({
         path: 'scores',
         match: {eventId, eventId},
         populate: {
            path: 'eventId',
             model: 'Event'
         } 
      })
      .exec(function (err, princesses) {
      return res.end(JSON.stringify(princesses));
  });
});

app.get('/api/scores/:tribe', cors(corsOptions), function(req, res, next) {
  var tribeId = req.params.tribe;
  var eventId = req.params.event;
  Princess.find({tribe: tribeId})
      .populate({
         path: 'scores',
         populate: {
            path: 'eventId',
             model: 'Event'
         } 
      })
      .exec(function (err, princesses) {
      return res.end(JSON.stringify(princesses));
  });
});

app.get('/api/editscore/:event/:princess', cors(corsOptions), function(req, res, next) {
  var princess = req.params.princess;
  var event = req.params.event;
  Score.find({eventId: event})
     .populate({
          path: 'tribeId',
          select: 'leaders.firstName'
     })    
     .populate({
          path: 'princessId',
          select: 'firstName lastName -birthday age'
     }) 
     .populate('eventId')
     .exec(function (err, scores) {
      return res.end(JSON.stringify(scores));
  });
});

/**
 * POST /api/score
 *
 */
app.options('/api/score', cors());
app.put('/api/score', cors(corsOptions), function(req, res, next) {
  var eventId = req.body.eventId;
  var princessId = req.body.princessId;
  var score = req.body.score;
  var kind = req.body.kind;
  var metakey = req.body.metakey;
  var metavalue = req.body.metavalue;
  var scoreId = req.body.scoreId;
  try {
	console.log(metakey);
	if (metakey !=null && metavalue != null) {
		var newMeta = "{key: "+metakey+", value: "+metavalue+"}";
		console.log(newMeta);
	    Score.findByIdAndUpdate(
	        scoreId,
	        {$set: 
	           {
	        	 kind: kind, 
	             value: score,
	        	 "metadata": [ {key: metakey, value: metavalue} ]
	           }
		    }, 
		    {safe: true, upsert: true, new: true},
	        function(err, model) {
	           if (!err) {
	              if (!model) {
	                 res.status(200).send({model});
	              } else {
	            	 res.status(200).send({message: 'ok'});
	              }
	           } else {
	        	   res.status(503).send({message: 'something went bye bye'});
	           }
	        }
	    );
	} else {
		console.log('wut?');
	    Score.findByIdAndUpdate(
	        scoreId,
	        {$set: 
	           {
	        	 kind: kind, 
	             value: score
	           }
		    },      
	        {safe: true, upsert: true, new: true},
	        function(err, model) {
	           if (!err) {
	              if (!model) {
	                 res.status(200).send({model});
	              } else {
	            	 res.status(200).send({message: 'ok'});
	              }
	           } else {
	        	   res.status(503).send({message: 'something went bye bye'});
	           }
	        }
	    );		
	}
  } catch (e) {
    res.status(404).send({ message: 'error '+e });
  }
});


//  Princess.findByIdAndUpdate(
//        princessId,
//        {$push: {"scores": {eventId: eventId, "score": {kind: kind, score: score}}}},
//        {safe: true, upsert: true, new : true},
//        function(err, model) {
//            console.log(err);
//        }
//    );
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
