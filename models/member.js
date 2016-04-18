var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  moniker: String,
  email: String,
  phone: String,
  participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Princess'}],
  tribe: {type: mongoose.Schema.Types.ObjectId, ref: 'Tribe'}
});

module.exports = mongoose.model('Member', memberSchema);
