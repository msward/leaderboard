var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  name: {type: String, unique: true, index: true},
  scoring: {type: String, unique: false},
  image: String
});

module.exports = mongoose.model('Event', eventSchema);
