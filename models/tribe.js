var mongoose = require('mongoose');

var tribeSchema = new mongoose.Schema({
  name: { 
        type: String, 
        unique: true,
        index: true
    },
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'Member'}],
  leaders: [{
        title: String, 
        member: {type: mongoose.Schema.Types.ObjectId, ref: 'Member'}
    }],
  nationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nation'
    }
});

module.exports = mongoose.model('Tribe', tribeSchema);

