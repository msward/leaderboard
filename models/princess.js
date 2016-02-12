var mongoose = require('mongoose');

var princessSchema = new mongoose.Schema({
  princessId: { type: String, unique: true, index: true },
  name: String,
  birthday: { type: Date, default : Date.now },
  gender: String,
});

module.exports = mongoose.model('Princess', princessSchema);
