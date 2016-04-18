var mongoose = require('mongoose');

var nationSchema = new mongoose.Schema({
  name: {type: String, unique: true, index: true},
  image: String
});

module.exports = mongoose.model('Nation', nationSchema);
